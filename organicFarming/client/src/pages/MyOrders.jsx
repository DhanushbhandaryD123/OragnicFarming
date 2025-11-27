// src/pages/MyOrders.jsx
import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import OrderTracker from '../components/OrderStatusTracker';

export default function MyOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null); // which order is expanded

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/orders/user?email=${encodeURIComponent(user.email)}`
        );
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch user orders error:', err);
        setError('Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  if (!user) return <p>Please sign in to view your orders.</p>;
  if (loading) return <p>Loading your orders…</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div>
      <h2>My Orders</h2>

      {orders.map(o => (
        <div
          key={o._id}
          style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: 14,
            marginBottom: 16
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div><strong>Order ID:</strong> {o._id}</div>
              <div><strong>Date:</strong> {new Date(o.createdAt).toLocaleString()}</div>
              <div><strong>Total:</strong> ₹{Number(o.total || 0).toFixed(0)}</div>
              <div><strong>Payment:</strong> {(o.paymentMethod || '').toUpperCase()}</div>
              <div><strong>Status:</strong> {o.status}</div>
            </div>
            <div>
              <button
                onClick={() => setOpenId(openId === o._id ? null : o._id)}
                style={{ padding: '8px 12px' }}
              >
                {openId === o._id ? 'Hide Tracking' : 'Track Order'}
              </button>
            </div>
          </div>

          {openId === o._id && (
            <div style={{ marginTop: 12, background: '#fafafa', borderRadius: 8, padding: 8 }}>
              <OrderTracker orderId={o._id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
