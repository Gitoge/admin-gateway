import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICorps, Corps } from '../corps.model';
import { CorpsService } from '../service/corps.service';

@Component({
  selector: 'jhi-corps-update',
  templateUrl: './corps-update.component.html',
})
export class CorpsUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('^[Z0-9]*$')]],
    libelle: [null, [Validators.required]],
    description: [],
    codHierarchie: [],
    ageRetraite: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(3), Validators.pattern('^[Z0-9]*$')]],
    classification: [],
  });

  constructor(protected corpsService: CorpsService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ corps }) => {
      this.updateForm(corps);
      if (corps.id !== undefined && corps.id !== null) {
        this.titre = 'Modifier ce Corps';
      } else {
        this.titre = 'Ajouter un Corps';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const corps = this.createFromForm();
    if (corps.id !== undefined) {
      this.subscribeToSaveResponse(this.corpsService.update(corps));
    } else {
      this.subscribeToSaveResponse(this.corpsService.create(corps));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICorps>>): void {
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

  protected updateForm(corps: ICorps): void {
    this.editForm.patchValue({
      id: corps.id,
      code: corps.code,
      libelle: corps.libelle,
      description: corps.description,
      codHierarchie: corps.codHierarchie,
      ageRetraite: corps.ageRetraite,
      classification: corps.classification,
    });
  }

  protected createFromForm(): ICorps {
    return {
      ...new Corps(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      codHierarchie: this.editForm.get(['codHierarchie'])!.value,
      ageRetraite: this.editForm.get(['ageRetraite'])!.value,
      classification: this.editForm.get(['classification'])!.value,
    };
  }
}
