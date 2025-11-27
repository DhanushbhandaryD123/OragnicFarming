import React, { useState } from 'react';
import AdminFarmersPage from './AdminFarmersPage';
import AdminProductPanel from './AdminProductPanel';
import Orders from './Orders';
import ProductList from './ProductList';
import AdminSitesPanel from './AdminSitesPanel';
import AdminTrackingSites from './AdminTrackingSites'; // ✅ New tracking page
import './AdminDashboard.css';

export default function AdminDashboard({ onLogout }) {
  const [activeSection, setActiveSection] = useState("addProduct");

  // Function to render the active section panel
  const renderSection = () => {
    switch (activeSection) {
      case "addProduct":
        return <AdminProductPanel />;
      case "orders":
        return <Orders />;
      case "farmers":
        return <AdminFarmersPage />;
      case "products":
        return <ProductList isAdmin={true} />;
      case "sites":
        return <AdminSitesPanel />; // Lease Sites panel
      case "tracking":
        return <AdminTrackingSites />; // ✅ Tracking panel
      default:
        return null;
    }
  };

  // Sidebar items with consistent keys
  const sidebarItems = [
    { key: "addProduct", label: "➕ Add Product" },
    { key: "orders", label: "📦 Orders" },
    { key: "farmers", label: "👨‍🌾 Farmers" },
    { key: "products", label: "🛒 View Products" },
    { key: "sites", label: "🏞️ Lease Sites" },
    { key: "tracking", label: "📊 Contact Tracking" }, // ✅ New sidebar item
  ];

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">🌿 Admin Panel</h2>
        <ul className="sidebar-list">
          {sidebarItems.map(item => (
            <li
              key={item.key}
              className={`sidebar-item ${activeSection === item.key ? 'active' : ''}`}
              onClick={() => setActiveSection(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>

        <button className="btn-logout" onClick={onLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        {renderSection()}
      </main>
    </div>
  );
}
