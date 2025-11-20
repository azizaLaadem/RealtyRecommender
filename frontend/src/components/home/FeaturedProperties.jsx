// src/components/home/FeaturedProperties.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../properties/PropertyCard';
import './FeaturedProperties.css';

const FeaturedProperties = ({ properties, isLoading }) => {
  return (
    <section className="featured-properties">
      <div className="container">
        <h2 className="section-title">Featured Properties</h2>
        <p className="section-subtitle">
          Discover our handpicked selection of premium properties
        </p>
        
        {isLoading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          <div className="property-grid">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <p className="no-properties">No featured properties available at the moment.</p>
            )}
          </div>
        )}
        
        <div className="view-all-container">
          <Link to="/buy" className="view-all-btn">
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;