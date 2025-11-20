import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaSearch, FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
});

const BuyPage = () => {
  const [properties, setProperties] = useState([]);
  const [searchCriteria, setSearchCriteria] = useState({
    location: '',
    propertyType: '',
    minPrice: null,
    maxPrice: null,
    minBedrooms: null,
    maxBedrooms: null,
    minBathrooms: null,
    maxBathrooms: null
  });
  const [cities, setCities] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [mapActive, setMapActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default center for the map (can be replaced with user's location or most popular city)
  const defaultCenter = [46.227638, 2.213749]; // France center
  
  useEffect(() => {
    // Fetch initial properties
    fetchProperties();
    
    // Fetch cities and property types for filters
    axios.get('http://localhost:8080/api/properties/cities')
      .then(response => setCities(response.data))
      .catch(err => setError('Failed to load cities'));
      
    axios.get('http://localhost:8080/api/properties/property-types')
      .then(response => setPropertyTypes(response.data))
      .catch(err => setError('Failed to load property types'));
  }, []);
  
  const fetchProperties = () => {
    setLoading(true);
    axios.post('http://localhost:8080/api/properties/search', searchCriteria)
      .then(response => {
        setProperties(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load properties');
        setLoading(false);
      });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria({
      ...searchCriteria,
      [name]: value === '' ? null : value
    });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProperties();
  };
  
  const toggleView = () => {
    setMapActive(!mapActive);
  };
  
  // Create property markers for the map
  const propertyMarkers = properties
    .filter(property => property.latitude && property.longitude)
    .map(property => (
      <Marker 
        key={property.propertyId} 
        position={[property.latitude, property.longitude]}
      >
        <Popup>
          <div className="popup-content">
            <h3>{property.title}</h3>
            <p>{priceFormatter.format(property.price)}</p>
            <p>{property.bedrooms} chambres, {property.bathrooms} sdb</p>
            <Link to={`/property/${property.propertyId}`}>Voir détails</Link>
          </div>
        </Popup>
      </Marker>
    ));
  
  return (
    <div className="buy-page">
      <div className="search-container bg-white p-4 shadow-md">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-2 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700">Localisation</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                name="location"
                value={searchCriteria.location || ''}
                onChange={handleInputChange}
                placeholder="Ville, quartier..."
                className="pl-10 w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          
          <div className="w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="propertyType"
              value={searchCriteria.propertyType || ''}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Tous les types</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div className="w-[200px]">
            <label className="block text-sm font-medium text-gray-700">Prix</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                name="minPrice"
                value={searchCriteria.minPrice || ''}
                onChange={handleInputChange}
                placeholder="Min"
                className="w-full border-gray-300 rounded-md shadow-sm"
              />
              <span>-</span>
              <input
                type="number"
                name="maxPrice"
                value={searchCriteria.maxPrice || ''}
                onChange={handleInputChange}
                placeholder="Max"
                className="w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
          
          <div className="w-[150px]">
            <label className="block text-sm font-medium text-gray-700">Chambres & SdB</label>
            <div className="flex gap-2 items-center">
              <select
                name="minBedrooms"
                value={searchCriteria.minBedrooms || ''}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Chambres</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
              <select
                name="minBathrooms"
                value={searchCriteria.minBathrooms || ''}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="">SdB</option>
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2 self-end"
          >
            <FaSearch /> Rechercher
          </button>
        </form>
      </div>
      
      <div className="results-container mt-4">
        <div className="results-header flex justify-between items-center mb-4 px-4">
          <h2 className="text-xl font-semibold">
            {properties.length} résultats {searchCriteria.location ? `à ${searchCriteria.location}` : ''}
          </h2>
          <div className="view-toggle">
            <button 
              className={`px-3 py-1 rounded-l-md ${mapActive ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}
              onClick={() => setMapActive(false)}
            >
              Liste
            </button>
            <button 
              className={`px-3 py-1 rounded-r-md ${mapActive ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              onClick={() => setMapActive(true)}
            >
              Carte
            </button>
          </div>
        </div>
        
        <div className="results-content flex">
          {mapActive ? (
            <>
              <div className="map-container w-1/2 h-[600px] border">
                <MapContainer center={defaultCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {propertyMarkers}
                </MapContainer>
              </div>
              <div className="property-list w-1/2 overflow-y-auto h-[600px]">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p>Chargement des propriétés...</p>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-red-500">{error}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 p-4">
                    {properties.map(property => (
                      <PropertyCard key={property.propertyId} property={property} />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="property-list w-full">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <p>Chargement des propriétés...</p>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-48">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                  {properties.map(property => (
                    <PropertyCard key={property.propertyId} property={property} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
const PropertyCard = ({ property }) => {
  const [favorite, setFavorite] = useState(false);
  
  const toggleFavorite = (e) => {
    e.preventDefault();
    setFavorite(!favorite);
  };
  
  return (
    <Link to={`/property/${property.propertyId}`} className="property-card block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={property.url || "/api/placeholder/400/300"} 
          alt={property.title} 
          className="w-full h-48 object-cover"
        />
        <button 
          onClick={toggleFavorite}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
        >
          <FaHeart className={favorite ? "text-red-500" : "text-gray-300"} />
        </button>
        {property.propertyType && (
          <span className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
            {property.propertyType}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-blue-600">{priceFormatter.format(property.price)}</h3>
          {property.city && (
            <div className="text-gray-500 text-sm flex items-center">
              <FaMapMarkerAlt className="mr-1" /> {property.city}
            </div>
          )}
        </div>
        
        <h4 className="mt-2 text-gray-800">{property.title || `${property.propertyType} à ${property.city}`}</h4>
        
        <div className="mt-3 flex items-center text-gray-700 text-sm divide-x divide-gray-300">
          {property.bedrooms && (
            <div className="pr-3 flex items-center">
              <FaBed className="mr-1" /> {property.bedrooms} ch
            </div>
          )}
          {property.bathrooms && (
            <div className="px-3 flex items-center">
              <FaBath className="mr-1" /> {property.bathrooms} sdb
            </div>
          )}
          {property.surfaceM2 && (
            <div className="pl-3 flex items-center">
              <FaRulerCombined className="mr-1" /> {property.surfaceM2} m²
            </div>
          )}
        </div>
        
        {property.description && (
          <p className="mt-2 text-gray-600 text-sm line-clamp-2">
            {property.description}
          </p>
        )}
      </div>
    </Link>
  );
};

export default BuyPage;