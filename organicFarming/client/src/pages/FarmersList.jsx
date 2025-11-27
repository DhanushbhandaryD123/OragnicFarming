// src/pages/FarmersList.jsx
import './FarmersList.css';

import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

export default function FarmersList() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [q, setQ] = useState('');
  const [loc, setLoc] = useState('');

  const toUrl = (u = '') => (u.startsWith('http') ? u : `http://localhost:5000${u}`);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr('');
      try {
        const { data } = await axios.get('http://localhost:5000/api/farmers'); // approved only
        setFarmers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setErr('Failed to load farmers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const locations = useMemo(() => {
    const set = new Set();
    farmers.forEach(f => f.location && set.add(f.location));
    return Array.from(set).sort();
  }, [farmers]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return farmers.filter(f => {
      const matchesTerm =
        !term ||
        f.displayName?.toLowerCase().includes(term) ||
        f.location?.toLowerCase().includes(term) ||
        (Array.isArray(f.specialties) && f.specialties.join(' ').toLowerCase().includes(term));
      const matchesLoc = !loc || f.location === loc;
      return matchesTerm && matchesLoc;
    });
  }, [farmers, q, loc]);

  return (
    <div className="fl-page">
      <div className="fl-header">
        <h2>Farmers</h2>
        <div className="fl-filters">
          <input
            className="fl-input"
            placeholder="Search by name, specialty, location…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select className="fl-select" value={loc} onChange={e => setLoc(e.target.value)}>
            <option value="">All Locations</option>
            {locations.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading…</p>}
      {err && <p className="fl-err">{err}</p>}
      {!loading && !filtered.length && <p>No farmers found.</p>}

      <div className="fl-grid">
        {filtered.map(f => (
          <Link key={f._id} to={`/farmers/${f._id}`} className="fl-card">
            <div className="fl-photo-wrap">
              {f.photoUrl ? (
                <img className="fl-photo" src={toUrl(f.photoUrl)} alt={f.displayName} />
              ) : (
                <div className="fl-photo ph">No Photo</div>
              )}
            </div>
            <div className="fl-body">
              <div className="fl-name">{f.displayName}</div>
              <div className="fl-loc">{f.location || '—'}</div>
              {Array.isArray(f.specialties) && f.specialties.length ? (
                <div className="fl-tags">
                  {f.specialties.slice(0, 4).map((s, i) => (
                    <span key={i} className="fl-tag">{s}</span>
                  ))}
                  {f.specialties.length > 4 && (
                    <span className="fl-tag more">+{f.specialties.length - 4}</span>
                  )}
                </div>
              ) : (
                <div className="fl-tags muted">No specialties listed</div>
              )}
              <div className="fl-link">View Profile →</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
