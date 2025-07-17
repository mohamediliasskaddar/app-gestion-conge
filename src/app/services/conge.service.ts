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
  where
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Conge } from '../utils/types';

@Injectable({ providedIn: 'root' })
export class CongeService {
  private congesCollection: CollectionReference;

  constructor(private firestore: Firestore) {
    this.congesCollection = collection(this.firestore, 'conges');
  }

  addConge(conge: Conge): Promise<void> {
    const data = {
      ...conge,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return addDoc(this.congesCollection, data).then(() => {});
  }

  getConges(): Observable<Conge[]> {
    return collectionData(this.congesCollection, { idField: 'id' }) as Observable<Conge[]>;
  }

  updateConge(conge: Conge): Promise<void> {
    if (!conge.id) {
      return Promise.reject('Conge ID manquant');
    }
    const ref = doc(this.firestore, `conges/${conge.id}`);
    return updateDoc(ref, {
      ...conge,
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

  // Optionnel : déclencher un envoi d'e-mail
  // sendEmailNotification(conge: Conge): Promise<void> {
  //   // Appel à une Cloud Function HTTP
  //   return fetch('https://us-central1-TA_PROJ.cloudfunctions.net/sendEmail', {
  //     method: 'POST',
  //     body: JSON.stringify(conge),
  //     headers: { 'Content-Type': 'application/json' }
  //   }).then(res => {
  //     if (!res.ok) {
  //       throw new Error('Erreur lors de l\'envoi du mail');
  //     }
  //   });
  // }
}
