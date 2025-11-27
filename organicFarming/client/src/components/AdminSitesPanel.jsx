import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminSitesPanel.css";

export default function AdminSitesPanel() {
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState({
    owner: "",
    contact: "",
    address: "",
    district: "",
    size: "",
    price: "",
    status: "available",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editId, setEditId] = useState(null);

  // NEW: View modal state
  const [viewSite, setViewSite] = useState(null);

  useEffect(() => {
    fetchSites();
  }, []);

  // Fetch all sites
  const fetchSites = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sites");
      setSites(res.data);
    } catch (err) {
      console.error("Error fetching sites:", err);
    }
  };

  // Handle text input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => setImageFile(e.target.files[0]);

  // Save or update site
  const saveSite = async () => {
    if (!form.owner || !form.contact || !form.address || !form.district || !form.size || !form.price) {
      return alert("⚠️ Please fill all fields");
    }

    const data = new FormData();
    Object.keys(form).forEach((key) => data.append(key, form[key]));
    if (imageFile) data.append("image", imageFile);

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/sites/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Site updated!");
      } else {
        await axios.post("http://localhost:5000/api/sites", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Site added!");
      }

      // Reset form
      setForm({
        owner: "",
        contact: "",
        address: "",
        district: "",
        size: "",
        price: "",
        status: "available",
      });
      setImageFile(null);
      setEditId(null);

      fetchSites();
    } catch (err) {
      console.error("Error saving site:", err);
      alert("❌ Failed to save site");
    }
  };

  // Load site for editing
  const editSite = (site) => {
    setForm({
      owner: site.owner,
      contact: site.contact,
      address: site.address,
      district: site.district,
      size: site.size,
      price: site.price,
      status: site.status,
    });
    setEditId(site._id);
    setImageFile(null);
  };

  // Delete site
  const deleteSite = async (id) => {
    if (window.confirm("Delete this site?")) {
      try {
        await axios.delete(`http://localhost:5000/api/sites/${id}`);
        fetchSites();
      } catch (err) {
        console.error("Error deleting site:", err);
        alert("❌ Failed to delete site");
      }
    }
  };

  return (
    <div className="sites-container">
      <h2>🏞️ Manage Lease Sites</h2>

      {/* Form */}
      <div className="form-group">
        <input type="text" name="owner" placeholder="Owner Name" value={form.owner} onChange={handleChange} />
        <input type="text" name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" value={form.address} onChange={handleChange} />
        <input type="text" name="district" placeholder="District" value={form.district} onChange={handleChange} />
        <input type="number" name="size" placeholder="Size (acres)" value={form.size} onChange={handleChange} />
        <input type="number" name="price" placeholder="Lease Price" value={form.price} onChange={handleChange} />

        <select name="status" value={form.status} onChange={handleChange}>
          <option value="available">Available</option>
          <option value="leased">Leased</option>
        </select>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <button onClick={saveSite}>
          {editId ? "💾 Save Changes" : "➕ Add Site"}
        </button>
      </div>

      {/* Sites List */}
      <h3>All Sites</h3>

      <ul>
        {sites.map((site) => (
          <li key={site._id} className="site-item">
            <p><strong>Owner:</strong> {site.owner}</p>
            <p><strong>Contact:</strong> {site.contact}</p>
            <p><strong>Address:</strong> {site.address}</p>
            <p><strong>District:</strong> {site.district}</p>
            <p><strong>Size:</strong> {site.size} acres</p>
            <p><strong>Price:</strong> ₹{site.price}</p>
            <p><strong>Status:</strong> {site.status}</p>

            {site.image && (
              <img
                src={`http://localhost:5000/uploads/${site.image}`}
                alt="Site"
                className="site-image"
              />
            )}

            <div className="actions">
              <button onClick={() => setViewSite(site)}>👁️ View</button>
              <button onClick={() => editSite(site)}>✏️ Edit</button>
              <button onClick={() => deleteSite(site._id)}>❌ Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* VIEW MODAL */}
      {viewSite && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>📍 Site Details</h2>

            <p><strong>Owner:</strong> {viewSite.owner}</p>
            <p><strong>Contact:</strong> {viewSite.contact}</p>
            <p><strong>Address:</strong> {viewSite.address}</p>
            <p><strong>District:</strong> {viewSite.district}</p>
            <p><strong>Size:</strong> {viewSite.size} acres</p>
            <p><strong>Price:</strong> ₹{viewSite.price}</p>
            <p><strong>Status:</strong> {viewSite.status}</p>

            {viewSite.image && (
              <img
                src={`http://localhost:5000/uploads/${viewSite.image}`}
                alt="Site"
                className="modal-image"
              />
            )}

            <button className="close-btn" onClick={() => setViewSite(null)}>
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
