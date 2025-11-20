package org.ibtissam.monprojetjee.models;

public enum PropertyStatus {
    AVAILABLE("Disponible"),
    SOLD("Vendu"),
    RENTED("Loué"),
    PENDING("En cours de vente"),
    RESERVED("Réservé"),
    UNAVAILABLE("Indisponible");

    private final String label;

    PropertyStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}