import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router : Router){}
 logout() {
    // Add your logout logic here, e.g., clear auth tokens, redirect, etc.
    this.router.navigate(['/login']);
    alert('Logged out!'); // example
  }

  onButtonClick() {
    // Your custom button logic here
    console.log('Button clicked');
    alert('Button clicked!');
  }
}
