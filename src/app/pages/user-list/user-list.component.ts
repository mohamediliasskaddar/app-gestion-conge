import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { User } from '../../utils/types';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent implements OnInit {
  users$: Observable<User[]> | undefined;

  constructor(private firestore: Firestore) {}

  ngOnInit() {
    const usersRef = collection(this.firestore, 'Users');
    this.users$ = collectionData(usersRef, { idField: 'id' }) as Observable<User[]>;
  }

  async deleteUser(userId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const userDocRef = doc(this.firestore, 'Users', userId);
        await deleteDoc(userDocRef);
        console.log('Utilisateur supprimé');
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        alert("Erreur lors de la suppression de l'utilisateur.");
      }
    }
  }
}
