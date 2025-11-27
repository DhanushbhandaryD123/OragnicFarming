import './AboutPage.css';

import React from 'react';

export default function AboutPage() {
  return (
   
    <div className="about">
      {/* HERO */}
      <section className="ab-hero">
        <div className="ab-hero-inner">
          <h1>
            Your Plants. Your Food.
            <br />
            Our Future.
          </h1>
          <div className="ab-divider" />
          <p>
            We have set out to build a food eco-system that’s better for consumers,
            better for farmers, and better for the planet.
          </p>
        </div>
      </section>

      {/* STORY BLOCK 1 */}
      <section className="ab-story">
        <div className="ab-story-img">
          <img src="OIP.webp" alt="Farmers in field" />
        </div>
        <div className="ab-story-text">
          <h2>Connecting Farmers & Communities</h2>
          <p>
            We bridge the gap between small farmers and urban consumers, ensuring
            fair prices for farmers and fresh, chemical-free produce for you.
          </p>
        </div>
      </section>

      {/* STORY BLOCK 2 */}
      <section className="ab-story reverse">
        <div className="ab-story-img">
          <img src="OIP (1).webp" alt="Organic vegetables" />
        </div>
        <div className="ab-story-text">
          <h2>Fresh, Local, Sustainable</h2>
          <p>
            Our network focuses on sustainability, short supply chains, and
            protecting the environment while giving you the best seasonal
            produce.
          </p>
        </div>
      </section>

      {/* SPLIT CTA BAND */}
      <section className="ab-split">
        {/* <div className="ab-split-img" aria-hidden="true">
          <img src="/images/about-split.jpg" alt="Work with us" />
        </div> */}
        <div className="ab-split-cta">
          {/* <div className="ab-split-cta-inner">
            <h3>Want to join our team ?</h3>
            <button className="ab-btn ab-btn-light">CURRENT OPENINGS</button>
          </div> */}
        </div>
      </section>
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
}
