import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IParamPartsFiscales, ParamPartsFiscales } from '../param-parts-fiscales.model';
import { ParamPartsFiscalesService } from '../service/param-parts-fiscales.service';

@Component({
  selector: 'jhi-param-parts-fiscales-update',
  templateUrl: './param-parts-fiscales-update.component.html',
})
export class ParamPartsFiscalesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [],
    composition: [],
    nombreParts: [null, [Validators.required]],
    description: [],
    userIdInsert: [],
    userdateInsert: [],
  });

  constructor(
    protected paramPartsFiscalesService: ParamPartsFiscalesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramPartsFiscales }) => {
      this.updateForm(paramPartsFiscales);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paramPartsFiscales = this.createFromForm();
    if (paramPartsFiscales.id !== undefined) {
      this.subscribeToSaveResponse(this.paramPartsFiscalesService.update(paramPartsFiscales));
    } else {
      this.subscribeToSaveResponse(this.paramPartsFiscalesService.create(paramPartsFiscales));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParamPartsFiscales>>): void {
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

  protected updateForm(paramPartsFiscales: IParamPartsFiscales): void {
    this.editForm.patchValue({
      id: paramPartsFiscales.id,
      code: paramPartsFiscales.code,
      libelle: paramPartsFiscales.libelle,
      composition: paramPartsFiscales.composition,
      nombreParts: paramPartsFiscales.nombreParts,
      description: paramPartsFiscales.description,
      userIdInsert: paramPartsFiscales.userIdInsert,
      userdateInsert: paramPartsFiscales.userdateInsert,
    });
  }

  protected createFromForm(): IParamPartsFiscales {
    return {
      ...new ParamPartsFiscales(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      composition: this.editForm.get(['composition'])!.value,
      nombreParts: this.editForm.get(['nombreParts'])!.value,
      description: this.editForm.get(['description'])!.value,
      userIdInsert: this.editForm.get(['userIdInsert'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value,
    };
  }
}
