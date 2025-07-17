import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conge } from '../../utils/types';
import { CongeService } from '../../services/conge.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-conge-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conge-details.component.html',
  styleUrls: ['./conge-details.component.css'],
  providers: [CongeService]
})
export class CongeDetailsComponent implements OnInit {
  @Input() conge?: Conge;

  allConges: Conge[] = [];

  selectedConge?: Conge;

  constructor(private congeService: CongeService, private emailService: EmailService) {}

  ngOnInit(): void {
     if (!this.conge) {
    this.congeService.getConges().subscribe(list => {
      this.allConges = list.map(c => ({
        ...c,
        dateDebut: (c.dateDebut as any).toDate ? (c.dateDebut as any).toDate() : new Date(c.dateDebut),
        dateFin:   (c.dateFin   as any).toDate ? (c.dateFin   as any).toDate()   : new Date(c.dateFin)
      }));
    });
  }
}

  onSelectChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const id = select.value;
  if (id) {
    this.selectedConge = this.allConges.find(c => c.id === id);
  } else {
    this.selectedConge = undefined;
  }
}


  get currentConge(): Conge | undefined {
    // si @Input fourni, priorité
    return this.conge ?? this.selectedConge;
  }

  exportPdf() {
  const c = this.currentConge!;
  const doc = new jsPDF();

  const img = new Image();
  img.src = 'assets/logo.png'; 

  img.onload = () => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const imgWidth = 45; 
    const imgHeight = 15; 
    const x = (pageWidth - imgWidth) / 2; 
    const y = 20; 

    doc.addImage(img, 'PNG', x, y, imgWidth, imgHeight);

    const contentStartY = y + imgHeight + 10; 

    doc.setFontSize(16);
    doc.text(`Demande de congé - ${c.nom}`, 14, contentStartY);

    doc.setFontSize(12);
    const message = `Suite à votre demande de congé et après traitement par notre service, nous vous informons que votre congé est bien accepté selon les informations citées dans le tableau suivant.`;
    const signature = `Signature : _____________________`;

    doc.text(message, 14, contentStartY + 10, { maxWidth: 180 });

    autoTable(doc, {
      startY: contentStartY + 30,
      head: [['Champ', 'Valeur']],
      body: [
        ['Nom', c.nom],
        ['matricule', c.matricule],
        ['Email', c.email || '—'],
        ['Département', c.departement],
        ['Rôle', c.role],
        ['Motif', c.motif],
        ['Date début', new Date(c.dateDebut).toLocaleDateString()],
        ['Date fin', new Date(c.dateFin).toLocaleDateString()],
        ['Nb jours', c.nbJours.toString()],
        ['Commentaire', c.commentaire || '—'],
        ['Statut', c.statut]
      ]
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(signature, 14, finalY);

    
    doc.save(`conge_${c.nom}_${c.matricule}.pdf`);
  };
}
//send a mail
envoyerEmail() {
  const c = this.currentConge;
  if (!c) {
    alert('Aucun congé sélectionné.');
    return;
  }
   if (!c || !c.email) {
    alert('Adresse email introuvable, impossible d’envoyer le mail.');
    return;
  }
 
  const dateDebutStr = new Date(c.dateDebut).toLocaleDateString('fr-FR');
  const dateFinStr   = new Date(c.dateFin).toLocaleDateString('fr-FR');

  this.emailService.sendApprovalEmail(
    c.email!,     // non-null car obligatoire si tu affiches le bouton
    c.nom,
    dateDebutStr,
    dateFinStr
  )
  .then(() => {
    console.log('Email envoyé avec succès ✅');
    alert("Email envoyé avec succès !");
  })
  .catch(err => {
    console.error('Erreur lors de l\'envoi de l\'email ❌', err);
    alert("Erreur lors de l'envoi de l'email.");
  });
}


}
