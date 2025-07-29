import { Component, OnInit } from '@angular/core';
import { Conge } from '../../utils/types';
import { CongeService } from '../../services/conge.service';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Timestamp } from 'firebase/firestore';
import { CongeDetailsComponent } from "../conge-details/conge-details.component";
import { CongeEditComponent } from "../conge-edit/conge-edit.component";
import * as XLSX from 'xlsx';
import { saveAs} from 'file-saver';
import { AuthService } from '../../services/auth.service';
// import { saveAs } from 'file-saver';

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

  roles = ['Ovrier', 'Cadre', 'ETAM'];
  statuts = ['En attente', 'Approuvé', 'Refusé'];
  selectedRole = '';
  selectedStatut = '';
  userRole: string | null = null;
  
  selectedConge?: Conge;
  editingConge?: Conge;

  constructor(private congeService: CongeService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.role$.subscribe(role => this.userRole = role);
    this.congeService.getConges().subscribe({
      next: (data) => {
       
        this.conges = data.map(c => ({
            ...c,
            dateDebut: c.dateDebut instanceof Timestamp ? c.dateDebut.toDate() : c.dateDebut,
            dateFin:   c.dateFin   instanceof Timestamp ? c.dateFin.toDate()   : c.dateFin,
            createdAt: c.createdAt instanceof Timestamp ? c.createdAt.toDate() : c.createdAt
          })).sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();  // Trie du plus récent au plus ancien
          });

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
      const byRole   = this.selectedRole   ? c.categorie   === this.selectedRole   : true;
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
  onCloseEdit() {  this.editingConge = undefined; }

  onSaved(u: Conge)     { this.editingConge = undefined; this.applyFilters(); }
  onDelete(id?: string) {
    if (!id || !confirm('Confirmer la suppression ?')) return;
    this.congeService.deleteConge(id)
      .then(() => this.applyFilters())
      .catch(e => alert('Erreur suppression'));
  }
  onCancelEdit() {
  this.editingConge = undefined;
}
  //toggeling part rh and dir 
  onToggleRH(c: Conge): void {
  if (this.userRole !== 'RH') return;
  const updated = { ...c, approuveParRH: !c.approuveParRH };
  this.congeService.updateConge(c.id!, updated).then(this.applyFilters.bind(this));
}

onToggleDirecteur(c: Conge): void {
  if (this.userRole !== 'Directeur') return;
  const updated = { ...c, approuveParDirecteur: !c.approuveParDirecteur };
  if (updated.approuveParDirecteur) {
    updated.statut = 'Approuvé';
   } else { 
    updated.statut = 'En attente'; // <-- ou autre statut par défaut
  }
  this.congeService.updateConge(c.id!, updated).then(this.applyFilters.bind(this));
}





  exportExcel(): void {
    const data = this.filteredConges.map(c => ({
      Nom: c.nom,
      Matricule: c.matricule,
      Département: c.departement,
      Rôle: c.categorie,
      Motif: c.motif,
      'Date début': new Date(c.dateDebut).toLocaleDateString(),
      'Date fin':   new Date(c.dateFin).toLocaleDateString(),
      Jours: c.nbJours,
      Statut: c.statut
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Congés');

    const wbout: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // fomatation de date 
   const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');

  const dateTimeStr = `${yyyy}-${mm}-${dd}_${hh}-${min}`;
  const filename = `conges_${dateTimeStr}.xlsx`;

    // Sauver le fichier Excel
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, filename);
  }
}
