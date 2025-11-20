package org.ibtissam.monprojetjee;
import com.opencsv.CSVReader;

import java.io.FileReader;
import java.sql.*;
import java.util.Arrays;

public class CsvImporter {
    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/immobilier_db";
    private static final String USER = "root";
    private static final String PASSWORD = "";

    public static void main(String[] args) {
        String csvFilePath = "C:\\Users\\aziza\\M1 ,s2\\Jee\\property_data.csv";

        try (
                Connection connection = DriverManager.getConnection(JDBC_URL, USER, PASSWORD);
                CSVReader reader = new CSVReader(new FileReader(csvFilePath))
        ) {
            connection.setAutoCommit(false); // Optionnel, pour mieux gérer les erreurs

            String[] header = reader.readNext(); // Lire l’en-tête
            System.out.println("Header: " + Arrays.toString(header));

            String insertSql = "INSERT INTO properties (url, title, price, surfaceM2, rooms, bedrooms, bathrooms, floor, city, neighborhood, property_type, transaction_type, agency_name, agency_type, listed_by_owner, syndic_fees, latitude, longitude, description, parking, elevator, balcony, terrace, garden, pool, security, air_conditioning, heating, furnished) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

            PreparedStatement statement = connection.prepareStatement(insertSql);

            String[] line;
            while ((line = reader.readNext()) != null) {
                System.out.println("Ligne CSV: " + Arrays.toString(line)); // Debug

                for (int i = 1; i < line.length; i++) { // on saute la colonne 0 (property_id)
                    statement.setObject(i, parseValue(line[i])); // i = 1 → paramètre 1
                }

                statement.executeUpdate();
            }

            connection.commit(); // Si tout s’est bien passé
            System.out.println("Import terminé avec succès !");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static Object parseValue(String value) {
        if (value == null || value.trim().isEmpty()) return null;
        String v = value.trim();
        if (v.equalsIgnoreCase("true") || v.equalsIgnoreCase("false")) return Boolean.valueOf(v);
        if (v.equalsIgnoreCase("N/A") || v.equalsIgnoreCase("null") || v.equalsIgnoreCase("-")) return null;
        try {
            return Double.parseDouble(v);
        } catch (NumberFormatException e) {
            return v;
        }
    }


}
