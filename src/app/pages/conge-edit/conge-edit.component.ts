import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Conge } from '../../utils/types';
import { CongeService } from '../../services/conge.service';

@Component({
  selector: 'app-conge-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './conge-edit.component.html',
  styleUrls: ['./conge-edit.component.css'],
  providers: [CongeService]
})
export class CongeEditComponent implements OnInit {
  @Input() conge!: Conge;
  @Output() saved = new EventEmitter<Conge>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  editForm!: FormGroup;
  nbJoursCalcul: number = 0;

  constructor(
    private fb: FormBuilder,
    private congeService: CongeService
  ) {}
dateRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const start = group.get('dateDebut')?.value;
  const end = group.get('dateFin')?.value;
  return (start && end && new Date(start) > new Date(end)) ? { invalidDateRange: true } : null;
};
  ngOnInit(): void {
    // Crée le form et patch avec la conge reçue
    this.editForm = this.fb.group({
      nom: [this.conge.nom, Validators.required],
      matricule: [this.conge.matricule,  [  Validators.required,    Validators.pattern(/^\d{4}$/) ]],
      email: [this.conge.email, Validators.email],
      departement: [this.conge.departement, Validators.required],
      categorie: [this.conge.categorie, Validators.required],
      motif: [this.conge.motif, Validators.required],
      dateDebut: [this.formatInputDate(this.conge.dateDebut), Validators.required],
      dateFin: [this.formatInputDate(this.conge.dateFin), Validators.required],
      nbJours: [{ value: this.conge.nbJours, disabled: true }, Validators.required],
      commentaire: [this.conge.commentaire],
      statut: [this.conge.statut, Validators.required]
    },{ validators: this.dateRangeValidator });



    this.calculateDays();
    this.editForm.get('dateDebut')?.valueChanges.subscribe(() => this.calculateDays());
    this.editForm.get('dateFin')?.valueChanges.subscribe(() => this.calculateDays());
  }

  private formatInputDate(d: Date|string|any): string {
    const date = d instanceof Date ? d : (d.toDate ? d.toDate() : new Date(d));
    const yyyy = date.getFullYear();
    const mm = (date.getMonth()+1).toString().padStart(2,'0');
    const dd = date.getDate().toString().padStart(2,'0');
    return `${yyyy}-${mm}-${dd}`;
  }

  

  calculateDays(): void {
    const debut = this.editForm.get('dateDebut')?.value;
    const fin = this.editForm.get('dateFin')?.value;

    if (debut && fin) {
      const start = new Date(debut);
      const end = new Date(fin);
      let dayCount = 0;
      // On compte les jours ouvrés (du lundi au vendredi)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6 ) { 
          dayCount++;
        }
      }

      this.nbJoursCalcul = dayCount;
      this.editForm.get('nbJours')?.setValue(this.nbJoursCalcul);
    }
}

  onSubmit(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    const v = this.editForm.getRawValue();
    const updated: Conge = {
      ...this.conge,
      nom: v.nom,
      matricule: v.matricule,
      email: v.email,
      departement: v.departement,
      categorie: v.categorie,
      motif: v.motif,
      dateDebut: new Date(v.dateDebut),
      dateFin:   new Date(v.dateFin),
      nbJours:   v.nbJours,
      commentaire: v.commentaire,
      statut: v.statut,
      updatedAt: Timestamp.now()
    };
    this.congeService.editUpdateConge(updated)
      .then(() => {
        this.saved.emit(updated);
      })
      .catch(err => {
        console.error(err);
        alert('Erreur lors de la mise à jour');
      });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
