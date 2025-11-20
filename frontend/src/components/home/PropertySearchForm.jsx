// src/components/home/PropertySearchForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertySearchForm.css';

const PropertySearchForm = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (propertyType) params.append('type', propertyType);
    if (priceRange) params.append('priceRange', priceRange);
    
    // Navigate to buy page with filters
    navigate(`/buy?${params.toString()}`);
  };

  return (
    <div className="search-form-container">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="search-group">
          <label>Location</label>
          <div className="input-icon">
            <i className="location-icon"></i>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="search-group">
          <label>Type</label>
          <div className="input-icon">
            <i className="property-icon"></i>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="">Property type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
            </select>
          </div>
        </div>

        <div className="search-group">
          <label>Price Range</label>
          <div className="input-icon">
            <i className="price-icon"></i>
            <input
              type="text"
              placeholder="Min - Max"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
};

export default PropertySearchForm;