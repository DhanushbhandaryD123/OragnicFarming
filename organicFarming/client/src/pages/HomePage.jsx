import './HomePage.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const goToServices = () => navigate('/services');
  const goToSites = () => navigate('/sites'); // NEW

  return (
    <div className="hp">
      {/* HERO */}
      <section className="hp-hero">
        <div className="hp-hero-inner">
          <h1>Buy Direct From Local Farmers</h1>
          <p>
            The best organically grown produce from local farmers, harvested only after receiving the order.<br />
            That means you get the freshest possible produce home delivered.
          </p>
          <img
            src="2-e1646116451988-768x320.png"
            alt="Order Now"
            className="hp-cta-img"
            onClick={goToServices}
          />

          <div className="hp-hero-illustration">
            <img
              src="/images/hero-farm.svg"
              alt="Farm illustration"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>
        </div>
      </section>

      {/* WAYS TO BUY */}
      <section className="hp-ways">
        <h2>Different ways to buy on <span className="brand">Farmizen</span></h2>
        <div className="hp-ways-grid">
          {[
            { title: 'EXPRESS STORE', img: 'Subscriptions.jpg', desc: 'Vegetables, greens, fruits, microgreens – order in the morning for same day harvest & door delivery.' },
            { title: 'SOCIETY TRIBES', img: '3.png', desc: 'Order from a social marketplace – groceries, fruits, vegetables & more. Tribes deliver the order in one go for your community.' },
            { title: 'SUBSCRIPTIONS', img: '1.png', desc: 'Fresh veggies box, fruits, and cow milk – never miss organic goodness with planned deliveries!' },
            { title: 'PRE - ORDERS', img: '2.png', desc: 'Pre-book the items you love; the farmer harvests and packs them fresh and time bound for quality.' },
          ].map((c, i) => (
            <div className="hp-way-card" key={i}>
              <div className="img-wrap">
                <img src={c.img} alt={c.title} />
              </div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

   {/* LEASING SITES CTA */}
<section className="hp-leasing">
  <div className="hp-leasing-inner">
    <h2>🌱 Lease Farmland</h2>
    <p>Looking to lease agricultural land? Explore available sites posted by local landowners.</p>
    <button className="hp-leasing-btn" onClick={goToSites}>
      View Leasing Sites
    </button>
  </div>
</section>

      {/* CONTACT ROW */}
      <section className="hp-contact">
        <h3>Reach Out To Us</h3>
        <div className="hp-contact-grid">
          <div className="hp-contact-card">
            <div className="icon phone">
              <img src="Telephone-icon-orange-300x300-1.png" alt="Phone" />
            </div>
            <div className="text">
              <strong>Call us at</strong>
              <span>080-47091764</span>
            </div>
          </div>

          <div className="hp-contact-card">
            <div className="icon whats">
              <img src="79dc31280371b8ffbe56ec656418e122-300x300.png" alt="WhatsApp" />
            </div>
            <div className="text">
              <strong>Whatsapp at</strong>
              <span>9972282243</span>
            </div>
          </div>

          <div className="hp-contact-card">
            <div className="icon mail">
              <img src="emailenvelopeinboxmailmessagesendicon-1320085879987098147-300x300.png" alt="Email" />
            </div>
            <div className="text">
              <strong>Email at</strong>
              <span>support@farmizen.com</span>
            </div>
          </div>
        </div>

        {/* Phone mock / app preview */}
        <div className="hp-phone-preview">
          <div className="phone">
            <img src="Real-6.png" alt="App screen" />
          </div>
          <ul className="hp-phone-points">
            <li><strong>Fresh & Traceable</strong><span>Know the farm & farmer who grows your food.</span></li>
            <li><strong>Doorstep Delivery</strong><span>Get it when it’s harvested, not when it’s old.</span></li>
            <li><strong>Better Nutrition</strong><span>Local, seasonal & minimally handled.</span></li>
          </ul>
        </div>
      </section>

      {/* QUOTE BANNER */}
      <section className="hp-quote">
        <div className="hp-quote-overlay" />
        <div className="hp-quote-inner">
          <blockquote>
            “If a farmer knows his customers he will never poison their food.
            If a customer knows the farmer growing his food, they won’t bargain with him.”
          </blockquote>
          <cite>— Jignesh Reddy, a natural farmer</cite>
        </div>
      </section>

      {/* CTA / APP */}
      <section className="hp-app-cta">
        <div className="seed" aria-hidden />
        <h3>Try The App Now.</h3>
        <p>Order freshly harvested, chemical-free food from trusted local farmers.</p>
        <div className="store-badges">
          <a href="#" className="badge">App Store</a>
          <a href="#" className="badge">Google Play</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="hp-footer">
        <div className="hp-footer-top">
          <div>
            <h4>Call us</h4>
            <p>080-47091764</p>
          </div>
          <div>
            <h4>WhatsApp</h4>
            <p>9972282243</p>
          </div>
          <div>
            <h4>Email</h4>
            <p>support@farmizen.com</p>
          </div>
        </div>
        <div className="hp-footer-bottom">
          <div className="social">
            <a href="#">fb</a><a href="#">ig</a><a href="#">x</a>
          </div>
          <p>© {new Date().getFullYear()} Farmizen. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
