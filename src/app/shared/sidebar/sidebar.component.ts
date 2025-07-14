import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router) {}

   @Output() sectionSelected = new EventEmitter<string>();
    selectedSection: string = '';


   select(section: string) {
    this.selectedSection = section; 
    this.sectionSelected.emit(section);
  }
  
  navigate(path: string) {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

}
