// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { Firestore, collection, addDoc } from '@angular/fire/firestore'; // 👈 Import Firestore
// import { NgIf } from '@angular/common';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   standalone: true,
//   imports: [FormsModule, NgIf],
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent {
//   username: string = '';
//   password: string = '';
//   errorMessage: string = '';

//   constructor(private router: Router, private firestore: Firestore, private auth: AuthService) {} // 👈 Inject Firestore

//   async login() {
//     const ok = await this.auth.login(this.username, this.password);
//     if (ok) {
//       this.router.navigate(['/dashboard']);
//     } else {
//       this.errorMessage = 'Utilisateur / mot de passe incorrect';
//     }
//   }

//   userDemande(){
//     this.router.navigate(['/user-form']);//to edit for the demande 
//   }
// }
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, NgIf],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';      // on passe du username à email
  password = '';
  errorMessage = '';

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  /** Tentative de connexion */
  async login() {
    this.errorMessage = '';
    const ok = await this.auth.login(this.email, this.password);
    if (ok) {
      // Redirection vers le dashboard RH
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Email ou mot de passe incorrect';
    }
  }

  /** Accès au formulaire de demande non protégé */
  userDemande() {
    this.router.navigate(['/user-form']);
  }
}
