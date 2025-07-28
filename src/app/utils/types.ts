export interface Conge {
  id?: string;
  nom: string;
  matricule: string;
  email?: string;
  departement: string;
  categorie: 'Ovrier' | 'Cadre'| 'ETAM';
  motif : 'Décès' | 'Naissance' | 'Circoncision' | 'Mariage' | 'Congé annuel' | 'Congé sans solde';
  dateDebut:  Date;
  dateFin: Date;
  nbJours: number;
  nbCongesPris?: number;
  commentaire?: string; 
  statut: 'En attente' | 'Approuvé' | 'Refusé' | 'Annulé';
  approuveParRH?: boolean;
  approuveParDirecteur?: boolean;
  dateDemande?: Date;
  createdAt?: any;
  updatedAt?: any;
}

export interface User{
  id?: string;
  nom: string;
  email: string;
  matricule: string;
  departement: string;
  role: 'RH' | 'Directeur' | 'IT';
  createdAt?: any;
  updatedAt?: any;
}
