import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conge } from '../../utils/types';
import { CongeService } from '../../services/conge.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-conge-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conge-details.component.html',
  styleUrls: ['./conge-details.component.css'],
  providers: [CongeService]
})
export class CongeDetailsComponent implements OnInit {
  /** Optionnel : si le parent passe déjà un conge */
  @Input() conge?: Conge;

  /** Liste complète pour la dropdown */
  allConges: Conge[] = [];

  /** Conge sélectionné par le dropdown (si `@Input` non défini) */
  selectedConge?: Conge;

  constructor(private congeService: CongeService) {}

  ngOnInit(): void {
    // Si aucun conge en input, on charge la liste pour alimenter la dropdown
     if (!this.conge) {
    this.congeService.getConges().subscribe(list => {
      // Pour chaque congé, on convertit dateDebut/dateFin en JS Date
      this.allConges = list.map(c => ({
        ...c,
        dateDebut: (c.dateDebut as any).toDate ? (c.dateDebut as any).toDate() : new Date(c.dateDebut),
        dateFin:   (c.dateFin   as any).toDate ? (c.dateFin   as any).toDate()   : new Date(c.dateFin)
      }));
    });
  }
}

  /** Méthode appelée quand on choisit un congé dans la dropdown */
  onSelectChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const id = select.value;
  if (id) {
    this.selectedConge = this.allConges.find(c => c.id === id);
  } else {
    this.selectedConge = undefined;
  }
}


  /** Retourne le congé effectivement à afficher */
  get currentConge(): Conge | undefined {
    // si @Input fourni, priorité
    return this.conge ?? this.selectedConge;
  }

  /** Génère le PDF si le congé est approuvé */
  exportPdf() {
    const c = this.currentConge!;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Demande de congé - ${c.nom}`, 14, 20);

    // Préparer les lignes
    const rows = [
      ['Nom', c.nom],
      ['CNI', c.cni],
      ['Email', c.email || '—'],
      ['Département', c.departement],
      ['Rôle', c.role],
      ['Type', c.type],
      ['Date début', new Date(c.dateDebut).toLocaleDateString()],
      ['Date fin', new Date(c.dateFin).toLocaleDateString()],
      ['Nb jours', c.nbJours.toString()],
      ['Commentaire', c.commentaire || '—'],
      ['Statut', c.statut]
    ];

    // Appeler autoTable
    autoTable(doc, {
      startY: 30,
      head: [['Champ', 'Valeur']],
      body: rows
    });

    doc.save(`conge_${c.id}.pdf`);
  }
}

