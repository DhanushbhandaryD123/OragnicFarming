import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import "./AdminTrackingSites.css";

export default function AdminTrackingSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sites/contacts");
      if (Array.isArray(res.data)) {
        // Sort sites by total interactions descending
        const sortedSites = res.data.sort((a, b) => b.contacts.length - a.contacts.length);
        setSites(sortedSites);
      } else {
        setSites([]);
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading tracking data...</p>;

  // Prepare chart data
  const chartData = sites.map(site => ({
    name: site.owner,
    calls: site.contacts.filter(c => c.type === "call").length,
    whatsapp: site.contacts.filter(c => c.type === "whatsapp").length,
  }));

  return (
    <div className="tracking-container">
      <h2>📊 Site Contact Tracking</h2>

      {sites.length === 0 ? (
        <p>No interactions yet.</p>
      ) : (
        <>
          {/* Chart */}
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="calls" fill="#1f77b4" />
                <Bar dataKey="whatsapp" fill="#ff7f0e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <table className="tracking-table">
            <thead>
              <tr>
                <th>Owner</th>
                <th>Site Contact</th>
                <th>Address</th>
                <th>District</th>
                <th>Calls</th>
                <th>WhatsApp</th>
                <th>Total Interactions</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => {
                const calls = site.contacts.filter(c => c.type === "call").length;
                const whatsapp = site.contacts.filter(c => c.type === "whatsapp").length;
                const total = site.contacts.length;

                return (
                  <tr key={site._id} className={total > 0 ? "highlight-row" : ""}>
                    <td>{site.owner}</td>
                    <td>{site.contact}</td>
                    <td>{site.address}</td>
                    <td>{site.district}</td>
                    <td className="call-count">{calls}</td>
                    <td className="whatsapp-count">{whatsapp}</td>
                    <td className="total-count">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
