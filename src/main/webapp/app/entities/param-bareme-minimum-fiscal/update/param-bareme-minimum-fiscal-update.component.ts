import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IParamBaremeMinimumFiscal, ParamBaremeMinimumFiscal } from '../param-bareme-minimum-fiscal.model';
import { ParamBaremeMinimumFiscalService } from '../service/param-bareme-minimum-fiscal.service';

@Component({
  selector: 'jhi-param-bareme-minimum-fiscal-update',
  templateUrl: './param-bareme-minimum-fiscal-update.component.html',
})
export class ParamBaremeMinimumFiscalUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    montantPlafond: [null, [Validators.required]],
    montantAPrelever: [null, [Validators.required]],
    dateImpact: [null, [Validators.required]],
    userIdInsert: [],
    userdateInsert: [],
  });

  constructor(
    protected paramBaremeMinimumFiscalService: ParamBaremeMinimumFiscalService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramBaremeMinimumFiscal }) => {
      this.updateForm(paramBaremeMinimumFiscal);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paramBaremeMinimumFiscal = this.createFromForm();
    if (paramBaremeMinimumFiscal.id !== undefined) {
      this.subscribeToSaveResponse(this.paramBaremeMinimumFiscalService.update(paramBaremeMinimumFiscal));
    } else {
      this.subscribeToSaveResponse(this.paramBaremeMinimumFiscalService.create(paramBaremeMinimumFiscal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParamBaremeMinimumFiscal>>): void {
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

  protected updateForm(paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal): void {
    this.editForm.patchValue({
      id: paramBaremeMinimumFiscal.id,
      code: paramBaremeMinimumFiscal.code,
      libelle: paramBaremeMinimumFiscal.libelle,
      montantPlafond: paramBaremeMinimumFiscal.montantPlafond,
      montantAPrelever: paramBaremeMinimumFiscal.montantAPrelever,
      dateImpact: paramBaremeMinimumFiscal.dateImpact,
      userIdInsert: paramBaremeMinimumFiscal.userIdInsert,
      userdateInsert: paramBaremeMinimumFiscal.userdateInsert,
    });
  }

  protected createFromForm(): IParamBaremeMinimumFiscal {
    return {
      ...new ParamBaremeMinimumFiscal(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      montantPlafond: this.editForm.get(['montantPlafond'])!.value,
      montantAPrelever: this.editForm.get(['montantAPrelever'])!.value,
      dateImpact: this.editForm.get(['dateImpact'])!.value,
      userIdInsert: this.editForm.get(['userIdInsert'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value,
    };
  }
}
