import './CheckoutSuccess.css';

// src/pages/CheckoutSuccess.jsx
import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  Link,
  useSearchParams,
} from 'react-router-dom';

const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [order,   setOrder]   = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Missing session_id in URL');
      setLoading(false);
      return;
    }

    axios
      .get(`/api/orders/session?session_id=${sessionId}`)
      .then((res) => {
        if (res.data.order) {
          setOrder(res.data.order);
        } else {
          setError('Order not found');
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.response?.data?.error || 'Failed to load order.');
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  if (loading) {
    return <p>Loading your order…</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  // At this point, order must be non-null
  if (!order) {
    return <p className="error">Order data is unavailable.</p>;
  }

  return (
    <div className="checkout-success">
      <h2>Thank you for your purchase!</h2>

      <section className="order-summary">
        <h3>
          Order #<small>{order._id}</small>
        </h3>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total:</strong> ₹ {order.total}
        </p>

        <h4>Items:</h4>
        <ul>
          {order.products.map((p) => (
            <li key={p._id}>
              {p.name} × {p.quantity} = ₹ {p.price * p.quantity}
            </li>
          ))}
        </ul>

        <h4>Shipping Details:</h4>
        <p>
          <strong>Name:</strong> {order.customerName}
        </p>
        <p>
          <strong>Contact:</strong> {order.customerContact}
        </p>
        <p>
          <strong>Address:</strong> {order.address}
        </p>
      </section>

      <Link to="/" className="btn-back">
        Back to Home
      </Link>
    </div>
  );
};

export default CheckoutSuccess;
