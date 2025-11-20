RealtyRecommender – AI-Powered Real Estate Platform

RealtyRecommender est une plateforme web moderne permettant d’acheter, vendre ou louer des biens immobiliers au Maroc.
Elle intègre un système de recommandation intelligent, un moteur de recherche avancé, ainsi qu’un module de prédiction des prix immobiliers basé sur le Machine Learning.

Fonctionnalités principales : 
Frontend (React + Vite)
Interface utilisateur moderne et responsive
Recherche avancée (prix, type de bien, chambres, villes…)

Page de détails avec :
Galerie d’images
Carte interactive (Leaflet)
Équipements du bien
Contact de l’agent/propriétaire
Recommandation de biens similaires
Authentification & inscription (JWT)
Gestion du profil utilisateur

Pages : Home, Buy, Rent, Sell, Property Details, Login, Register

Backend (Spring Boot + Spring Security) :

API REST complète pour gérer :
Propriétés 
Utilisateurs & rôles
Authentification (JWT & Spring Security)
Recherche intelligente avec filtres (PropertySearchCriteria)
Sécurisation complète (JWT Token, filters, UserDetailsService)

Machine Learning :
Prédiction du prix des biens immobiliers (modèle ML intégré)
Recommandation basée sur :
Similarité de caractéristiques
Localisation
Historique utilisateur

Prétraitement des données immobilières :
Visualisation des tendances du marché
Technologies utilisées
Frontend
React.js
Vite
Axios
Leaflet
Context API

Backend :
Spring Boot
Spring Security
JWT Authentication
JPA / Hibernate
MySQL
AI / Machine Learning :
Python (Pandas, Scikit-Learn, XGBoost, NumPy)
Notebook ML pour training
Export du modèle (pickle / joblib)
Intégration via REST API

Installation & exécution
Backend
cd backend
mvn spring-boot:run

Backend accessible sur :
http://localhost:8080/api

Frontend :
cd frontend
npm install
npm run dev

Frontend accessible sur :
http://localhost:5173

Structure du projet
RealtyRecommender/
│
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── security/
│   ├── dto/
│   ├── models/
│   ├── config/
│   └── resources/
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/
│
└── README.md

Contributions
Les contributions sont les bienvenues !
Forkez le projet et proposez vos améliorations via Pull Request.

Licence
Ce projet est sous licence MIT.
Vous êtes libre de l’utiliser, modifier et distribuer.

Développé par Aziza Laadem et Ibtissam ERRACHIDI
