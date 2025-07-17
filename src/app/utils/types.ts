export interface Conge {
  id?: string;
  nom: string;
  matricule: string;
  email?: string;
  departement: string;
  role: 'Opérateur' | 'Cadre'| 'ETAM';
  motif: string;// ANUUEL MENSUEIL ETC 
  dateDebut:  Date;
  dateFin: Date;
  nbJours: number;
  nbCongesPris?: number;
  commentaire?: string; 
  statut: 'En attente' | 'Approuvé' | 'Refusé'| 'Annulé';
  createdAt?: any;
  updatedAt?: any;
}
