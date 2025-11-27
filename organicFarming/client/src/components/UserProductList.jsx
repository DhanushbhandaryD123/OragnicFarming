// src/components/UserProductList.jsx
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';
import {
  FaHeart,
  FaRegHeart,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';          // <-- add

import { useCart } from '../context/CartContext';

const UserProductList = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null'); }
    catch { return null; }
  }, []);

  const WL_KEY    = user ? `wishlist_${user.email}` : 'wishlist_guest';
  const SAVED_KEY = user ? `saved_${user.email}`    : 'saved_guest';

  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem(WL_KEY) || '[]'); } catch { return []; }
  });
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  useEffect(() => { localStorage.setItem(WL_KEY, JSON.stringify(wishlist)); }, [WL_KEY, wishlist]);
  useEffect(() => { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)); }, [SAVED_KEY, saved]);

  const inWishlist = (id) => wishlist.some(p => p._id === id);

  const toggleWishlist = (product) => {
    if (!isLoggedIn) return alert('Please signup or signin first');
    setWishlist(prev =>
      inWishlist(product._id) ? prev.filter(p => p._id !== product._id) : [...prev, product]
    );
  };

  const saveForLater = (product) => {
    if (!isLoggedIn) return alert('Please signup or signin first');
    setSaved(prev => (prev.some(p => p._id === product._id) ? prev : [...prev, product]));
    alert('Saved for later!');
  };

 const renderFarmer = (p) => {
  // id can be an ObjectId string or embedded object with _id
  const id =
    typeof p.farmer === 'string' ? p.farmer :
    p.farmer && p.farmer._id ? p.farmer._id : null;

  const name = (p.farmer && p.farmer.displayName) || p.farmerName;

  if (id && name) {
    return (
      <p style={{ margin: '0.25rem 0' }}>
        <strong>Farmer:</strong>{' '}
        <Link to={`/farmers/${id}`}>{name}</Link>
      </p>
    );
  }

  // fallback: only a snapshot name, no id to link to
  return name ? (
    <p style={{ margin: '0.25rem 0' }}>
      <strong>Farmer:</strong> {name}
    </p>
  ) : null;
};


  return (
    <div>
      <h2>Available Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.map(p => (
          <div
            key={p._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '1rem',
              width: '220px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              opacity: p.available ? 1 : 0.6,
              position: 'relative'
            }}
          >
            <div
              title={inWishlist(p._id) ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={() => toggleWishlist(p)}
              style={{ position: 'absolute', top: 8, right: 8, cursor: 'pointer', fontSize: 18, color: inWishlist(p._id) ? 'red' : '#aaa' }}
            >
              {inWishlist(p._id) ? <FaHeart /> : <FaRegHeart />}
            </div>

            {p.imageUrl && (
              <img
                src={`http://localhost:5000${p.imageUrl}`}
                alt={p.name}
                style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 4, marginBottom: 8 }}
              />
            )}
            <h4 style={{ margin: '0.5rem 0' }}>{p.name}</h4>
            <p style={{ margin: '0.25rem 0', fontWeight: 'bold' }}>₹ {p.price}</p>
            <p style={{ margin: '0.25rem 0', fontStyle: 'italic' }}>{p.category}</p>
            {renderFarmer(p)} {/* <-- farmer link / name */}
            <p style={{ margin: '0.5rem 0' }}>{p.description}</p>
            <p><strong>Available:</strong> {p.available ? 'Yes' : 'No'}</p>

            <button
              style={{
                marginTop: 8, padding: '8px 12px', backgroundColor: p.available ? '#2e7d32' : '#999',
                color: '#fff', border: 'none', borderRadius: 4, cursor: p.available ? 'pointer' : 'not-allowed', width: '100%'
              }}
              disabled={!p.available}
              onClick={() => {
                if (!isLoggedIn) return alert('Please signup or signin first');
                addToCart(p);
                alert('Added to cart!');
              }}
            >
              {p.available ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              style={{ marginTop: 8, padding: '8px 12px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, width: '100%' }}
              onClick={() => saveForLater(p)}
            >
              Save for Later
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProductList;
