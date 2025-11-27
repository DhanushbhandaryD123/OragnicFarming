// src/pages/SavedForLater.jsx
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useCart } from '../context/CartContext';

export default function SavedForLater({ user }) {
  const { addToCart } = useCart();

  const SAVED_KEY = useMemo(
    () => (user ? `saved_${user.email}` : 'saved_guest'),
    [user]
  );
  const [items, setItems] = useState([]);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(SAVED_KEY) || '[]')); }
    catch { setItems([]); }
  }, [SAVED_KEY]);

  const persist = (list) => localStorage.setItem(SAVED_KEY, JSON.stringify(list));

  const remove = (id) => {
    const next = items.filter(p => p._id !== id);
    setItems(next);
    persist(next);
  };

  const moveToCart = (prod) => {
    // add to cart
    addToCart(prod);
    // remove from saved
    const next = items.filter(p => p._id !== prod._id);
    setItems(next);
    persist(next);
  };

  if (!user) return <p>Please sign in</p>;
  if (!items.length) return <p>No items saved for later.</p>;

  return (
  <div style={{ padding: '20px' }}>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Saved for Later</h2>

    <div style={{
      display: 'grid',
      gap: '15px',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      alignItems:'start'
    }}>
      {items.map(p => {
        const imgSrc = p.imageUrl?.startsWith('http')
          ? p.imageUrl
          : `http://localhost:5000${p.imageUrl || ''}`;

        return (
          <div key={p._id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            backgroundColor: '#fff',
            transition: 'transform 0.2s ease',
            maxWidth: '250px',
            minHeight:'280px',
          }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {p.imageUrl && (
              <img
                src={imgSrc}
                alt={p.name}
                style={{
                  width: '100%',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}
              />
            )}
            <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{p.name}</div>
            <div style={{ fontSize: '0.9rem', color: '#444' }}>₹ {p.price}</div>

            <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
              <button
                onClick={() => moveToCart(p)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Move to cart
              </button>
              <button
                onClick={() => remove(p._id)}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  backgroundColor: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
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