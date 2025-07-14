import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  editForm!: FormGroup;
  nbJoursCalcul: number = 0;

  constructor(
    private fb: FormBuilder,
    private congeService: CongeService
  ) {}

  ngOnInit(): void {
    // Crée le form et patch avec la conge reçue
    this.editForm = this.fb.group({
      nom: [this.conge.nom, Validators.required],
      cni: [this.conge.cni, Validators.required],
      email: [this.conge.email, Validators.email],
      departement: [this.conge.departement, Validators.required],
      role: [this.conge.role, Validators.required],
      type: [this.conge.type, Validators.required],
      dateDebut: [this.formatInputDate(this.conge.dateDebut), Validators.required],
      dateFin: [this.formatInputDate(this.conge.dateFin), Validators.required],
      nbJours: [{ value: this.conge.nbJours, disabled: true }, Validators.required],
      commentaire: [this.conge.commentaire],
      statut: [this.conge.statut, Validators.required]
    });

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
    const fin   = this.editForm.get('dateFin')?.value;
    if (debut && fin) {
      const diff = new Date(fin).getTime() - new Date(debut).getTime();
      this.nbJoursCalcul = Math.floor(diff/(1000*60*60*24)) + 1;
      if (this.nbJoursCalcul > 0) {
        this.editForm.get('nbJours')?.setValue(this.nbJoursCalcul);
      }
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
      cni: v.cni,
      email: v.email,
      departement: v.departement,
      role: v.role,
      type: v.type,
      dateDebut: new Date(v.dateDebut),
      dateFin:   new Date(v.dateFin),
      nbJours:   v.nbJours,
      commentaire: v.commentaire,
      statut: v.statut,
      updatedAt: Timestamp.now()
    };
    this.congeService.updateConge(updated)
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
