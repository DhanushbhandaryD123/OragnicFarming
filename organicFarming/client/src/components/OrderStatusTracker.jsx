import './OrderStatusTracker.css';

import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

export default function OrderStatusTracker({ orderId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let stop = false;
    const load = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${orderId}/track`);
        if (!stop) setData(res.data);
      } catch {
        if (!stop) setData(null);
      }
    };
    load();
    const t = setInterval(load, 15000); // poll every 15s
    return () => { stop = true; clearInterval(t); };
  }, [orderId]);

  return (
    <div className="tracker-container">
      <div className="tracker-status">
        <strong>Status:</strong> {data?.status ?? 'Loading…'}
      </div>

      <h4 className="tracker-title">Timeline</h4>
      {data?.tracking?.length ? (
        <ul className="tracker-timeline">
          {data.tracking.map((t, i) => (
            <li key={i} className="tracker-event">
              <span className="tracker-event-status">{t.status}</span>
              <span className="tracker-event-date">{new Date(t.at).toLocaleString()}</span>
              {t.note && <span className="tracker-event-note">— {t.note}</span>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="tracker-empty">No tracking events yet.</p>
      )}
    </div>
  );
}
