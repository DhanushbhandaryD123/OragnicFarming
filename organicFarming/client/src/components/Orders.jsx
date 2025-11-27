import './Orders.css';

import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import OrderStatusTracker from './OrderStatusTracker';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);
  const [form, setForm] = useState({});

  const setFormFor = (id, patch) =>
    setForm((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), ...patch },
    }));

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/orders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data: updated } = await axios.patch(
        `http://localhost:5000/api/orders/${orderId}`,
        { status: newStatus }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updated : o))
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Could not update status");
    }
  };

  const appendStatus = async (orderId) => {
    const { newStatus, note } = form[orderId] || {};
    if (!newStatus) return alert("Enter a status");
    try {
      await axios.patch(
        `http://localhost:5000/api/orders/${orderId}/status-append`,
        { status: newStatus, note: note || "" }
      );
      alert("Status appended");
      setFormFor(orderId, { newStatus: "", note: "" });
    } catch (err) {
      console.error("Status append error:", err);
      alert("Could not append status");
    }
  };

  if (loading) return <p className="orders-loading">Loading orders…</p>;
  if (error) return <p className="orders-error">{error}</p>;
  if (orders.length === 0)
    return <p className="orders-empty">No orders yet.</p>;

  return (
    <div className="orders-container">
      <h3 className="orders-title">All Orders</h3>
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead className="orders-table-head">
            <tr>
              {["ID", "Date", "Total", "Payment", "Status", "Actions"].map(
                (header) => (
                  <th key={header} className="orders-th">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="orders-table-body">
            {orders.map((o) => {
              const pm = (o.paymentMethod || "cod").toLowerCase();
              const total =
                typeof o.total === "number"
                  ? `₹ ${o.total.toFixed(2)}`
                  : "—";
              const f = form[o._id] || {};

              return (
                <React.Fragment key={o._id}>
                  <tr className="orders-row">
                    <td className="orders-cell orders-id">{o._id}</td>
                    <td className="orders-cell orders-date">
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td className="orders-cell orders-total">{total}</td>
                    <td className="orders-cell orders-payment">
                      {pm.toUpperCase()}
                    </td>
                    <td className="orders-cell orders-status">
                      {pm === "card" ? (
                        <span className="status-badge status-paid">
                          Paid
                        </span>
                      ) : (
                        <select
                          value={o.status}
                          onChange={(e) =>
                            handleStatusChange(o._id, e.target.value)
                          }
                          className="status-select"
                        >
                          {["Pending", "Paid"].map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="orders-cell orders-actions">
                      <button
                        onClick={() =>
                          setOpenId(openId === o._id ? null : o._id)
                        }
                        className="btn btn-track"
                      >
                        {openId === o._id ? "Hide Tracking" : "Track Order"}
                      </button>
                    </td>
                  </tr>

                  {openId === o._id && (
                    <tr className="orders-tracking-row">
                      <td colSpan={6} className="orders-tracking-cell">
                        <div className="tracking-form-grid">
                          <div className="tracking-input-group">
                            <label className="tracking-label">
                              New Status
                            </label>
                            <input
                              type="text"
                              value={f.newStatus || ""}
                              onChange={(e) =>
                                setFormFor(o._id, { newStatus: e.target.value })
                              }
                              placeholder="Out for Delivery"
                              className="tracking-input"
                            />
                          </div>
                          <div className="tracking-input-group">
                            <label className="tracking-label">
                              Note
                            </label>
                            <input
                              type="text"
                              value={f.note || ""}
                              onChange={(e) =>
                                setFormFor(o._id, { note: e.target.value })
                              }
                              placeholder="Left warehouse"
                              className="tracking-input"
                            />
                          </div>
                          <div className="tracking-button-wrapper">
                            <button
                              onClick={() => appendStatus(o._id)}
                              className="btn btn-append-status"
                            >
                              Append Status
                            </button>
                          </div>
                        </div>

                        <OrderStatusTracker orderId={o._id} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
