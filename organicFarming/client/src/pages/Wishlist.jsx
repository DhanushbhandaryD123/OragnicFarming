// src/pages/Wishlist.jsx
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useCart } from '../context/CartContext';

export default function Wishlist({ user }) {
  const { addToCart } = useCart();

  const WL_KEY = useMemo(
    () => (user ? `wishlist_${user.email}` : 'wishlist_guest'),
    [user]
  );
  const [items, setItems] = useState([]);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(WL_KEY) || '[]')); }
    catch { setItems([]); }
  }, [WL_KEY]);

  const persist = (list) => localStorage.setItem(WL_KEY, JSON.stringify(list));

  const remove = (id) => {
    const next = items.filter(p => p._id !== id);
    setItems(next);
    persist(next);
  };

  const moveToCart = (prod) => {
    // add to cart
    addToCart(prod);
    // remove from wishlist
    const next = items.filter(p => p._id !== prod._id);
    setItems(next);
    persist(next);
  };

  if (!user) return <p>Please sign in</p>;
  if (!items.length) return <p>Your wishlist is empty.</p>;

return (
  <div>
    <h2> Your Wishlist </h2>
     <div style={{
      display: 'flex',
      gap: 20,
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      marginTop:'20px'
    }}>
       {items.map(p => {
        const imgSrc = p.imageUrl?.startsWith('http')
          ? p.imageUrl
          : `http://localhost:5000${p.imageUrl || ''}`;
         return (
          <div
            key={p._id}
            style={{
              width: 220, // small card width
              height:'250px',
              border: '1px solid #ddd',
              borderRadius: 10,
              backgroundColor: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: 12
            }}
          >
              {p.imageUrl && (
              <img
                src={imgSrc}
                alt={p.name}
                style={{
                  width: '100%',
                  height: 140,
                  objectFit: 'cover',
                  borderRadius: 6,
                  marginBottom: 10
                }}
              />
            )}
           <div style={{
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: 4,
              textAlign: 'center'
            }}>
              {p.name}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#555' }}>₹ {p.price}</div>
            <div style={{
              display: 'flex',
              gap: 8,
              marginTop: 10
            }}>
              <button
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 5,
                  cursor: 'pointer'
                }}
                onClick={() => moveToCart(p)}
              >
                Move to cart
              </button>
              <button
                style={{
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 5,
                  cursor: 'pointer'
                }}
                onClick={() => remove(p._id)}
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>

);

}
