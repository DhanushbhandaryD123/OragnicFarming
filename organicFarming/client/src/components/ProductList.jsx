import './Productlist.css';

// components/ProductList.jsx
import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [farmers, setFarmers] = useState([]);
  const [farmersErr, setFarmersErr] = useState('');
  const [loadingFarmers, setLoadingFarmers] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    available: true,
    image: null,
    farmerId: '',     // new
    farmerName: ''    // new
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      // product should include farmer (populated) or farmerName snapshot
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const loadFarmers = async () => {
    setLoadingFarmers(true);
    setFarmersErr('');
    try {
      const { data } = await axios.get('http://localhost:5000/api/farmers'); // approved/all per your route
      setFarmers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setFarmersErr('Failed to load farmers');
    } finally {
      setLoadingFarmers(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    loadFarmers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      available: product.available,
      image: null,
      farmerId: product.farmer?._id || '',         // prefill
      farmerName: product.farmerName || ''          // prefill snapshot
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files?.[0] || null,
    }));
  };

  const handleUpdate = async (id) => {
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('available', String(formData.available));
      if (formData.farmerId)   data.append('farmerId', formData.farmerId);
      data.append('farmerName', formData.farmerName || ''); // safe
      if (formData.image)      data.append('image', formData.image);

      await axios.put(`http://localhost:5000/api/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const renderFarmerLabel = (p) =>
    (p.farmer?.displayName) || p.farmerName || '—';

 return (
  <div className="products-page">
    <h3 className="products-title">Available Products</h3>
    <div className="products-grid">
      {products.map((p) => (
        <div key={p._id} className="product-card">
          {editingId === p._id ? (
            <>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="input-field" />
              <input name="price" value={formData.price} onChange={handleChange} type="number" placeholder="Price" className="input-field" />
              <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" className="input-field" />
              <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="input-field" />
              
              <label className="checkbox-label">
                Available:
                <input name="available" type="checkbox" checked={formData.available} onChange={handleChange} />
              </label>

              {/* Farmer editor */}
              <div className="farmer-section">
                <label className="label-strong">Farmer</label>
                <div className="farmer-select-group">
                  <select
                    name="farmerId"
                    value={formData.farmerId}
                    onChange={handleChange}
                    className="select-field"
                  >
                    <option value="">— Select Farmer —</option>
                    {farmers.map(f => (
                      <option key={f._id} value={f._id}>
                        {f.displayName}{f.location ? ` — ${f.location}` : ''}
                      </option>
                    ))}
                  </select>
                  <button type="button" onClick={loadFarmers} className="btn-secondary">Reload</button>
                </div>
                {loadingFarmers && <small className="loading-text">Loading farmers…</small>}
                {farmersErr && <small className="error-text">{farmersErr}</small>}
                <input
                  name="farmerName"
                  placeholder="Or type farmer name (snapshot)"
                  value={formData.farmerName}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <input type="file" onChange={handleImageChange} className="file-input" />
              <div className="form-actions">
                <button onClick={() => handleUpdate(p._id)} className="btn-primary">Update</button>
                <button onClick={() => setEditingId(null)} className="btn-danger">Cancel</button>
              </div>
            </>
          ) : (
            <>
              {p.imageUrl && (
                <img
                  src={`http://localhost:5000${p.imageUrl}`}
                  alt={p.name}
                  className="product-image"
                />
              )}
              <h4 className="product-name">{p.name}</h4>
              <p className="product-price">₹ {p.price}</p>
              <p className="product-category">{p.category}</p>
              <p className="product-description">{p.description}</p>
              <p className="product-farmer"><strong>Farmer:</strong> {renderFarmerLabel(p)}</p>
              <p className="product-availability">Available: {p.available ? 'Yes' : 'No'}</p>
              <div className="product-actions">
                <button onClick={() => handleEdit(p)} className="btn-primary">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="btn-danger">Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </div>
);

};

export default ProductList;
