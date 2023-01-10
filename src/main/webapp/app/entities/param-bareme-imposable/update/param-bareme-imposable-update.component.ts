import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IParamBaremeImposable, ParamBaremeImposable } from '../param-bareme-imposable.model';
import { ParamBaremeImposableService } from '../service/param-bareme-imposable.service';

@Component({
  selector: 'jhi-param-bareme-imposable-update',
  templateUrl: './param-bareme-imposable-update.component.html',
})
export class ParamBaremeImposableUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    salaireDebut: [null, [Validators.required]],
    salaireFin: [null, [Validators.required]],
    tauxTranche: [],
    tauxCumule: [],
    montant: [],
    dateImpact: [null, [Validators.required]],
    userIdInsert: [],
    userdateInsert: [],
  });

  constructor(
    protected paramBaremeImposableService: ParamBaremeImposableService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramBaremeImposable }) => {
      this.updateForm(paramBaremeImposable);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paramBaremeImposable = this.createFromForm();
    if (paramBaremeImposable.id !== undefined) {
      this.subscribeToSaveResponse(this.paramBaremeImposableService.update(paramBaremeImposable));
    } else {
      this.subscribeToSaveResponse(this.paramBaremeImposableService.create(paramBaremeImposable));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParamBaremeImposable>>): void {
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

  protected updateForm(paramBaremeImposable: IParamBaremeImposable): void {
    this.editForm.patchValue({
      id: paramBaremeImposable.id,
      code: paramBaremeImposable.code,
      libelle: paramBaremeImposable.libelle,
      salaireDebut: paramBaremeImposable.salaireDebut,
      salaireFin: paramBaremeImposable.salaireFin,
      tauxTranche: paramBaremeImposable.tauxTranche,
      tauxCumule: paramBaremeImposable.tauxCumule,
      montant: paramBaremeImposable.montant,
      dateImpact: paramBaremeImposable.dateImpact,
      userIdInsert: paramBaremeImposable.userIdInsert,
      userdateInsert: paramBaremeImposable.userdateInsert,
    });
  }

  protected createFromForm(): IParamBaremeImposable {
    return {
      ...new ParamBaremeImposable(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      salaireDebut: this.editForm.get(['salaireDebut'])!.value,
      salaireFin: this.editForm.get(['salaireFin'])!.value,
      tauxTranche: this.editForm.get(['tauxTranche'])!.value,
      tauxCumule: this.editForm.get(['tauxCumule'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      dateImpact: this.editForm.get(['dateImpact'])!.value,
      userIdInsert: this.editForm.get(['userIdInsert'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value,
    };
  }
}
