import { useState } from 'react';

import axios from 'axios';

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    available: true,
    farmer: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/products/add", form);
    alert("Product added!");
    setForm({ name: "", price: "", description: "", category: "", available: true, farmer: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Product</h3>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} type="number" required />
      <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
      <input name="farmer" placeholder="Farmer Name" value={form.farmer} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <label>
        Available
        <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
      </label>
      <button type="submit">Add</button>
    </form>
  );
};

export default AddProduct;
