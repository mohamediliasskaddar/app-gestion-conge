import { Component, OnInit } from '@angular/core';
import { CongeFormComponent } from '../conge-form/conge-form.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { CongeService } from '../../services/conge.service';
import { Timestamp } from 'firebase/firestore';
import { Conge } from '../../utils/types';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-user-form',
  imports: [NgIf, FormsModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})

export class UserFormComponent implements OnInit{
 congeForm: FormGroup;
  nbJoursCalcul: number = 0;
  successMessage: string | null = null;
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private congeService: CongeService ) {
    
    this.congeForm = this.fb.group({
      nom: ['', Validators.required],
      matricule: ['', Validators.required],
      email: ['', [Validators.email]],
      departement: ['', Validators.required],
      role: ['', Validators.required],
      motif: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nbJours: [{ value: 0, disabled: true }, Validators.required],
      commentaire: [''],
      statut: ['En attente' ,{ disabled: true}, Validators.required ]
    });
  }

  ngOnInit(): void {
    
    this.congeForm.get('dateDebut')?.valueChanges.subscribe(() => this.calculateDays());
    this.congeForm.get('dateFin')?.valueChanges.subscribe(() => this.calculateDays());
  }

  calculateDays(): void {
    const debut = this.congeForm.get('dateDebut')?.value;
    const fin = this.congeForm.get('dateFin')?.value;
    if (debut && fin) {
      const diff = (new Date(fin).getTime() - new Date(debut).getTime());
      this.nbJoursCalcul = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
      if (this.nbJoursCalcul > 0) {
        this.congeForm.get('nbJours')?.setValue(this.nbJoursCalcul);
      }
    }
  }

  onSubmit(): void {
    if (this.congeForm.invalid) {
      this.congeForm.markAllAsTouched();
      return;
    }

    const formValue = this.congeForm.getRawValue();
    const newConge: Conge = {
      nom: formValue.nom,
      matricule: formValue.matricule,
      email: formValue.email,
      departement: formValue.departement,
      role: formValue.role,
      motif: formValue.motif,
      dateDebut: new Date(formValue.dateDebut),
      dateFin: new Date(formValue.dateFin),
      nbJours: formValue.nbJours,
      commentaire: formValue.commentaire,
      statut: formValue.statut,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    this.congeService.addConge(newConge).then(() => {
      this.successMessage = 'Demande de congé enregistrée avec succès !';
      this.errorMessage = null;
      this.congeForm.reset({ statut: 'En attente', nbJours: 0 });
      this.nbJoursCalcul = 0;
      setTimeout(() => this.successMessage = null, 4000);
    }).catch(err => {
      console.error(err);
      this.errorMessage = "Erreur lors de l'enregistrement.";
      this.successMessage = null;
      setTimeout(() => this.errorMessage = null, 5000);
    });
  }


}


