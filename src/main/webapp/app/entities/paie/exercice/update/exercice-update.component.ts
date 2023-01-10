import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IExercice, Exercice } from '../exercice.model';
import { ExerciceService } from '../service/exercice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-exercice-update',
  templateUrl: './exercice-update.component.html',
})
export class ExerciceUpdateComponent implements OnInit {
  isSaving = false;
  titre = '';
  aujourdhui: any;
  exercice!: IExercice;

  editForm = this.fb.group({
    id: [],
    libelle: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4)]],
    dateDebut: [null, [Validators.required]],
    dateFin: [null, [Validators.required]],
    dateOuverture: [null, [Validators.required]],
    dateFermeture: [null, [Validators.required]],
    statut: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
  });

  constructor(protected exerciceService: ExerciceService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exercice }) => {
      const today = dayjs().startOf('day');

      if (exercice.id === undefined) {
        exercice.dateInsert = today;
        exercice.dateUpdate = today;
        this.titre = 'Ajouter Exercice';
      } else {
        this.titre = "Modification de l'exercice";
      }

      this.updateForm(exercice);
      this.aujourdhui = today;
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exercice = this.createFromForm();
    if (exercice.id !== undefined) {
      this.subscribeToSaveResponse(this.exerciceService.update(exercice));
    } else {
      this.subscribeToSaveResponse(this.exerciceService.create(exercice));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExercice>>): void {
    result.subscribe(
      (res: HttpResponse<IExercice>) => this.onSaveSuccess(res.body),
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: err.error.message,
        });
        // console.error(err.error.message);
      }
    );
    // Pour ne pas griser le bouton enregistrer
    this.isSaving = false;
  }

  protected onSaveSuccess(exercice: IExercice | null): void {
    if (exercice !== null) {
      this.exercice = exercice;

      this.isSaving = false;

      if (this.exercice.id !== undefined) {
        Swal.fire(
          `<h4 style="font-family: Helvetica; font-size:16px">Exercice <b>${exercice?.libelle ?? ''}</b> enregistré avec succès</h4>`
        );
      }

      this.previousState();
    }
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(exercice: IExercice): void {
    this.editForm.patchValue({
      id: exercice.id,
      libelle: exercice.libelle,
      dateDebut: exercice.dateDebut,
      dateFin: exercice.dateFin,
      dateOuverture: exercice.dateOuverture,
      dateFermeture: exercice.dateFermeture,
      statut: exercice.statut,
      userInsertId: exercice.userInsertId,
      userUpdateId: exercice.userUpdateId,
      dateInsert: exercice.dateInsert ? exercice.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: exercice.dateUpdate ? exercice.dateUpdate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IExercice {
    return {
      ...new Exercice(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value,
      dateFin: this.editForm.get(['dateFin'])!.value,
      dateOuverture: this.editForm.get(['dateOuverture'])!.value,
      dateFermeture: this.editForm.get(['dateFermeture'])!.value,
      statut: this.editForm.get(['statut'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
