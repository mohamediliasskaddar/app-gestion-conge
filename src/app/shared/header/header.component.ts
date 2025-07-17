import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router : Router, private auth : AuthService){}

 logout() {
    alert('Logged out!'); 
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  

  onButtonClick() {
    console.log('Button clicked');
    alert('Button clicked!');
  }
}
