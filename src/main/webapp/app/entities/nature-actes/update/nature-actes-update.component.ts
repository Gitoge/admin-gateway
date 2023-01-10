import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { INatureActes, NatureActes } from '../nature-actes.model';
import { NatureActesService } from '../service/nature-actes.service';

@Component({
  selector: 'jhi-nature-actes-update',
  templateUrl: './nature-actes-update.component.html',
})
export class NatureActesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
    userIdInsert: [],
    userdateInsert: [],
  });

  constructor(protected natureActesService: NatureActesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ natureActes }) => {
      this.updateForm(natureActes);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const natureActes = this.createFromForm();
    if (natureActes.id !== undefined) {
      this.subscribeToSaveResponse(this.natureActesService.update(natureActes));
    } else {
      this.subscribeToSaveResponse(this.natureActesService.create(natureActes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INatureActes>>): void {
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

  protected updateForm(natureActes: INatureActes): void {
    this.editForm.patchValue({
      id: natureActes.id,
      code: natureActes.code,
      libelle: natureActes.libelle,
      description: natureActes.description,
      userIdInsert: natureActes.userIdInsert,
      userdateInsert: natureActes.userdateInsert,
    });
  }

  protected createFromForm(): INatureActes {
    return {
      ...new NatureActes(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      userIdInsert: this.editForm.get(['userIdInsert'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value,
    };
  }
}
