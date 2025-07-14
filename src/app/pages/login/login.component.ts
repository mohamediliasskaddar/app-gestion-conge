import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore'; // 👈 Import Firestore
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, NgIf],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private router: Router, private firestore: Firestore) {} // 👈 Inject Firestore

  async login() {
    if (this.username === 'RH' && this.password === 'RH') {
      // try {
      //   await addDoc(collection(this.firestore, 'logins'), {
      //     user: this.username,
      //     timestamp: new Date(),
      //     status: 'Login successful'
      //   });
      //   console.log('Login log added to Firestore ✅');
      // } catch (error) {
      //   console.error('Error writing to Firestore ❌', error);
      // }

      this.errorMessage = '';
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
