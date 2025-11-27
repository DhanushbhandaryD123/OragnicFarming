import React from 'react';

import axios from 'axios';

export default function ProductCard({ product, user, onAddedToWishlist, onAddedToSaved, onAddToCart }) {
  const base = 'http://localhost:5000/api/users';

  const addToWishlist = async () => {
    if (!user) return alert('Please sign in');
    await axios.post(`${base}/me/wishlist/${product._id}?userId=${user.id}`);
    onAddedToWishlist?.(product._id);
  };

  const addToSaved = async () => {
    if (!user) return alert('Please sign in');
    await axios.post(`${base}/me/saved/${product._id}?userId=${user.id}`);
    onAddedToSaved?.(product._id);
  };

  return (
    <div className="product-card">
      <img src={product.imageUrl} alt={product.name} />
      <div className="title">{product.name}</div>
      <div className="price">₹ {product.price}</div>

      <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:8 }}>
        <button onClick={() => onAddToCart?.(product)} style={{ padding:'6px 10px' }}>
          Add to Cart
        </button>

        {/* Heart for wishlist */}
        <button onClick={addToWishlist} title="Add to wishlist" style={{ padding:'6px 10px' }}>
          ♥
        </button>

        {/* Save for later */}
        <button onClick={addToSaved} title="Save for later" style={{ padding:'6px 10px' }}>
          Save for later
        </button>
      </div>
    </div>
  );
}
