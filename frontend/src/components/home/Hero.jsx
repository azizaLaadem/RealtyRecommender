// src/components/home/Hero.jsx
import React from 'react';
import './Hero.css';

// src/components/Hero.jsx
const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Find Your Dream Home</h1>
        <p>
          Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision
        </p>
       
      </div>
      <div className="hero-image">
        {/* Image est définie en CSS pour un meilleur contrôle */}
      </div>
    </section>
  );
};
export default Hero;