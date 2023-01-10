import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPostes, Postes } from '../postes.model';
import { PostesService } from '../service/postes.service';

@Component({
  selector: 'jhi-postes-update',
  templateUrl: './postes-update.component.html',
})
export class PostesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    libelle: [null, [Validators.required]],
    description: [],
    sens: [null, [Validators.required]],
    dateEffet: [],
    dateEcheance: [],
    formule: [],
    dansAssiette: [null, [Validators.required]],
    montant: [],
    capital: [],
    cumuleRetenue: [],
    typePosteId: [null, [Validators.required]],
    typePosteLibelle: [null, [Validators.required]],
    frequenceId: [null, [Validators.required]],
    frequenceLibelle: [null, [Validators.required]],
    categoriePosteId: [null, [Validators.required]],
    categoriePosteLibelle: [null, [Validators.required]],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
  });

  constructor(protected postesService: PostesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ postes }) => {
      if (postes.id === undefined) {
        const today = dayjs().startOf('day');
        postes.dateInsert = today;
        postes.dateUpdate = today;
      }

      this.updateForm(postes);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const postes = this.createFromForm();
    if (postes.id !== undefined) {
      this.subscribeToSaveResponse(this.postesService.update(postes));
    } else {
      this.subscribeToSaveResponse(this.postesService.create(postes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPostes>>): void {
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

  protected updateForm(postes: IPostes): void {
    this.editForm.patchValue({
      id: postes.id,
      code: postes.code,
      libelle: postes.libelle,
      description: postes.description,
      sens: postes.sens,
      dateEffet: postes.dateEffet,
      dateEcheance: postes.dateEcheance,
      formule: postes.formule,
      dansAssiette: postes.dansAssiette,
      montant: postes.montant,
      capital: postes.capital,
      cumuleRetenue: postes.cumuleRetenue,
      typePosteId: postes.typePosteId,
      typePosteLibelle: postes.typePosteLibelle,
      frequenceId: postes.frequenceId,
      frequenceLibelle: postes.frequenceLibelle,
      categoriePosteId: postes.categoriePosteId,
      categoriePosteLibelle: postes.categoriePosteLibelle,
      userInsertId: postes.userInsertId,
      userUpdateId: postes.userUpdateId,
      dateInsert: postes.dateInsert ? postes.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: postes.dateUpdate ? postes.dateUpdate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IPostes {
    return {
      ...new Postes(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      sens: this.editForm.get(['sens'])!.value,
      dateEffet: this.editForm.get(['dateEffet'])!.value,
      dateEcheance: this.editForm.get(['dateEcheance'])!.value,
      formule: this.editForm.get(['formule'])!.value,
      dansAssiette: this.editForm.get(['dansAssiette'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      capital: this.editForm.get(['capital'])!.value,
      cumuleRetenue: this.editForm.get(['cumuleRetenue'])!.value,
      typePosteId: this.editForm.get(['typePosteId'])!.value,
      typePosteLibelle: this.editForm.get(['typePosteLibelle'])!.value,
      frequenceId: this.editForm.get(['frequenceId'])!.value,
      frequenceLibelle: this.editForm.get(['frequenceLibelle'])!.value,
      categoriePosteId: this.editForm.get(['categoriePosteId'])!.value,
      categoriePosteLibelle: this.editForm.get(['categoriePosteLibelle'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
