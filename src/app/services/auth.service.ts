
import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, User, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  private userSubject = new BehaviorSubject<User | null>(null);
  private roleSubject = new BehaviorSubject<string | null>(null);
  private userData: any = null; 
 

  constructor(  private auth: Auth, private firestore: Firestore, private router: Router ) {

    onAuthStateChanged(this.auth, async (user) => {
      this.userSubject.next(user);
      if (user) {
        await this.loadUserData(user.uid); 
      } else {
        this.userData = null;
        this.roleSubject.next(null);
      }
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    try {
      const userCred = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCred.user;
      await this.loadUserData(user.uid);
      return true;
    } catch (error) {
      console.error('Erreur de connexion :', error);
      return false;
    }
  }

  async logout() {
    await signOut(this.auth);
    this.userSubject.next(null);
    this.roleSubject.next(null);
    this.userData = null;
    this.router.navigate(['/login']);
  }

  /** Charge les données Firestore de l'utilisateur connecté */
  private async loadUserData(uid: string) {
    // console.log('🔍 Tentative de récupération Firestore pour UID :', uid);
    const userDocRef = doc(this.firestore, `Users/${uid}`);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      this.userData = userSnap.data();
      const role = this.userData.role || null;
      this.roleSubject.next(role);
      // console.log('Données utilisateur Firestore :', this.userData);
    } else {
      console.warn('Aucune donnée utilisateur trouvée dans Firestore');
      this.userData = null;
      this.roleSubject.next(null);
    }
  }

  get user$() {
    return this.userSubject.asObservable();
  }

  get role$() {
    return this.roleSubject.asObservable();
  }

  get uid(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  getUserData(): any {
    return this.userData;
  }
}
