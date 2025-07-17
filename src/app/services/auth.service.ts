import { Injectable } from '@angular/core';
import {
  collection,
  Firestore,
  getDocs,
  query,
  where
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user: any = null;

  constructor(private firestore: Firestore) {}

  /**
   * Tente de connecter un RH en comparant email et mot de passe.
   */
  async login(email: string, password: string): Promise<boolean> {
    const usersCol = collection(this.firestore, 'Users');
    // On cherche l'utilisateur dont 'email' et 'password' correspondent
    const q = query(
      usersCol,
      where('email', '==', email),
      where('password', '==', password)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      // Récupère le premier document correspondant
      this._user = { id: snap.docs[0].id, ...(snap.docs[0].data() as any) };
      localStorage.setItem('rhUser', JSON.stringify(this._user));
      return true;
    }
    return false;
  }

  logout() {
    this._user = null;
    localStorage.removeItem('rhUser');
  }

  /**
   * Donne l'utilisateur actuellement connecté (ou null).
   */
  get currentUser() {
    if (!this._user) {
      const stored = localStorage.getItem('rhUser');
      this._user = stored ? JSON.parse(stored) : null;
    }
    return this._user;
  }

  /**
   * Indique si un utilisateur est connecté.
   */
  isLoggedIn(): boolean {
    return !!this.currentUser;
  }
}
