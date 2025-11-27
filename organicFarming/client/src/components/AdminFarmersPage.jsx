// src/components/AdminFarmersPage.jsx
import './FarmersPage.css';

import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

export default function AdminFarmersPage() {
  const [list, setList]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  // Create form state
  const [createForm, setCreateForm] = useState({
    displayName: '',
    location: '',
    yearsExp: '',
    specialties: '',
    bio: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // NEW: certificates chosen in the create form
  const [createCerts, setCreateCerts] = useState([]);   // File[]
  const [certPreviews, setCertPreviews] = useState([]); // [{name, url, isImg}]

  const toUrl = (u = '') => (u?.startsWith('http') ? u : `http://localhost:5000${u}`);
  const isImg = (name = '') => /\.(png|jpe?g|gif|webp)$/i.test(name);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get('http://localhost:5000/api/farmers/admin');
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError('Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onPhotoChange = (e) => {
    const f = e.target.files?.[0] || null;
    setPhotoFile(f);
    setPhotoPreview(f ? URL.createObjectURL(f) : '');
  };

  // NEW: handle certificate files for create form
  const onCertsChange = (e) => {
    const files = Array.from(e.target.files || []);
    setCreateCerts(files);
    setCertPreviews(files.map(f => ({
      name: f.name,
      url: isImg(f.name) ? URL.createObjectURL(f) : '',
      isImg: isImg(f.name)
    })));
  };

  const createFarmer = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('displayName', createForm.displayName);
      fd.append('location',    createForm.location);
      fd.append('yearsExp',    createForm.yearsExp || '');
      fd.append('specialties', createForm.specialties || '');
      fd.append('bio',         createForm.bio || '');
      if (photoFile) fd.append('photo', photoFile);

      // NEW: append certificates to the same request
      for (const f of createCerts) fd.append('certificates', f);

      await axios.post('http://localhost:5000/api/farmers/admin', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // reset
      setCreateForm({ displayName:'', location:'', yearsExp:'', specialties:'', bio:'' });
      setPhotoFile(null);
      setPhotoPreview('');
      setCreateCerts([]);
      setCertPreviews([]);

      await load();
      alert('Farmer created');
    } catch (e) {
      alert(e.response?.data?.message || 'Create failed');
    }
  };

  const removeFarmer = async (id) => {
    if (!confirm('Delete this farmer?')) return;
    await axios.delete(`http://localhost:5000/api/farmers/admin/${id}`);
    await load();
  };

  return (
    <div className="admin-farmers-page">
      <h2>Admin — Farmer Profiles</h2>

      {/* Create farmer */}
      <section className="section-box">
        <h3>Create Farmer</h3>
        <form onSubmit={createFarmer} className="create-farmer-form">
          <input
            placeholder="Name"
            value={createForm.displayName}
            onChange={e => setCreateForm({ ...createForm, displayName: e.target.value })}
            required
          />
          <input
            placeholder="Location"
            value={createForm.location}
            onChange={e => setCreateForm({ ...createForm, location: e.target.value })}
          />
          <input
            placeholder="Years of Experience"
            type="number"
            min="0"
            value={createForm.yearsExp}
            onChange={e => setCreateForm({ ...createForm, yearsExp: e.target.value })}
          />
          <input
            placeholder="Specialties (comma separated)"
            value={createForm.specialties}
            onChange={e => setCreateForm({ ...createForm, specialties: e.target.value })}
          />
          <textarea
            placeholder="Bio"
            rows={3}
            value={createForm.bio}
            onChange={e => setCreateForm({ ...createForm, bio: e.target.value })}
          />

          {/* Photo */}
          <div className="upload-row">
            <label className="lbl">Photo</label>
            <input type="file" accept="image/*" onChange={onPhotoChange} />
          </div>
          {photoPreview && (
            <img src={photoPreview} alt="preview" className="photo-preview" />
          )}

          {/* NEW: Certificates (multi) */}
          <div className="upload-row">
            <label className="lbl">Certificates</label>
            <input type="file" multiple accept=".png,.jpg,.jpeg,.gif,.webp,.pdf" onChange={onCertsChange} />
          </div>
          {certPreviews.length > 0 && (
            <div className="cert-previews">
              {certPreviews.map((c, i) => (
                <div key={i} className="cert-chip">
                  {c.isImg ? <img src={c.url} alt={c.name} /> : <span className="pdf-dot">PDF</span>}
                  <span className="cert-name" title={c.name}>{c.name}</span>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn-primary btn-full">Create Farmer</button>
        </form>
      </section>

      {/* List & manage */}
      <section className="farmers-list-section">
        <h3>All Farmers</h3>
        {loading && <p>Loading…</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !list.length && <p>No farmers yet.</p>}

        <div className="farmers-grid">
          {list.map(f => {
            const photo = f.photoUrl ? toUrl(f.photoUrl) : '';
            return (
              <div key={f._id} className="farmer-card">
                <div className="farmer-top">
                  {photo ? (
                    <img src={photo} alt={f.displayName} className="farmer-photo" />
                  ) : (
                    <div className="farmer-photo placeholder">No Photo</div>
                  )}
                  <div className="farmer-main">
                    <div className="farmer-name">{f.displayName}</div>
                    <div className="farmer-location">{f.location || '—'}</div>
                    <div className="farmer-meta">
                      {typeof f.yearsExp === 'number' ? `Experience: ${f.yearsExp} years` : 'Experience: —'}
                    </div>
                    <div className="farmer-meta">
                      {Array.isArray(f.specialties) && f.specialties.length
                        ? f.specialties.join(', ')
                        : 'Specialties: —'}
                    </div>
                  </div>
                </div>

                {f.bio ? <div className="farmer-bio">{f.bio}</div> : null}

                <div className="cert-title">Certificates</div>
                {f.certificates?.length ? (
                  <div className="cert-grid">
                    {f.certificates.map(c => {
                      const url = toUrl(c.url);
                      const img = isImg(c.filename || c.label);
                      return (
                        <div key={c._id} className="cert-tile">
                          {img ? (
                            <img src={url} alt={c.label || c.filename} />
                          ) : (
                            <a className="cert-pdf" href={url} target="_blank" rel="noreferrer">
                              {c.label || c.filename}
                            </a>
                          )}
                          <div className="cert-date">{new Date(c.uploadedAt).toLocaleString()}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-cert-text">No certificates uploaded.</div>
                )}

                <div className="farmer-actions">
                  <button className="btn-danger" onClick={() => removeFarmer(f._id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
