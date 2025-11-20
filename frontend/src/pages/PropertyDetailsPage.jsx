import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const DEFAULT_IMAGE = 'https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [similarProperties, setSimilarProperties] = useState([]);

  // Formatage du prix
  const formatPrice = (price) => {
    if (!price) return "Prix non disponible";
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      maximumFractionDigits: 0
    }).format(price);
  };

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        
        // Essayer différents endpoints
        let response;
        try {
          response = await axios.get(`${baseUrl}/api/properties/${id}`);
        } catch (err) {
          try {
            response = await axios.get(`${baseUrl}/api/annonces/${id}`);
          } catch (err2) {
            response = await axios.get(`${baseUrl}/properties/${id}`);
          }
        }

        // Formater les images
        const propertyData = response.data;
        const images = [
          propertyData.image1,
          propertyData.image2,
          propertyData.image3,
          propertyData.image4,
          propertyData.image5,
          propertyData.imageUrl
        ].filter(img => img).map(img => img.startsWith('http') ? img : `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`);

        setProperty({
          ...propertyData,
          images: images.length > 0 ? images : [DEFAULT_IMAGE]
        });

        // Charger des propriétés similaires
        try {
          const similarResponse = await axios.get(`${baseUrl}/api/properties/similar/${id}?limit=4`);
          setSimilarProperties(similarResponse.data);
        } catch (err) {
          console.error("Erreur lors du chargement des propriétés similaires:", err);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails:", err);
        setError("Impossible de charger les détails de la propriété. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  if (loading) {
    return <div className="property-details-loading">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="property-details-error">{error}</div>;
  }

  if (!property) {
    return <div className="property-details-not-found">Propriété non trouvée</div>;
  }

  return (
    <div className="property-details-container">
      {/* En-tête avec titre et prix */}
      <div className="property-header">
        <h1 className="property-title">{property.title || `${property.propertyType} à ${property.city || ''}`}</h1>
        <div className="property-price">{formatPrice(property.price)}</div>
        <div className="property-address">
          {property.address || ''}, {property.city || ''}, {property.region || ''}
        </div>
      </div>

      {/* Galerie d'images */}
      <div className="property-gallery">
        <div className="main-image-container">
          <img 
            src={property.images[activeImageIndex]} 
            alt={`Propriété ${activeImageIndex + 1}`}
            className="main-image"
            onError={(e) => {
              e.target.src = DEFAULT_IMAGE;
            }}
          />
        </div>
        <div className="thumbnail-container">
          {property.images.slice(0, 5).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Miniature ${index + 1}`}
              className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`}
              onClick={() => setActiveImageIndex(index)}
              onError={(e) => {
                e.target.src = DEFAULT_IMAGE;
              }}
            />
          ))}
          {property.images.length > 5 && (
            <div className="more-images">+{property.images.length - 5}</div>
          )}
        </div>
      </div>

      {/* Section principale avec détails */}
      <div className="property-main-section">
        {/* Colonne de gauche - Détails */}
        <div className="property-details-column">
          {/* Aperçu */}
          <div className="property-overview">
            <h2>À propos de cette propriété</h2>
            <div className="overview-grid">
              <div className="overview-item">
                <span className="overview-label">Type</span>
                <span className="overview-value">{property.propertyType || 'Non spécifié'}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Année de construction</span>
                <span className="overview-value">{property.yearBuilt || 'Non spécifié'}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Surface</span>
                <span className="overview-value">{property.surfaceM2 || property.surface || 'Non spécifié'} m²</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Chambres</span>
                <span className="overview-value">{property.bedrooms || 'Non spécifié'}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Salles de bain</span>
                <span className="overview-value">{property.bathrooms || 'Non spécifié'}</span>
              </div>
              <div className="overview-item">
                <span className="overview-label">Étage</span>
                <span className="overview-value">{property.floor || 'Non spécifié'}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="property-description">
            <h2>Description</h2>
            <p>{property.description || 'Aucune description disponible.'}</p>
          </div>

          {/* Caractéristiques */}
          <div className="property-features">
            <h2>Caractéristiques</h2>
            <div className="features-grid">
              {property.features && property.features.length > 0 ? (
                property.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span className="feature-check">✓</span>
                    <span className="feature-name">{feature}</span>
                  </div>
                ))
              ) : (
                <p>Aucune caractéristique spécifiée.</p>
              )}
            </div>
          </div>

          {/* Localisation */}
          <div className="property-location">
            <h2>Localisation</h2>
            {property.latitude && property.longitude ? (
              <div className="location-map-container">
                <MapContainer
                  center={[parseFloat(property.latitude), parseFloat(property.longitude)]}
                  zoom={15}
                  className="detail-map"
                  style={{ height: '400px', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[parseFloat(property.latitude), parseFloat(property.longitude)]}
                  >
                    <Popup>
                      <div>{property.address || 'Propriété'}</div>
                    </Popup>
                  </Marker>
                </MapContainer>
                <div className="walk-score">
                  <div className="score-item">
                    <span className="score-label">Transports</span>
                    <span className="score-value">78</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Commerces</span>
                    <span className="score-value">85</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Écoles</span>
                    <span className="score-value">92</span>
                  </div>
                </div>
              </div>
            ) : (
              <p>Localisation non disponible.</p>
            )}
          </div>
        </div>

        {/* Colonne de droite - Contact et estimation */}
        <div className="property-sidebar">
          <div className="contact-card">
            <h3>Contacter l'agent</h3>
            {property.agent ? (
              <div className="agent-info">
                <img 
                  src={property.agent.photo || 'https://via.placeholder.com/80'} 
                  alt={property.agent.name}
                  className="agent-photo"
                />
                <div className="agent-details">
                  <div className="agent-name">{property.agent.name}</div>
                  <div className="agent-company">{property.agent.company || 'Agence immobilière'}</div>
                  <div className="agent-phone">{property.agent.phone || 'Non spécifié'}</div>
                </div>
                <button className="contact-button">Contacter</button>
              </div>
            ) : (
              <p>Aucun agent spécifié.</p>
            )}
          </div>

          <div className="price-estimate-card">
            <h3>Estimation de prix</h3>
            <div className="estimate-range">
              <div className="estimate-min">1,200,000 MAD</div>
              <div className="estimate-separator">-</div>
              <div className="estimate-max">1,500,000 MAD</div>
            </div>
            <div className="estimate-explanation">
              Estimation basée sur des propriétés similaires dans le quartier.
            </div>
            <button className="estimate-button">Obtenir une estimation précise</button>
          </div>

          <div className="schedule-tour-card">
            <h3>Visiter cette propriété</h3>
            <button className="tour-button">Planifier une visite</button>
            <div className="virtual-tour">
              {property.virtualTour ? (
                <a href={property.virtualTour} target="_blank" rel="noopener noreferrer">
                  Visite virtuelle disponible
                </a>
              ) : (
                <p>Aucune visite virtuelle disponible.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Propriétés similaires */}
      <div className="similar-properties">
        <h2>Propriétés similaires</h2>
        <div className="similar-list">
          {similarProperties.length > 0 ? (
            similarProperties.map(similar => (
              <div 
                key={similar.id} 
                className="similar-card"
                onClick={() => navigate(`/property/${similar.id}`)}
              >
                <img 
                  src={similar.imageUrl || DEFAULT_IMAGE} 
                  alt={similar.title}
                  className="similar-image"
                />
                <div className="similar-details">
                  <div className="similar-price">{formatPrice(similar.price)}</div>
                  <div className="similar-stats">
                    {similar.bedrooms || 0} ch · {similar.bathrooms || 0} sdb · {similar.surfaceM2 || similar.surface || 0} m²
                  </div>
                  <div className="similar-address">
                    {similar.address || ''}, {similar.city || ''}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune propriété similaire trouvée.</p>
          )}
        </div>
      </div>

      {/* Historique des prix (simulé) */}
      <div className="price-history">
        <h2>Historique des prix et taxe</h2>
        <div className="history-table">
          <div className="history-header">
            <div>Date</div>
            <div>Événement</div>
            <div>Prix</div>
            <div>Prix/m²</div>
          </div>
          <div className="history-row">
            <div>25 Mai 2024</div>
            <div>Mise en vente</div>
            <div>{formatPrice(property.price)}</div>
            <div>{formatPrice(property.price / (property.surfaceM2 || property.surface || 1))}</div>
          </div>
          <div className="history-row">
            <div>15 Jan 2024</div>
            <div>Rénovation</div>
            <div>-</div>
            <div>-</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsPage;