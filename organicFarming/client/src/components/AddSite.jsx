// src/components/AddSite.jsx
import { useState } from "react";
import axios from "axios";

const AddSite = ({ onSiteAdded }) => {
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

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.owner || !form.contact || !form.address || !form.district || !form.size || !form.price) {
      alert("⚠️ Please fill all fields");
      return;
    }

    try {
      const data = new FormData();
      Object.keys(form).forEach((key) => data.append(key, form[key]));
      if (imageFile) data.append("image", imageFile);

      const res = await axios.post("http://localhost:5000/api/sites", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Site added successfully!");
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

      // Notify parent component (AdminSitesPanel) to refresh list
      if (onSiteAdded) onSiteAdded(res.data);

    } catch (err) {
      console.error("Error adding site:", err);
      alert("❌ Failed to add site");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-site-form">
      <h3>➕ Add New Lease Site</h3>

      <input name="owner" placeholder="Owner Name" value={form.owner} onChange={handleChange} required />
      <input name="contact" placeholder="Contact Number" value={form.contact} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
      <input name="district" placeholder="District" value={form.district} onChange={handleChange} required />
      <input name="size" placeholder="Size (acres)" value={form.size} onChange={handleChange} required />
      <input name="price" placeholder="Lease Price (₹)" value={form.price} onChange={handleChange} required />
      <input type="file" accept="image/*" onChange={handleFileChange} required />

      <button type="submit">Add Site</button>
    </form>
  );
};

export default AddSite;
