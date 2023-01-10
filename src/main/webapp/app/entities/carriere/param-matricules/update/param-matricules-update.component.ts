import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IParamMatricules, ParamMatricules } from '../param-matricules.model';
import { ParamMatriculesService } from '../service/param-matricules.service';

@Component({
  selector: 'jhi-param-matricules-update',
  templateUrl: './param-matricules-update.component.html',
})
export class ParamMatriculesUpdateComponent implements OnInit {
  isSaving = false;
  titre = '';

  editForm = this.fb.group({
    id: [],
    numeroMatricule: [],
    datePriseEnCompte: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
    etat: [],
    pecId: [],
  });

  constructor(
    protected paramMatriculesService: ParamMatriculesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramMatricules }) => {
      if (paramMatricules.id === undefined) {
        const today = dayjs().startOf('day');
        paramMatricules.dateInsert = today;
        paramMatricules.dateUpdate = today;
        this.titre = 'Ajouter Matricule';
      } else {
        this.titre = 'Modifier Matricule';
      }

      this.updateForm(paramMatricules);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paramMatricules = this.createFromForm();
    if (paramMatricules.id !== undefined) {
      this.subscribeToSaveResponse(this.paramMatriculesService.update(paramMatricules));
    } else {
      this.subscribeToSaveResponse(this.paramMatriculesService.create(paramMatricules));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParamMatricules>>): void {
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

  protected updateForm(paramMatricules: IParamMatricules): void {
    this.editForm.patchValue({
      id: paramMatricules.id,
      numeroMatricule: paramMatricules.numeroMatricule,
      datePriseEnCompte: paramMatricules.datePriseEnCompte,
      etat: paramMatricules.etat,
      pecId: paramMatricules.pecId,
      userInsertId: paramMatricules.userInsertId,
      userUpdateId: paramMatricules.userUpdateId,
      dateInsert: paramMatricules.dateInsert ? paramMatricules.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: paramMatricules.dateUpdate ? paramMatricules.dateUpdate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IParamMatricules {
    return {
      ...new ParamMatricules(),
      id: this.editForm.get(['id'])!.value,
      numeroMatricule: this.editForm.get(['numeroMatricule'])!.value,
      datePriseEnCompte: this.editForm.get(['datePriseEnCompte'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      etat: this.editForm.get(['etat'])!.value,
      pecId: this.editForm.get(['pecId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
