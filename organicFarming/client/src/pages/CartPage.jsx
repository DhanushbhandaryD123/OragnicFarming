// src/pages/CartPage.jsx
import './CartPage.css';

import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';       // ← add

import { loadStripe } from '@stripe/stripe-js';

import { useCart } from '../context/CartContext';

// Initialize Stripe.js
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

const CartPage = ({ user }) => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
const navigate = useNavigate();                       // ← add

  const [customerName,    setCustomerName]    = useState('');
  const [customerContact, setCustomerContact] = useState('');
  const [address,         setAddress]         = useState('');
  const [paymentMethod,   setPaymentMethod]   = useState('card');
  const [loading,         setLoading]         = useState(false);

  const total = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const handleCheckout = async () => {
    if (!customerName || !customerContact || !address) {
      return alert('Please fill in all fields.');
    }
    setLoading(true);

    try {
      if (paymentMethod === 'card') {
        // 1) create Stripe session
        const { data } = await axios.post(
          'http://localhost:5000/api/orders/checkout',
          {
            cart,
            customerName,
            customerContact,
            address,
            userEmail: user.email,
          }
        );
        // 2) redirect with Stripe.js
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.id,
        });
        if (error) alert(error.message);

      } else {
        // COD
        await axios.post('http://localhost:5000/api/orders/place', {
          cart,
          customerName,
          customerContact,
          address,
          paymentMethod: 'cod',
          userEmail: user.email,
        });
        alert('Order placed successfully (COD).');
        clearCart();
+       navigate('/my-orders');                          // ← redirect to orders page
      }
    } catch (err) {
      console.error(err);
      alert('Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return <p className="empty-cart">Your cart is empty.</p>;
  }

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      <div className="cart-layout">
        {/* ITEMS */}
        <div className="cart-items">
          {cart.map((p) => (
            <div key={p._id} className="cart-item">
              {p.imageUrl && (
                <img
                  src={`http://localhost:5000${p.imageUrl}`}
                  alt={p.name}
                  className="cart-item-image"
                />
              )}
              <div className="cart-item-details">
                <h4>{p.name}</h4>
                <div className="quantity-control">
                  <button
                    onClick={() => updateQuantity(p._id, p.quantity - 1)}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={p.quantity}
                    onChange={(e) =>
                      updateQuantity(p._id, parseInt(e.target.value, 10) || 1)
                    }
                  />
                  <button
                    onClick={() => updateQuantity(p._id, p.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <p>₹ {p.price * p.quantity}</p>
                <button
                  className="btn-remove"
                  onClick={() => removeFromCart(p._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <strong>Total:</strong> ₹ {total}
          </div>
          <button className="btn-clear" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        {/* SHIPPING & PAYMENT */}
        <div className="shipping-form">
          <h3>Shipping Details</h3>
          <label>
            Name:
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </label>
          <label>
            Contact:
            <input
              type="text"
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value)}
            />
          </label>
          <label>
            Address:
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>

          <h4>Payment Method</h4>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Pay with Card
            </label>
            <label>
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>
          </div>

          <button
            className="btn-checkout"
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading
              ? 'Processing…'
              : paymentMethod === 'card'
              ? 'Checkout with Card'
              : 'Place Order (COD)'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
