
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Conge } from '../../utils/types';
import { CongeService } from '../../services/conge.service';
import { NgIf } from '@angular/common';
import { seedConges } from '../../utils/seed-conges';// already used 

@Component({
  selector: 'app-conge-form',
  templateUrl: './conge-form.component.html',
  styleUrls: ['./conge-form.component.css'],
  imports: [NgIf, FormsModule, ReactiveFormsModule,  ]
})

export class CongeFormComponent implements OnInit {
  congeForm: FormGroup;
  nbJoursCalcul: number = 0;
  successMessage: string | null = null;
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private congeService: CongeService ) {
    
    this.congeForm = this.fb.group({
      nom: ['', Validators.required],
      cni: ['', Validators.required],
      email: ['', [Validators.email]],
      departement: ['', Validators.required],
      role: ['', Validators.required],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nbJours: [{ value: 0, disabled: true }, Validators.required],
      commentaire: [''],
      statut: ['En attente', Validators.required]
    });
  }

  ngOnInit(): void {
    
    this.congeForm.get('dateDebut')?.valueChanges.subscribe(() => this.calculateDays());
    this.congeForm.get('dateFin')?.valueChanges.subscribe(() => this.calculateDays());
    // seedConges(this.congeService); IUSED IT FOR INSERTING DAATA INTO THE DB 
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
      cni: formValue.cni,
      email: formValue.email,
      departement: formValue.departement,
      role: formValue.role,
      type: formValue.type,
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

