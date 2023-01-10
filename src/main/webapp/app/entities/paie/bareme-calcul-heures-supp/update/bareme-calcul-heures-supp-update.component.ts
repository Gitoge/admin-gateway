import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IBaremeCalculHeuresSupp, BaremeCalculHeuresSupp } from '../bareme-calcul-heures-supp.model';
import { BaremeCalculHeuresSuppService } from '../service/bareme-calcul-heures-supp.service';

@Component({
  selector: 'jhi-bareme-calcul-heures-supp-update',
  templateUrl: './bareme-calcul-heures-supp-update.component.html',
})
export class BaremeCalculHeuresSuppUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    indiceDebut: [null, [Validators.required]],
    indiceFin: [null, [Validators.required]],
    soldeGlobalDebut: [null, [Validators.required]],
    soldeGlobalFin: [null, [Validators.required]],
    heuresOrdinaires: [null, [Validators.required]],
    dimanchesJoursFeries: [null, [Validators.required]],
    heuresNuit: [null, [Validators.required]],
    observation: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
  });

  constructor(
    protected baremeCalculHeuresSuppService: BaremeCalculHeuresSuppService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ baremeCalculHeuresSupp }) => {
      if (baremeCalculHeuresSupp.id === undefined) {
        const today = dayjs().startOf('day');
        baremeCalculHeuresSupp.dateInsert = today;
        baremeCalculHeuresSupp.dateUpdate = today;
      }

      this.updateForm(baremeCalculHeuresSupp);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const baremeCalculHeuresSupp = this.createFromForm();
    if (baremeCalculHeuresSupp.id !== undefined) {
      this.subscribeToSaveResponse(this.baremeCalculHeuresSuppService.update(baremeCalculHeuresSupp));
    } else {
      this.subscribeToSaveResponse(this.baremeCalculHeuresSuppService.create(baremeCalculHeuresSupp));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBaremeCalculHeuresSupp>>): void {
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

  protected updateForm(baremeCalculHeuresSupp: IBaremeCalculHeuresSupp): void {
    this.editForm.patchValue({
      id: baremeCalculHeuresSupp.id,
      indiceDebut: baremeCalculHeuresSupp.indiceDebut,
      indiceFin: baremeCalculHeuresSupp.indiceFin,
      soldeGlobalDebut: baremeCalculHeuresSupp.soldeGlobalDebut,
      soldeGlobalFin: baremeCalculHeuresSupp.soldeGlobalFin,
      heuresOrdinaires: baremeCalculHeuresSupp.heuresOrdinaires,
      dimanchesJoursFeries: baremeCalculHeuresSupp.dimanchesJoursFeries,
      heuresNuit: baremeCalculHeuresSupp.heuresNuit,
      observation: baremeCalculHeuresSupp.observation,
      userInsertId: baremeCalculHeuresSupp.userInsertId,
      userUpdateId: baremeCalculHeuresSupp.userUpdateId,
      dateInsert: baremeCalculHeuresSupp.dateInsert ? baremeCalculHeuresSupp.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: baremeCalculHeuresSupp.dateUpdate ? baremeCalculHeuresSupp.dateUpdate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IBaremeCalculHeuresSupp {
    return {
      ...new BaremeCalculHeuresSupp(),
      id: this.editForm.get(['id'])!.value,
      indiceDebut: this.editForm.get(['indiceDebut'])!.value,
      indiceFin: this.editForm.get(['indiceFin'])!.value,
      soldeGlobalDebut: this.editForm.get(['soldeGlobalDebut'])!.value,
      soldeGlobalFin: this.editForm.get(['soldeGlobalFin'])!.value,
      heuresOrdinaires: this.editForm.get(['heuresOrdinaires'])!.value,
      dimanchesJoursFeries: this.editForm.get(['dimanchesJoursFeries'])!.value,
      heuresNuit: this.editForm.get(['heuresNuit'])!.value,
      observation: this.editForm.get(['observation'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
