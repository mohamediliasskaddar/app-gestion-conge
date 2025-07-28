import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../../utils/types';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class NewUserComponent {
  // L'objet de création
  user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string } = {
    nom: '',
    email: '',
    matricule: '',
    password: '',
    departement: '',
    role: 'RH',
  };

  error = '';
  success = '';

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private router: Router
  ) {}

  /** Crée un compte utilisateur (Firebase Auth + Firestore) */
  async createUser() {
    this.error = '';
    this.success = '';

    try {
      // Crée dans Firebase Auth
      const cred = await createUserWithEmailAndPassword(this.auth, this.user.email, this.user.password);
      const uid = cred.user.uid;

      // Crée dans Firestore sans stocker le mot de passe
      const userToSave: User = {
        id: uid,
        nom: this.user.nom,
        email: this.user.email,
        matricule: this.user.matricule,
        departement: this.user.departement,
        role: this.user.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(this.firestore, 'Users', uid), userToSave);

      this.success = 'Utilisateur créé avec succès.';
      this.resetForm();

    } catch (err: any) {
      this.error = err.message || 'Erreur lors de la création.';
    }
  }

  private resetForm() {
    this.user = {
      nom: '',
      email: '',
      matricule: '',
      password: '',
      departement: '',
      role: 'RH',
    };
  }
}
