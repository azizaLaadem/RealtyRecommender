package org.ibtissam.monprojetjee.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PropertySearchCriteria {
    private String location;
    private String neighborhood;
    private String propertyType;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer minBedrooms;
    private Integer maxBedrooms;
    private Integer minBathrooms;
    private Integer maxBathrooms;
    private int page = 0;
    private int size = 20;
}