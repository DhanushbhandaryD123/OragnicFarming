import './AdminProductPanel.css';

import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

const AdminProductPanel = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    available: true,
    farmerId: '',
    farmerName: ''
  });
  const [image, setImage] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [loadingFarmers, setLoadingFarmers] = useState(false);
  const [farmersErr, setFarmersErr] = useState('');

  const loadFarmers = async () => {
    setLoadingFarmers(true);
    setFarmersErr('');
    try {
      const { data } = await axios.get('http://localhost:5000/api/farmers');
      setFarmers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Load farmers failed:', e);
      setFarmersErr('Failed to load farmers');
      setFarmers([]);
    } finally {
      setLoadingFarmers(false);
    }
  };

  useEffect(() => { loadFarmers(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', form.name);
    data.append('price', String(form.price || 0));
    data.append('category', form.category);
    data.append('description', form.description);
    data.append('available', String(form.available));
    if (form.farmerId)   data.append('farmerId', form.farmerId);
    if (form.farmerName) data.append('farmerName', form.farmerName);
    if (image)           data.append('image', image);

    await axios.post('http://localhost:5000/api/products/add', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    alert('✅ Product uploaded!');
    setForm({
      name: '', price: '', category: '', description: '',
      available: true, farmerId: '', farmerName: ''
    });
    setImage(null);
  };

  return (
    <div className="admin-product-container">
      {/* <h2>📦 Admin Dashboard</h2> */}
      <form onSubmit={handleSubmit} className="admin-product-form">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} />

        <label className="checkbox-label">
          <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
          Available
        </label>

        <div className="farmer-section">
          <label>Farmer</label>
          <div className="farmer-select-row">
            <select
              name="farmerId"
              value={form.farmerId}
              onChange={handleChange}
            >
              <option value="">— Select Farmer —</option>
              {farmers.map(f => (
                <option key={f._id} value={f._id}>
                  {f.displayName}{f.location ? ` — ${f.location}` : ''}
                </option>
              ))}
            </select>
            <button type="button" className="reload-btn" onClick={loadFarmers}>Reload</button>
          </div>
          {loadingFarmers && <small className="loading-text">Loading farmers…</small>}
          {farmersErr && <small className="error-text">{farmersErr}</small>}
        </div>

        <input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" required />
        <button type="submit" className="upload-btn">Upload</button>
      </form>
    </div>
  );
};

export default AdminProductPanel;
