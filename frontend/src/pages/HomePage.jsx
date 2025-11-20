

import { useState, useEffect } from 'react';
import Hero from '../components/home/Hero';
import PropertySearchForm from '../components/home/PropertySearchForm';
import FeaturedProperties from '../components/home/FeaturedProperties';
import api from '../services/api'; // Utilisez une instance Axios configurée

const HomePage = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/properties/featured');
        setFeaturedProperties(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          // Redirection si non authentifié
          window.location.href = '/login';
        }
        console.error('Error:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <PropertySearchForm />
      <FeaturedProperties properties={featuredProperties} isLoading={isLoading} />
    </div>
  );
};

export default HomePage;

