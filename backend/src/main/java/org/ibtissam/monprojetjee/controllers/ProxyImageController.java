package org.ibtissam.monprojetjee.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.Collections;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/proxy")
@CrossOrigin(origins = "*")
public class ProxyImageController {

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Proxy amélioré pour récupérer des images de sources externes
     * Version avec exchange() au lieu de getForEntity() pour un meilleur contrôle
     *
     * @param url L'URL de l'image à récupérer
     * @return L'image récupérée avec les en-têtes appropriés
     */
    @GetMapping("/image")
    public ResponseEntity<byte[]> proxyImage(@RequestParam("url") String url) {
        try {
            // Vérifier que l'URL est valide
            if (!url.startsWith("http")) {
                return ResponseEntity.badRequest().body("URL invalide".getBytes());
            }

            // Vérifier que l'URL provient de domaines autorisés
            if (!url.contains("agenz.ma") && !url.contains("images.agenz.ma") && !url.contains("media.agenz.ma")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body("Domaine non autorisé".getBytes());
            }

            // Créer un RestTemplate si nécessaire
            if (restTemplate == null) {
                restTemplate = new RestTemplate();
            }

            // Configurer les en-têtes de la requête
            HttpHeaders requestHeaders = new HttpHeaders();
            requestHeaders.setAccept(Collections.singletonList(MediaType.APPLICATION_OCTET_STREAM));
            requestHeaders.add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
            requestHeaders.add("Accept", "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8");
            requestHeaders.add("Referer", "https://agenz.ma/");
            requestHeaders.add("Origin", "https://agenz.ma");
            requestHeaders.add("Connection", "keep-alive");
            requestHeaders.add("Cache-Control", "no-cache");

            // Créer l'entité HTTP avec les en-têtes
            HttpEntity<String> entity = new HttpEntity<>(requestHeaders);

            // Effectuer la requête avec exchange()
            ResponseEntity<byte[]> response;
            try {
                response = restTemplate.exchange(
                        new URI(url),
                        HttpMethod.GET,
                        entity,
                        byte[].class
                );
            } catch (HttpClientErrorException e) {
                // En cas d'erreur 401/403, essayer avec une autre configuration d'en-têtes
                if (e.getStatusCode().value() == 401 || e.getStatusCode().value() == 403) {
                    try {
                        // Modifier légèrement les en-têtes pour la deuxième tentative
                        requestHeaders.set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36");
                        entity = new HttpEntity<>(requestHeaders);
                        response = restTemplate.exchange(
                                new URI(url),
                                HttpMethod.GET,
                                entity,
                                byte[].class
                        );
                    } catch (Exception retryEx) {
                        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                                .body(("L'image n'est pas accessible après plusieurs tentatives.").getBytes());
                    }
                } else {
                    return ResponseEntity.status(e.getStatusCode())
                            .body(("Erreur client lors de la récupération de l'image: " + e.getMessage()).getBytes());
                }
            } catch (HttpServerErrorException e) {
                return ResponseEntity.status(e.getStatusCode())
                        .body(("Erreur serveur lors de la récupération de l'image: " + e.getMessage()).getBytes());
            }

            // Créer des en-têtes de réponse
            HttpHeaders responseHeaders = new HttpHeaders();

            // Copier les en-têtes pertinents de la réponse originale
            if (response.getHeaders().getContentType() != null) {
                responseHeaders.setContentType(response.getHeaders().getContentType());
            } else {
                // Deviner le type de contenu basé sur l'extension de fichier
                if (url.toLowerCase().endsWith(".jpg") || url.toLowerCase().endsWith(".jpeg")) {
                    responseHeaders.setContentType(MediaType.IMAGE_JPEG);
                } else if (url.toLowerCase().endsWith(".png")) {
                    responseHeaders.setContentType(MediaType.IMAGE_PNG);
                } else if (url.toLowerCase().endsWith(".gif")) {
                    responseHeaders.setContentType(MediaType.IMAGE_GIF);
                } else if (url.toLowerCase().endsWith(".webp")) {
                    responseHeaders.setContentType(MediaType.valueOf("image/webp"));
                } else {
                    responseHeaders.setContentType(MediaType.IMAGE_JPEG); // Par défaut
                }
            }

            // Définir la politique de cache (1 jour)
            responseHeaders.setCacheControl("public, max-age=" + TimeUnit.DAYS.toSeconds(1));

            // Autoriser le partage de ressources cross-origin
            responseHeaders.add("Access-Control-Allow-Origin", "*");
            responseHeaders.add("Access-Control-Allow-Methods", "GET, OPTIONS");
            responseHeaders.add("Access-Control-Allow-Headers", "Content-Type, Authorization");

            // Retourner la réponse avec les données de l'image
            return new ResponseEntity<>(response.getBody(), responseHeaders, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Erreur lors de la récupération de l'image: " + e.getMessage()).getBytes());
        }
    }
}