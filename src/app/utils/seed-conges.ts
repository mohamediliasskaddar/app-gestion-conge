// src/app/utils/seed-conges.ts
import { CongeService } from '../services/conge.service';
import { Timestamp } from 'firebase/firestore';
import { Conge } from './types';

// Tes données “raw” (extraites du JSON)
const seedData = [
//   {
//     nom: "Salma GHARBIA",
//     matricule: "OP100001",
//     email: "salma.gharbia@entreprise.com",
//     departement: "HSEEn",
//     role: "Opérateur",
//     type: "Annuel",
//     dateDebut: Timestamp.fromDate(new Date("2025-07-15")),
//     dateFin: Timestamp.fromDate(new Date("2025-07-18")),
//     nbJours: 4,
//     nbCongesPris: 5,
//     commentaire: "Vacances été",
//     statut: "Approuvé",
//     createdAt: Timestamp.fromDate(new Date("2025-07-01T08:00:00Z")),
//     updatedAt: Timestamp.fromDate(new Date("2025-07-01T08:00:00Z"))
//   },
//   {
//     nom: "Karim ZARGHOUNI",
//     matricule: "CA100002",
//     email: "karim.zarghouni@entreprise.com",
//     departement: "IT",
//     role: "Cadre",
//     type: "Exceptionnel",
//     dateDebut: Timestamp.fromDate(new Date("2025-07-20")),
//     dateFin: Timestamp.fromDate(new Date("2025-07-21")),
//     nbJours: 2,
//     nbCongesPris: 3,
//     commentaire: "Conférence techno",
//     statut: "En attente",
//     createdAt: Timestamp.fromDate(new Date("2025-07-05T09:30:00Z")),
//     updatedAt: Timestamp.fromDate(new Date("2025-07-05T09:30:00Z"))
//   },
  {
    nom: "Leila BEN FREDJ",
    matricule: "ET100003",
    email: "leila.benfredj@entreprise.com",
    departement: "Industrielle",
    role: "ETAM",
    type: "Maladie",
    dateDebut: Timestamp.fromDate(new Date("2025-07-22")),
    dateFin: Timestamp.fromDate(new Date("2025-07-24")),
    nbJours: 3,
    nbCongesPris: 2,
    commentaire: "Arrêt maladie",
    statut: "Approuvé",
    createdAt: Timestamp.fromDate(new Date("2025-07-21T07:45:00Z")),
    updatedAt: Timestamp.fromDate(new Date("2025-07-24T12:00:00Z"))
  },
  {
    nom: "Omar TRIKI",
    matricule: "OP100004",
    email: "omar.triki@entreprise.com",
    departement: "Qualité",
    role: "Opérateur",
    type: "Annuel",
    dateDebut: Timestamp.fromDate(new Date("2025-07-25")),
    dateFin: Timestamp.fromDate(new Date("2025-07-30")),
    nbJours: 6,
    nbCongesPris: 10,
    commentaire: "",
    statut: "En attente",
    createdAt: Timestamp.fromDate(new Date("2025-07-10T11:00:00Z")),
    updatedAt: Timestamp.fromDate(new Date("2025-07-10T11:00:00Z"))
  },
  {
    nom: "Sana MESSAOUDI",
    matricule: "CA100005",
    email: "sana.messaoudi@entreprise.com",
    departement: "Logistique",
    role: "Cadre",
    type: "Exceptionnel",
    dateDebut: Timestamp.fromDate(new Date("2025-08-01")),
    dateFin: Timestamp.fromDate(new Date("2025-08-03")),
    nbJours: 3,
    nbCongesPris: 4,
    commentaire: "Formation interne",
    statut: "Refusé",
    createdAt: Timestamp.fromDate(new Date("2025-07-12T14:20:00Z")),
    updatedAt: Timestamp.fromDate(new Date("2025-07-13T09:10:00Z"))
  },
  {
    nom: "Hichem BELHASSEN",
    matricule: "ET100006",
    email: "hichem.belhassen@entreprise.com",
    departement: "OEE",
    role: "ETAM",
    type: "Annuel",
    dateDebut: Timestamp.fromDate(new Date("2025-08-05")),
    dateFin: Timestamp.fromDate(new Date("2025-08-09")),
    nbJours: 5,
    nbCongesPris: 7,
    commentaire: "Vacances plage",
    statut: "Approuvé",
    createdAt: Timestamp.fromDate(new Date("2025-07-15T08:00:00Z")),
    updatedAt: Timestamp.fromDate(new Date("2025-07-15T08:00:00Z"))
  },
  {
    nom: "Ines SAHLI",
    matricule: "OP100007",
    email: "ines.sahli@entreprise.com",
    departement: "Maintenance",
    role: "Opérateur",
    type: "Maladie",
    dateDebut: Timestamp.fromDate(new Date("2025-08-10")),
    dateFin: Timestamp.fromDate(new Date("2025-08-12")),
    nbJours: 3,
    nbCongesPris: 1,
    commentaire: "Consultation médicale",
    statut: "En attente",
    createdAt: Timestamp.fromDate(new Date("2025-08-01T10:10:00Z")),
    updatedAt: Timestamp.fromDate(new Date("2025-08-01T10:10:00Z"))
  },
  {
    nom: "Sofien JABALLAH",
    matricule: "CA100008",
    email: "sofien.jaballah@entreprise.com",
    departement: "IT",
    role: "Cadre",
    type: "Annuel",
    dateDebut: Timestamp.fromDate(new Date("2025-08-15")),
    dateFin: Timestamp.fromDate(new Date("2025-08-20")),
    nbJours: 6,
    nbCongesPris: 12,
    commentaire: "",
    statut: "Approuvé",
    createdAt: Timestamp.fromDate(new Date("2025-07-20T12:30:00Z")),
    updatedAt: Timestamp.fromDate(new Date("2025-07-20T12:30:00Z"))
  },
  {
    nom: "Wiem KALLEL",
    matricule: "ET100009",
    email: "wiem.kallel@entreprise.com",
    departement: "Logistique",
    role: "ETAM",
    type: "Exceptionnel",
    dateDebut: Timestamp.fromDate(new Date("2025-08-22")),
    dateFin: Timestamp.fromDate(new Date("2025-08-23")),
    nbJours: 2,
    nbCongesPris: 3,
    commentaire: "Urgence famille",
    statut: "En attente",
    createdAt: Timestamp.fromDate(new Date("2025-08-05T09:00:00Z")),
    updatedAt: Timestamp.fromDate(new Date("2025-08-05T09:00:00Z"))
  }
];


// export function seedConges(congeService: CongeService) {
//   seedData.forEach(item => {
//     // const newConge: Conge = { 'Décès'
//     // };

//     congeService.addConge(newConge)
//       .then(() => console.log(`✅ Inserted: ${newConge.nom}`))
//       .catch(err => console.error(`❌ Error inserting ${newConge.nom}:`, err));
//   });
//}


