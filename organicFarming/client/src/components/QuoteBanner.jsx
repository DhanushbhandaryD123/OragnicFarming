import './QuoteBanner.css';

// QuoteBanner.jsx
import React, {
  useEffect,
  useRef,
} from 'react';

export default function QuoteBanner() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('in-view');
            // If you only want to animate once, unobserve:
            io.unobserve(el);
          }
        });
      },
      { root: null, threshold: 0.25 } // trigger when 25% visible
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="hp-quote reveal" ref={ref}>
      {/* The animating image */}
      <img
        className="hp-quote-img"
        src="photo-1615829254885-d4bfd5ce700e.avif"
        alt=""
        aria-hidden="true"
      />

      {/* Overlay + content */}
      <div className="hp-quote-overlay" />
      <div className="hp-quote-inner">
        <blockquote>
          “If a farmer knows his customers he will never poison their food.
          If a customer knows the farmer growing his food, they won’t bargain with him.”
        </blockquote>
        <cite>— Jignesh Reddy, a natural farmer</cite>
      </div>
    </section>
  );
}
