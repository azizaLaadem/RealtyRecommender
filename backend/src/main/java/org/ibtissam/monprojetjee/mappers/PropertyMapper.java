package org.ibtissam.monprojetjee.mappers;

import org.ibtissam.monprojetjee.dto.PropertyDTO;
import org.ibtissam.monprojetjee.models.Property;

public class PropertyMapper {

    public static PropertyDTO mapToDTO(Property property) {
        return new PropertyDTO(
                property.getPropertyId(),
                property.getTitle(),
                property.getDescription(),
                property.getPrice(),
                property.getCity(),
                property.getNeighborhood(),
                property.getPropertyType(),
                property.getTransactionType(),
                property.getRooms(),
                property.getBedrooms(),
                property.getBathrooms(),
                property.getSurfaceM2(),
                property.getPropertyUrl(),
                property.getParking(),
                property.getElevator(),
                property.getBalcony(),
                property.getTerrace(),
                property.getPool(),
                property.getFloor(),
                property.getFurnished(),
                property.getAgencyName(),
                property.getAgencyType(),
                property.getAirConditioning(),
                property.getGarden(),
                property.getHeating(),
                property.getLatitude(),
                property.getLongitude(),
                property.getListedByOwner(),
                property.getSyndicFees(),
                property.getSecurity(),
                property.getImageId(),
                property.getImageUrl(),
                property.getImage1(),
                property.getImage2(),
                property.getImage3(),
                property.getImage4(),
                property.getImageCreatedAt()
        );
    }
}
