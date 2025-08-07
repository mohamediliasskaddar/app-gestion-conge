import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-sidebar',
  imports: [NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

   @Output() sectionSelected = new EventEmitter<string>();
    selectedSection: string = '';
    role: string | null = null;
     isOpen = false; // pour mobile


  ngOnInit(): void {
       this.authService.role$.subscribe(role => {
      this.role = role;
    });
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }



  select(section: string) {
    this.selectedSection = section; 
    this.sectionSelected.emit(section);
  }
  
  navigate(path: string) {
    this.router.navigate([path]);
    this.isOpen = false;
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  
}
