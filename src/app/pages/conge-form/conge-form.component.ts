  import { Component, OnInit, OnDestroy } from '@angular/core';
  import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { Timestamp } from 'firebase/firestore';
  import { Conge } from '../../utils/types';
  import { CongeService } from '../../services/conge.service';
  import { AuthService } from '../../services/auth.service';
  import { Subscription } from 'rxjs';
  import { NgIf } from '@angular/common';
  import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';


  @Component({
    selector: 'app-conge-form',
    templateUrl: './conge-form.component.html',
    standalone: true,
    styleUrls: ['./conge-form.component.css'],
    imports: [NgIf, FormsModule, ReactiveFormsModule]
  })
  export class CongeFormComponent implements OnInit, OnDestroy {
    congeForm: FormGroup;
    nbJoursCalcul: number = 0;
    successMessage: string | null = null;
    errorMessage: string | null = null;
    userRole: string | null = null;

    private roleSub!: Subscription;

    constructor(
      private fb: FormBuilder,
      private congeService: CongeService,
      private authService: AuthService
    ) {
      this.congeForm = this.fb.group({
        nom: ['', Validators.required],
        matricule: ['',  [  Validators.required,    Validators.pattern(/^\d{4}$/) ]],
        email: ['', [Validators.required, Validators.email]],
        departement: ['', Validators.required],
        categorie: ['Ovrier', Validators.required],
        motif: ['', Validators.required],
        dateDebut: ['', Validators.required],
        dateFin: ['', Validators.required],
        nbJours: [{ value: 0, disabled: true }, Validators.required],
        commentaire: [''],
        statut: ['En attente', Validators.required]
      }, { validators: [this.dateRangeValidator, this.dateDebutNotInPastValidator] });
    }

    ngOnInit(): void {
      this.congeForm.get('dateDebut')?.valueChanges.subscribe(() => this.calculateDays());
      this.congeForm.get('dateFin')?.valueChanges.subscribe(() => this.calculateDays());

      this.roleSub = this.authService.role$.subscribe((role) => {
        this.userRole = role;
        console.log('Rôle utilisateur connecté :', role);
      });

      // Rendre "commentaire" requis si motif = "autres"
      this.congeForm.get('motif')?.valueChanges.subscribe((motif) => {
        const commentaireControl = this.congeForm.get('commentaire');
        if (motif === 'autres') {
          commentaireControl?.setValidators([Validators.required]);
        } else {
          commentaireControl?.clearValidators();
        }
        commentaireControl?.updateValueAndValidity();
      });
    }

    ngOnDestroy(): void {
      this.roleSub?.unsubscribe();
    }

   
    calculateDays(): void {
    const debut = this.congeForm.get('dateDebut')?.value;
    const fin = this.congeForm.get('dateFin')?.value;

    if (debut && fin) {
      const start = new Date(debut);
      const end = new Date(fin);
      let dayCount = 0;
      // On compte les jours ouvrés (du lundi au vendredi)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = d.getDay(); // 0 = Sunday, 6 = Saturday
        if (dayOfWeek !== 0 && dayOfWeek !== 6 ) { 
        // if (dayOfWeek !== 0 ) { 
          dayCount++;
        }
      }

      this.nbJoursCalcul = dayCount;
      this.congeForm.get('nbJours')?.setValue(this.nbJoursCalcul);
    }
}


    onSubmit(): void {
      if (this.congeForm.invalid) {
        this.congeForm.markAllAsTouched();
        this.errorMessage = "Veuillez remplir correctement tous les champs requis.";
        return;
      }

      const formValue = this.congeForm.getRawValue();

      // Règles d'approbation automatique
      let statut = formValue.statut;
      let approuveParRH = false;
      let approuveParDirecteur = false;

      if (this.userRole === 'Directeur') {
        statut = 'Approuvé';
        approuveParDirecteur = true;
      } else if (this.userRole === 'RH') {
        statut = 'En attente'; // on force RH à laisser en attente
      }

      const newConge: Conge = {
        nom: formValue.nom,
        matricule: formValue.matricule,
        email: formValue.email,
        departement: formValue.departement,
        categorie: formValue.categorie,
        motif: formValue.motif,
        dateDebut: new Date(formValue.dateDebut),
        dateFin: new Date(formValue.dateFin),
        nbJours: formValue.nbJours,
        commentaire: formValue.commentaire,
        statut: statut,
        approuveParRH: approuveParRH,
        approuveParDirecteur: approuveParDirecteur,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      this.congeService.addConge(newConge).then(() => {
        this.successMessage = 'Demande de congé enregistrée avec succès.';
        this.errorMessage = null;
        this.resetForm();
      }).catch((err) => {
        console.error('Erreur:', err);
        this.errorMessage = "Erreur lors de l'enregistrement.";
        this.successMessage = null;
      });
    }

    resetForm(): void {
      this.congeForm.reset({
        nom: '',
        matricule: '',
        email: '',
        departement: '',
        categorie: 'Ovrier',
        motif: '',
        dateDebut: '',
        dateFin: '',
        nbJours: 0,
        commentaire: '',
        statut: 'En attente'
      });
      this.nbJoursCalcul = 0;
      setTimeout(() => (this.successMessage = null), 4000);
    }

  // Fonction de validation : dateDebut doit être <= dateFin
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

  }

