import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPeriodePaye, PeriodePaye } from '../periode-paye.model';
import { PeriodePayeService } from '../service/periode-paye.service';
import { IExercice } from 'app/entities/paie/exercice/exercice.model';
import { ExerciceService } from 'app/entities/paie/exercice/service/exercice.service';
import { Dayjs } from 'dayjs';

@Component({
  selector: 'jhi-periode-paye-update',
  templateUrl: './periode-paye-update.component.html',
})
export class PeriodePayeUpdateComponent implements OnInit {
  isSaving = false;
  titre = '';
  periodePaye?: IPeriodePaye;
  today: any;

  exercicesSharedCollection: IExercice[] = [];

  editForm = this.fb.group({
    id: [],
    libelle: [null, [Validators.required]],
    dateDebut: [null, [Validators.required]],
    dateFin: [null, [Validators.required]],
    dateDebutSaisie: [null, [Validators.required]],
    dateFinSaisie: [null, [Validators.required]],
    dateDebutCalculSal: [],
    dateFinCalculSal: [],
    statut: [null, [Validators.required]],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
    exercice: [],
  });

  constructor(
    protected periodePayeService: PeriodePayeService,
    protected exerciceService: ExerciceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ periodePaye }) => {
      this.periodePaye = periodePaye;
      if (periodePaye.id === undefined) {
        const today = dayjs().startOf('day');
        periodePaye.dateInsert = today;
        this.titre = 'Ajouter Période Paie';
      } else {
        const today = dayjs().startOf('day');
        periodePaye.dateUpdate = today;
        this.today = today;
        this.titre = 'Modifier Période Paie';
      }

      this.updateForm(periodePaye);

      this.loadRelationshipsOptions();
    });
  }
  diff(date1: Dayjs, date2: Dayjs): number {
    return date1.diff(date2) / (1000 * 60 * 60 * 24);
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const periodePaye = this.createFromForm();
    if (periodePaye.id !== undefined) {
      this.subscribeToSaveResponse(this.periodePayeService.update(periodePaye));
    } else {
      this.subscribeToSaveResponse(this.periodePayeService.create(periodePaye));
    }
  }

  trackExerciceById(_index: number, item: IExercice): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPeriodePaye>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(periodePaye: IPeriodePaye): void {
    this.editForm.patchValue({
      id: periodePaye.id,
      libelle: periodePaye.libelle,
      dateDebut: periodePaye.dateDebut,
      dateFin: periodePaye.dateFin,
      dateDebutSaisie: periodePaye.dateDebutSaisie,
      dateFinSaisie: periodePaye.dateFinSaisie,
      dateDebutCalculSal: periodePaye.dateDebutCalculSal,
      dateFinCalculSal: periodePaye.dateFinCalculSal,
      statut: periodePaye.statut,
      userInsertId: periodePaye.userInsertId,
      userUpdateId: periodePaye.userUpdateId,
      dateInsert: periodePaye.dateInsert ? periodePaye.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: periodePaye.dateUpdate ? periodePaye.dateUpdate.format(DATE_TIME_FORMAT) : null,
      exercice: periodePaye.exercice,
    });

    this.exercicesSharedCollection = this.exerciceService.addExerciceToCollectionIfMissing(
      this.exercicesSharedCollection,
      periodePaye.exercice
    );
  }

  protected loadRelationshipsOptions(): void {
    this.exerciceService
      .query()
      .pipe(map((res: HttpResponse<IExercice[]>) => res.body ?? []))
      .pipe(
        map((exercices: IExercice[]) =>
          this.exerciceService.addExerciceToCollectionIfMissing(exercices, this.editForm.get('exercice')!.value)
        )
      )
      .subscribe((exercices: IExercice[]) => (this.exercicesSharedCollection = exercices));
  }

  protected createFromForm(): IPeriodePaye {
    return {
      ...new PeriodePaye(),
      id: this.editForm.get(['id'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value,
      dateFin: this.editForm.get(['dateFin'])!.value,
      dateDebutSaisie: this.editForm.get(['dateDebutSaisie'])!.value,
      dateFinSaisie: this.editForm.get(['dateFinSaisie'])!.value,
      dateDebutCalculSal: this.editForm.get(['dateDebutCalculSal'])!.value,
      dateFinCalculSal: this.editForm.get(['dateFinCalculSal'])!.value,
      statut: this.editForm.get(['statut'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      exercice: this.editForm.get(['exercice'])!.value,
    };
  }
}
