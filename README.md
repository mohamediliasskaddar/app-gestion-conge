
---

# 🏖️ Application de Gestion de Congés

## 📋 Description du projet

L’**Application de Gestion de Congés** est une application web interne visant à **simplifier et automatiser la gestion des congés** au sein de l’entreprise.
Elle permet aux employés de soumettre leurs demandes en ligne, aux responsables RH et au Directeur de les valider selon un **workflow à double niveau**, et à l’équipe IT d’assurer la gestion des utilisateurs et la maintenance du système.

👉 [Figma – Maquette de l’application](https://www.figma.com/design/CtHXxsIxeyXP5PyB9WNRT0/app-gestion-de-cong%C3%A9?node-id=0-1&t=JkVtvXshqZAwWyUT-1)

---

## 🚀 Fonctionnalités principales

### 🗓️ Gestion des congés

* Soumission de demandes via un **formulaire interactif**.
* Workflow de **validation multi-niveaux** (Employé → RH → Directeur).
* Interface adaptée selon le rôle de l’utilisateur.
  **🎯 Objectif :** Simplifier et structurer la gestion des congés grâce à une validation automatisée.

---

### 🔔 Notifications et alertes

* **Envoi automatique d’e-mails** à chaque étape (soumission, approbation, refus).
* **Suivi en temps réel** de l’état des demandes.
  **🎯 Objectif :** Informer les utilisateurs sans intervention manuelle.

---

### 📊 Tableaux de bord et visualisation

* **Dashboards dynamiques** pour RH et Directeur.
* **Calendrier centralisé** affichant les congés approuvés et absences en cours.
  **🎯 Objectif :** Offrir une visibilité claire pour une meilleure organisation des équipes.

---

### 👥 Gestion des utilisateurs

* Interface dédiée au rôle **IT** pour la création, modification et suppression de comptes.
* Formulaire d’ajout de nouveaux utilisateurs avec rôle et département.
  **🎯 Objectif :** Centraliser et sécuriser la gestion des utilisateurs.

---

### 📄 Exports et rapports

* **Export PDF** des demandes approuvées.
* **Export Excel (XLSX)** avec filtres (date, statut, utilisateur).
  **🎯 Objectif :** Faciliter l’archivage, l’analyse et le reporting des données RH.

---

### 📱 Accessibilité et expérience utilisateur

* **Interface responsive** (ordinateurs, tablettes, mobiles).
* **Navigation fluide et intuitive** adaptée à tous les rôles.
  **🎯 Objectif :** Offrir une expérience utilisateur agréable et cohérente.

---

## 🧩 Stack technique

| Catégorie           | Technologie / Librairie                                      | Description                                                                                  |
| ------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Frontend**        | [Angular 19 (Standalone Components)](https://angular.dev)    | Framework moderne pour le développement web SPA. Simplifie l’architecture et la maintenance. |
| **Backend / Cloud** | [Firebase Firestore + Auth](https://firebase.google.com/)    | Base de données NoSQL en temps réel et authentification sécurisée.                           |
| **Déploiement**     | [Firebase Hosting](https://firebase.google.com/docs/hosting) | Hébergement rapide et sécurisé avec HTTPS automatique.                                       |
| **Emailing**        | [EmailJS](https://www.emailjs.com/)                          | Envoi d’e-mails sans serveur.                                                                |
| **PDF Export**      | [jsPDF](https://github.com/parallax/jsPDF)                   | Génération de documents PDF à partir des données de congés.                                  |
| **XLSX Export**     | [SheetJS (xlsx)](https://sheetjs.com/)                       | Exportation des données RH au format Excel.                                                  |

---

## ⚙️ Fonctionnement technique

### 🔥 Firebase Firestore

* Base de données **NoSQL temps réel** pour synchroniser automatiquement les demandes entre les rôles.
* Modèle flexible et évolutif.
* Haute disponibilité et scalabilité sans gestion serveur.

### 🌐 Firebase Hosting

* Hébergement sécurisé, rapide et optimisé pour les applications Angular SPA.
* HTTPS automatique et support du **routing Angular** via `firebase.json`.

### 🅰️ Angular (Standalone Components)

* Architecture légère sans `NgModules`.
* Routing, guards et services pour une **séparation claire des rôles (IT, RH, Directeur)**.
* Formulaires réactifs et intégration fluide avec Firebase.

---

## 🧪 Tests et déploiement

Le déploiement s’effectue via **Firebase Hosting**, offrant :

* Configuration et **mise en ligne en une commande**.
* Prise en charge du **SSR (Server-Side Rendering)** avec Node.js pour de meilleures performances.
* Gestion automatique du **HTTPS**, du **routing Angular**, et de la **mise en cache** des fichiers statiques.

### ⚙️ Étapes de déploiement :

1. Installer Firebase CLI :

   ```bash
   npm install -g firebase-tools
   ```
2. Se connecter à Firebase :

   ```bash
   firebase login
   ```
3. Initialiser le projet :

   ```bash
   firebase init
   ```
4. Builder et déployer l’application Angular :

   ```bash
   ng build
   firebase deploy
   ```

---

## 👨‍💻 Auteur

**Mohamed Iliass Kaddar**
📧 [moahmediliassk@gmail.com](mailto:moahmediliassk@gmail.com)

---

## 🖼️ Aperçu

Pour un aperçu visuel de l’interface :
👉 [Voir sur Figma](https://www.figma.com/design/CtHXxsIxeyXP5PyB9WNRT0/app-gestion-de-cong%C3%A9?node-id=0-1&t=JkVtvXshqZAwWyUT-1)

---
