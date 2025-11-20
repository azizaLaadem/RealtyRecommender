package org.ibtissam.monprojetjee.models;

public enum PropertyType {
    APARTMENT("Appartement"), // "Appartement" avec un "e"
    VILLA("Villa"),
    LAND("Terrain"),
    HOUSE("Maison"),
    DUPLEX("Duplex"), // Ajouté
    OFFICE("Bureau"),
    COMMERCIAL("Local commercial"), // Modifié
    UNKNOWN("Unknown"), // Ajouté
    OTHER("Autre");
    // ...




    private final String label;

    PropertyType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }}
