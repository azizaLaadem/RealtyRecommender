package org.ibtissam.monprojetjee.Repositories;

import org.ibtissam.monprojetjee.models.Property;
import org.ibtissam.monprojetjee.models.PropertyStatus;
import org.ibtissam.monprojetjee.models.PropertyType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByIsFeaturedTrue();

    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);

    @Query("SELECT p FROM Property p WHERE " +
            "(:city IS NULL OR p.city LIKE %:city%) AND " +
            "(:type IS NULL OR p.type = :type) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    Page<Property> searchProperties(
            @Param("city") String city,
            @Param("type") PropertyType type,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable);
}