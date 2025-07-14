import { Component, OnInit } from '@angular/core';
import { Conge } from '../../utils/types';
import { CongeService } from '../../services/conge.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { CongeDetailsComponent } from "../conge-details/conge-details.component";
import { CongeEditComponent } from "../conge-edit/conge-edit.component";

@Component({
  selector: 'app-conge-table',
  templateUrl: './conge-table.component.html',
  styleUrls: ['./conge-table.component.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CongeDetailsComponent, CongeEditComponent]
})
export class CongeTableComponent implements OnInit {
  
  conges: Conge[] = [];
  filteredConges: Conge[] = [];

  
  loading = true;
  errorMsg = '';

  
  roles = ['Opérateur', 'Cadre', 'ENAM'];
  statuts = ['En attente', 'Approuvé', 'Refusé', 'Annulé'];
  selectedRole = '';
  selectedStatut = '';

  
  selectedConge?: Conge;
  editingConge?: Conge;

  constructor(private congeService: CongeService) {}

  ngOnInit(): void {
    this.congeService.getConges().subscribe({
      next: (data) => {
        
        this.conges = data.map(c => ({
          ...c,
          dateDebut: c.dateDebut instanceof Timestamp ? c.dateDebut.toDate() : c.dateDebut,
          dateFin:   c.dateFin   instanceof Timestamp ? c.dateFin.toDate()   : c.dateFin
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Erreur de chargement des congés.';
        this.loading = false;
      }
    });
  }

  
  applyFilters() {
    this.filteredConges = this.conges.filter(c => {
      const byRole   = this.selectedRole   ? c.role   === this.selectedRole   : true;
      const byStatut = this.selectedStatut ? c.statut === this.selectedStatut : true;
      return byRole && byStatut;
    });
  }

  
  onRoleChange(role: string) {
    this.selectedRole = role;
    this.applyFilters();
  }
  onStatutChange(statut: string) {
    this.selectedStatut = statut;
    this.applyFilters();
  }

  
  onViewDetails(c: Conge) { this.selectedConge = c; }
  onCloseDetails()      { this.selectedConge = undefined; }
  onEdit(c: Conge)      { this.editingConge = c; }
  onSaved(u: Conge)     { this.editingConge = undefined; this.applyFilters(); }
  onDelete(id?: string) {
    if (!id || !confirm('Confirmer la suppression ?')) return;
    this.congeService.deleteConge(id)
      .then(() => this.applyFilters())
      .catch(e => alert('Erreur suppression'));
  }
}
