import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaBed, FaBath, FaRulerCombined, FaParking, FaTree, FaSwimmingPool, FaWheelchair, FaCog, FaSnowflake, FaCouch } from 'react-icons/fa';
import { TbBuildingSkyscraper } from 'react-icons/tb';
// Remplacez MdOutlineTerrace ou MdTerrace par une icône existante comme :
import { MdOutlineBalcony } from 'react-icons/md'; // Balcon peut servir d'alternative

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
});

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/properties/${id}`);
        setProperty(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load property details');
        setLoading(false);
      }
    };
    
    fetchPropertyDetails();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Chargement de la propriété...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Propriété non trouvée</p>
      </div>
    );
  }
  
  return (
    <div className="property-detail max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/buy" className="text-blue-600 hover:underline">← Retour aux résultats</Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Images and details */}
        <div className="lg:col-span-2">
          {/* Image gallery */}
          <div className="mb-6">
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={property.url || "/api/placeholder/800/600"} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Main property details */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-semibold text-blue-600">{priceFormatter.format(property.price)}</h1>
              <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {property.transactionType === 'sell' ? 'À vendre' : 'À louer'}
              </div>
            </div>
            
            <h2 className="text-2xl text-gray-800 mb-4">
              {property.title || `${property.propertyType} à ${property.city}`}
            </h2>
            
            <div className="text-gray-600 mb-4">
              {property.city && (
                <p className="text-lg">
                  {property.neighborhood && `${property.neighborhood}, `}{property.city}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-6 text-gray-700 mb-6">
              {property.bedrooms && (
                <div className="flex items-center">
                  <FaBed className="text-xl mr-2 text-blue-600" /> 
                  <span className="text-lg">{property.bedrooms} chambres</span>
                </div>
              )}
              
              {property.bathrooms && (
                <div className="flex items-center">
                  <FaBath className="text-xl mr-2 text-blue-600" /> 
                  <span className="text-lg">{property.bathrooms} salles de bain</span>
                </div>
              )}
              
              {property.surfaceM2 && (
                <div className="flex items-center">
                  <FaRulerCombined className="text-xl mr-2 text-blue-600" /> 
                  <span className="text-lg">{property.surfaceM2} m²</span>
                </div>
              )}
              
              {property.rooms && (
                <div className="flex items-center">
                  <FaCog className="text-xl mr-2 text-blue-600" /> 
                  <span className="text-lg">{property.rooms} pièces</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Property amenities */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Équipements</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.parking && (
                <div className="flex items-center">
                  <FaParking className="text-lg mr-2 text-blue-600" /> 
                  <span>Parking</span>
                </div>
              )}
              
            {property.elevator && (
  <div className="flex items-center">
    <TbBuildingSkyscraper className="text-lg mr-2 text-blue-600" />
    <span>Ascenseur</span>
  </div>
)}
              
              {property.balcony && (
                <div className="flex items-center">
                  <MdOutlineBalcony className="text-lg mr-2 text-blue-600" /> 
                  <span>Balcon</span>
                </div>
              )}
              
           {property.terrace && (
  <div className="flex items-center">
    <MdOutlineBalcony className="text-lg mr-2 text-blue-600" />
    <span>Terrasse</span>
  </div>
)}
              
              {property.garden && (
                <div className="flex items-center">
                  <FaTree className="text-lg mr-2 text-blue-600" /> 
                  <span>Jardin</span>
                </div>
              )}
              
              {property.pool && (
                <div className="flex items-center">
                  <FaSwimmingPool className="text-lg mr-2 text-blue-600" /> 
                  <span>Piscine</span>
                </div>
              )}
              
              {property.security && (
                <div className="flex items-center">
                  <MdSecurity className="text-lg mr-2 text-blue-600" /> 
                  <span>Sécurité</span>
                </div>
              )}
              
              {property.airConditioning && (
                <div className="flex items-center">
                  <FaSnowflake className="text-lg mr-2 text-blue-600" /> 
                  <span>Climatisation</span>
                </div>
              )}
              
              {property.furnished && (
                <div className="flex items-center">
                  <FaCouch className="text-lg mr-2 text-blue-600" /> 
                  <span>Meublé</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Property description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2">Description</h3>
            <div className="text-gray-700 whitespace-pre-line">
              {property.description || "Aucune description disponible pour cette propriété."}
            </div>
          </div>
        </div>
        
        {/* Right column - Contact form and map */}
        <div>
          {/* Contact card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Contacter l'agent</h3>
            
            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Nom</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md p-2" 
                  placeholder="Votre nom"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full border border-gray-300 rounded-md p-2" 
                  placeholder="Votre email"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Téléphone</label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded-md p-2" 
                  placeholder="Votre téléphone"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md p-2" 
                  rows="4"
                  placeholder="Je suis intéressé(e) par cette propriété..."
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md w-full"
              >
                Envoyer
              </button>
            </form>
          </div>
          
          {/* Location map */}
          {property.latitude && property.longitude && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Emplacement</h3>
              
              <div className="h-64 rounded-lg overflow-hidden">
                <MapContainer 
                  center={[property.latitude, property.longitude]} 
                  zoom={14} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[property.latitude, property.longitude]}>
                    <Popup>
                      {property.title || `${property.propertyType} à ${property.city}`}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              
              <div className="mt-3 text-gray-700">
                {property.neighborhood && `${property.neighborhood}, `}{property.city}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;