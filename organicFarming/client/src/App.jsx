import 'leaflet/dist/leaflet.css';
import './App.css';

import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// ✅ Components & Pages
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import AdminSitesPanel from './components/AdminSitesPanel';
import AdminTrackingSites from './components/AdminTrackingSites'; // ✅ New tracking page
import UserLayout from './Layout/UserLayout';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import FarmerProfilePublic from './pages/FarmerProfilePublic';
import FarmersList from './pages/FarmersList';
import HomePage from './pages/HomePage';
import MyOrders from './pages/MyOrders';
import SavedForLater from './pages/SavedForLater';
import ServicesPage from './pages/ServicesPage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerifyEmail from './pages/VerifyEmail';
import Wishlist from './pages/Wishlist';
import LeasingSitesPage from './pages/LeasingSitesPage';

export default function App() {
  // — Admin state (persisted) —
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === '1');

  useEffect(() => {
    if (isAdmin) localStorage.setItem('isAdmin', '1');
    else localStorage.removeItem('isAdmin');
  }, [isAdmin]);

  // — User state (persisted) —
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // — Handlers —
  const handleAdminLogin = () => setIsAdmin(true);
  const handleAdminLogout = () => setIsAdmin(false);

  const handleUserLogin = (u) => setUser(u);
  const handleUserLogout = () => setUser(null);

  return (
    <>
      <main style={{ padding: 20 }}>
        <Routes>
          {/* USER SIDE */}
          <Route element={<UserLayout user={user} handleUserLogout={handleUserLogout} />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage isLoggedIn={!!user} />} />
            <Route path="/cart" element={<CartPage user={user} />} />
            <Route path="/wishlist" element={<Wishlist user={user} />} />
            <Route path="/saved" element={<SavedForLater user={user} />} />
            <Route path="/my-orders" element={<MyOrders user={user} />} />
            <Route path="/farmers" element={<FarmersList />} />
            <Route path="/farmers/:id" element={<FarmerProfilePublic />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn onLogin={handleUserLogin} />} />

            {/* Leasing Sites */}
            <Route path="/leasing-sites" element={<LeasingSitesPage />} />
            <Route path="/sites" element={<LeasingSitesPage />} /> {/* Alias */}
          </Route>

          {/* ADMIN SIDE */}
          <Route
            path="/admin/login"
            element={isAdmin ? <Navigate to="/admin" /> : <AdminLogin onSuccess={handleAdminLogin} />}
          />
          <Route
            path="/admin"
            element={isAdmin ? <AdminDashboard onLogout={handleAdminLogout} /> : <Navigate to="/admin/login" replace />}
          />

          {/* ADMIN: Manage Sites */}
          <Route
            path="/admin/sites"
            element={isAdmin ? <AdminSitesPanel /> : <Navigate to="/admin/login" replace />}
          />

          {/* ADMIN: Tracking Site Interactions */}
          <Route
            path="/admin/tracking"
            element={isAdmin ? <AdminTrackingSites /> : <Navigate to="/admin/login" replace />}
          />

          {/* Catch-all route */}
          <Route path="*" element={<p style={{ textAlign: 'center' }}>404: Page Not Found</p>} />
        </Routes>
      </main>
    </>
  );
}
