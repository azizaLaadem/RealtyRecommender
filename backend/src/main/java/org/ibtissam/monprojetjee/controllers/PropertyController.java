package org.ibtissam.monprojetjee.controllers;

import org.ibtissam.monprojetjee.dto.PropertyDTO;
import org.ibtissam.monprojetjee.services.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*") // En production, limitez cela à votre domaine frontend
public class PropertyController {

    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping("/featured")
    public ResponseEntity<List<PropertyDTO>> getFeaturedProperties() {
        List<PropertyDTO> featuredProperties = propertyService.getFeaturedProperties();
        return ResponseEntity.ok(featuredProperties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> getPropertyById(@PathVariable Long id) {
        PropertyDTO property = propertyService.getPropertyById(id);
        return ResponseEntity.ok(property);
    }

    @GetMapping
    public ResponseEntity<List<PropertyDTO>> searchProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String priceRange,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<PropertyDTO> properties = propertyService.searchProperties(location, type, priceRange, page, size);
        return ResponseEntity.ok(properties);
    }
}