// src/pages/FarmerProfilePublic.jsx
import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  Link,
  useParams,
} from 'react-router-dom';

export default function FarmerProfilePublic() {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [err, setErr] = useState('');

  const toUrl = (u='') => (u.startsWith('http') ? u : `http://localhost:5000${u}`);
  const isImg = (name='') => /\.(png|jpe?g|gif|webp)$/i.test(name);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/farmers/${id}`);
        setFarmer(data);
      } catch (e) {
        setErr('Failed to load farmer');
      }
    })();
  }, [id]);

  if (err) return <p style={{ color: 'red' }}>{err}</p>;
  if (!farmer) return <p>Loading…</p>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <Link to="/services">← Back to Products</Link>
      <h2 style={{ marginTop: 12 }}>{farmer.displayName}</h2>

      <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:16 }}>
        <div>
          {farmer.photoUrl ? (
            <img
              src={toUrl(farmer.photoUrl)}
              alt={farmer.displayName}
              style={{ width:'100%', height:220, objectFit:'cover', borderRadius:8 }}
            />
          ) : (
            <div style={{
              width: '100%', height: 220, borderRadius: 8,
              background:'#f3f3f3', display:'grid', placeItems:'center', color:'#888'
            }}>
              No Photo
            </div>
          )}
        </div>

        <div>
          {farmer.location && <p><strong>Location:</strong> {farmer.location}</p>}
          {typeof farmer.yearsExp === 'number' && <p><strong>Experience:</strong> {farmer.yearsExp} years</p>}
          {farmer.specialties?.length ? (
            <p><strong>Specialties:</strong> {farmer.specialties.join(', ')}</p>
          ) : null}
          {farmer.bio && <p style={{ marginTop: 8 }}>{farmer.bio}</p>}
        </div>
      </div>

      <h3 style={{ marginTop: 24 }}>Certificates</h3>
      {farmer.certificates?.length ? (
        <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))' }}>
          {farmer.certificates.map(c => {
            const url = toUrl(c.url);
            return (
              <div key={c._id} style={{ border:'1px solid #eee', borderRadius:8, padding:8 }}>
                {isImg(c.filename || c.label) ? (
                  <img src={url} alt={c.label || c.filename}
                       style={{ width:'100%', height:140, objectFit:'cover', borderRadius:6 }} />
                ) : (
                  <a href={url} target="_blank" rel="noreferrer">{c.label || c.filename}</a>
                )}
                <div style={{ fontSize:12, color:'#666', marginTop:6 }}>
                  {new Date(c.uploadedAt).toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No certificates uploaded.</p>
      )}
    </div>
  );
}
