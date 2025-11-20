package org.ibtissam.monprojetjee.services;

import org.ibtissam.monprojetjee.dto.PropertyDTO;
import org.ibtissam.monprojetjee.models.Property;
import org.ibtissam.monprojetjee.models.PropertyType;
import org.ibtissam.monprojetjee.Repositories.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    private final PropertyRepository propertyRepository;

    @Autowired
    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public List<PropertyDTO> getFeaturedProperties() {
        List<Property> featuredProperties = propertyRepository.findByIsFeaturedTrue();
        return convertToDTOList(featuredProperties);
    }

    public PropertyDTO getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found with id: " + id));
        return convertToDTO(property);
    }

    public List<PropertyDTO> searchProperties(String location, String type, String priceRange, int page, int size) {
        // Parse price range si disponible
        BigDecimal minPrice = null;
        BigDecimal maxPrice = null;

        if (priceRange != null && !priceRange.isEmpty()) {
            String[] prices = priceRange.split("-");
            try {
                if (prices.length > 0 && !prices[0].trim().isEmpty()) {
                    minPrice = new BigDecimal(prices[0].trim().replace("$", "").replace(",", ""));
                }
                if (prices.length > 1 && !prices[1].trim().isEmpty()) {
                    maxPrice = new BigDecimal(prices[1].trim().replace("$", "").replace(",", ""));
                }
            } catch (NumberFormatException e) {
                // Log the error or handle as needed
            }
        }

        // Convert string type to enum si disponible
        PropertyType propertyType = null;
        if (type != null && !type.isEmpty()) {
            try {
                propertyType = PropertyType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Log the error or handle as needed
            }
        }

        Pageable pageable = PageRequest.of(page, size);

        // Utilisation du repository pour chercher les propriétés
        List<Property> properties = propertyRepository.searchProperties(
                location, propertyType, minPrice, maxPrice, pageable).getContent();

        return convertToDTOList(properties);
    }

    // Méthodes utilitaires pour convertir entre entités et DTOs
    private PropertyDTO convertToDTO(Property property) {
        return new PropertyDTO(
                property.getId(),
                property.getTitle(),
                property.getDescription(),
                property.getPrice(),
                property.getAddress(),
                property.getCity(),
                property.getState(),
                property.getZipCode(),
                property.getType(),
                property.getStatus(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getArea(),
                property.getImageUrl(),
                property.getIsFeatured()
        );
    }

    private List<PropertyDTO> convertToDTOList(List<Property> properties) {
        return properties.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}