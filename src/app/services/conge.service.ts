import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  CollectionReference,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Conge } from '../utils/types';

@Injectable({ providedIn: 'root' })
export class CongeService {
  private congesCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.congesCollection = collection(this.firestore, 'conges');
  }

  addConge(Conge: Conge): Promise<void> {
    const data = {
      ...Conge,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return addDoc(this.congesCollection, data).then(() => {});
  }

  getConges(): Observable<Conge[]> {
    return collectionData(this.congesCollection, { idField: 'id' }) as Observable<Conge[]>;
  }

  editUpdateConge(conge: Conge): Promise<void> {
    if (!conge.id) {
      return Promise.reject('Conge ID manquant');
    }
    const ref = doc(this.firestore, `conges/${conge.id}`);
    return updateDoc(ref, {
      ...conge,
      updatedAt: new Date()
    });
  }
updateConge(id: string, data: Partial<Conge>): Promise<void> {
  const ref = doc(this.firestore, `conges/${id}`);
  return updateDoc(ref, {
    ...data,
    updatedAt: new Date()
  });
}

  deleteConge(id: string): Promise<void> {
    const ref = doc(this.firestore, `conges/${id}`);
    return deleteDoc(ref);
  }

  // Optionnel : filtrer par statut
  getCongesByStatus(status: string): Observable<Conge[]> {
    const q = query(this.congesCollection, where('statut', '==', status));
    return collectionData(q, { idField: 'id' }) as Observable<Conge[]>;
  }

  async existsConge(nom: string, matricule: string): Promise<boolean> {
  const congeRef = collection(this.firestore, 'conges'); 
  const q = query(congeRef,
    where('nom', '==', nom),
    where('matricule', '==', matricule)
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty; // true si déjà une demande existe
}

 
}
