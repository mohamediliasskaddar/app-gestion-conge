import { Component } from '@angular/core';
import { CongeDetailsComponent } from '../conge-details/conge-details.component';
import { CongeFormComponent } from '../conge-form/conge-form.component';
import { CongeTableComponent } from '../conge-table/conge-table.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { CongeService } from '../../services/conge.service';
import { NgIf } from '@angular/common';
import { CongeCalendarComponent } from '../conge-calendar/conge-calendar.component';


@Component({
  selector: 'app-dashboard',
  imports: [NgIf, CongeDetailsComponent, CongeTableComponent,
     CongeFormComponent, SidebarComponent, HeaderComponent, CongeCalendarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  loading = true;// to edit as well 
  selectedSection = 'conge-form';// to edit 
  // constructor(private srv : CongeService) {}

  onSectionSelected(section: string) {
    this.selectedSection = section;
  }
}
