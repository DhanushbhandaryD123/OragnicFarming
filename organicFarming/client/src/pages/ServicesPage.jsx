import './ServicesPage.css';

// src/pages/ServicesPage.jsx
import React from 'react';

import UserProductList from '../components/UserProductList';

const ServicesPage = ({ isLoggedIn }) => {
  
  return (
    
    <div className="services-page">
      <h2>Our Services</h2>
      <p>Browse our current offerings—straight from the farm to your table:</p>
      <UserProductList isLoggedIn={isLoggedIn} />
    {/* CONTACT BAR */}
<section className="ab-bar">
  <div className="ab-bar-inner">
    <div className="ab-col">
      <div className="title">Call us</div>
      <div className="value">080-47091764</div>
    </div>

    <div className="ab-col">
      <div className="title">WhatsApp</div>
      <div className="value">9972282243</div>
    </div>

    <div className="ab-col">
      <div className="title">Email</div>
      <div className="value">support@farmizen.com</div>
    </div>
  </div>

  <div className="ab-bar-footer">
    <div className="social">
      <a href="#" aria-label="Facebook">fb</a>
      <a href="#" aria-label="Instagram">ig</a>
      <a href="#" aria-label="X">x</a>
    </div>
    <div className="copy">© 2025 Farmizen. All rights reserved.</div>
  </div>
</section>
    </div>
  );

};

export default ServicesPage;
