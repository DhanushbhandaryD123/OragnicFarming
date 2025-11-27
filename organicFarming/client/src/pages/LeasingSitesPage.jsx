import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LeasingSitesPage.css";

export default function LeasingSitesPage() {
  const navigate = useNavigate();
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sites/all");
      if (Array.isArray(res.data)) setSites(res.data);
      else setSites([]);
    } catch (err) {
      console.error("Error fetching sites:", err);
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  // Track contact clicks with user info
  const trackContact = async (siteId, type) => {
    try {
      await axios.post(`http://localhost:5000/api/sites/track-contact`, {
        siteId,
        type, // "call" or "whatsapp"
        user: user?.email || "Guest", // send email if logged-in, otherwise Guest
      });
    } catch (err) {
      console.error("Failed to track contact:", err);
    }
  };

  if (loading) return <p>Loading sites...</p>;

  return (
    <div className="leasing-page">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back to Home
      </button>

      <h1>🌱 Lease Farmland</h1>
      <p className="sub">Explore available sites posted by local landowners.</p>

      <div className="sites-grid">
        {sites.length === 0 ? (
          <p style={{ textAlign: "center", color: "#555" }}>
            No leasing sites available currently.
          </p>
        ) : (
          sites.map((site) => (
            <div className="site-card" key={site._id}>
              {site.image ? (
                <img
                  src={`http://localhost:5000/uploads/${site.image}`}
                  alt={`Site of ${site.owner}`}
                  className="site-image"
                />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
              <div className="site-info">
                <p><strong>Owner:</strong> {site.owner}</p>
                <p><strong>Address:</strong> {site.address}</p>
                <p><strong>District:</strong> {site.district}</p>
                <p><strong>Size:</strong> {site.size} acres</p>
                <p><strong>Lease Price:</strong> ₹{site.price}</p>

                <div className="contact-buttons">
                  <a
                    href={`tel:${site.contact}`}
                    className="site-contact-btn"
                    onClick={() => trackContact(site._id, "call")}
                  >
                    📞 Call
                  </a>

                  <a
                    href={`https://wa.me/${site.contact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="site-contact-btn"
                    onClick={() => trackContact(site._id, "whatsapp")}
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
