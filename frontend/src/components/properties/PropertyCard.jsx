// src/components/properties/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <div className="property-image">
        <img src={property.imageUrl} alt={property.title} />
        <div className="property-badge">
          {property.status === 'FOR_SALE' ? 'For Sale' : 'For Rent'}
        </div>
      </div>
      
      <div className="property-content">
        <div className="property-price">${property.price.toLocaleString()}</div>
        <h3 className="property-title">
          <Link to={`/properties/${property.id}`}>{property.title}</Link>
        </h3>
        <p className="property-address">{property.address}</p>
        
        <div className="property-features">
          <div className="feature">
            <i className="feature-icon bed-icon"></i>
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="feature">
            <i className="feature-icon bath-icon"></i>
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="feature">
            <i className="feature-icon area-icon"></i>
            <span>{property.area} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard ;                 