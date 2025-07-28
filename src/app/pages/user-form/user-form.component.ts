import { Component, OnInit } from '@angular/core';
import { CongeFormComponent } from '../conge-form/conge-form.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { CongeService } from '../../services/conge.service';
import { Timestamp } from 'firebase/firestore';
import { Conge } from '../../utils/types';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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
      matricule: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],

      email: ['', [Validators.required, Validators.email]],
      departement: ['', Validators.required],
      categorie: ['', Validators.required],
      motif: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      nbJours: [{ value: 0, disabled: true }, Validators.required],
      commentaire: [''],
      statut: ['En attente' ,{ disabled: true}, Validators.required ]
    }, { validators: [this.dateRangeValidator, this.dateDebutNotInPastValidator] });
  }

  ngOnInit(): void {
    
    this.congeForm.get('dateDebut')?.valueChanges.subscribe(() => this.calculateDays());
    this.congeForm.get('dateFin')?.valueChanges.subscribe(() => this.calculateDays());
  }

  dateRangeValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('dateDebut')?.value;
    const end = group.get('dateFin')?.value;
    if (start && end && new Date(start) > new Date(end)) {
      return { invalidDateRange: true };
    }
    return null;
  };

dateDebutNotInPastValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const debut = group.get('dateDebut')?.value;
  if (debut) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // on enlève l'heure pour comparaison stricte
    const debutDate = new Date(debut);
    if (debutDate < today) {
      return { dateDebutInPast: true };
      }
    }
    return null;
  };



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
    this.errorMessage = "Veuillez remplire et corriger les erreurs dans le formulaire.";
    this.successMessage = null;
    return;
  }

  const formValue = this.congeForm.getRawValue();

  this.congeService.existsConge(formValue.nom, formValue.matricule).then(exists => {
    if (exists) {
      this.errorMessage = "Une demande existe déjà avec ce nom et matricule.";
      this.successMessage = null;
      return;
    }

    const newConge: Conge = {
      nom: formValue.nom,
      matricule: formValue.matricule,
      email: formValue.email,
      departement: formValue.departement,
      categorie: formValue.role,
      motif: formValue.motif,
      dateDebut: new Date(formValue.dateDebut),
      dateFin: new Date(formValue.dateFin),
      nbJours: formValue.nbJours,
      commentaire: formValue.commentaire,
      statut: 'En attente',
      approuveParRH: false,
      approuveParDirecteur: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    this.congeService.addConge(newConge).then(() => {
      this.successMessage = 'Demande enregistrée avec succès.';
      this.errorMessage = null;
      this.congeForm.reset({ statut: 'En attente', nbJours: 0 });
      this.nbJoursCalcul = 0;
      setTimeout(() => this.successMessage = null, 4000);
    }).catch(err => {
      console.error(err);
      this.errorMessage = "Erreur lors de l'enregistrement.";
      this.successMessage = null;
    });
  });
}



}


