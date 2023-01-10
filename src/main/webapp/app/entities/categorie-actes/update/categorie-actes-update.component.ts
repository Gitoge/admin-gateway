import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICategorieActes, CategorieActes } from '../categorie-actes.model';
import { CategorieActesService } from '../service/categorie-actes.service';

@Component({
  selector: 'jhi-categorie-actes-update',
  templateUrl: './categorie-actes-update.component.html',
})
export class CategorieActesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
    userIdInsert: [],
    userdateInsert: [],
  });

  constructor(
    protected categorieActesService: CategorieActesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categorieActes }) => {
      this.updateForm(categorieActes);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const categorieActes = this.createFromForm();
    if (categorieActes.id !== undefined) {
      this.subscribeToSaveResponse(this.categorieActesService.update(categorieActes));
    } else {
      this.subscribeToSaveResponse(this.categorieActesService.create(categorieActes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategorieActes>>): void {
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

  protected updateForm(categorieActes: ICategorieActes): void {
    this.editForm.patchValue({
      id: categorieActes.id,
      code: categorieActes.code,
      libelle: categorieActes.libelle,
      description: categorieActes.description,
      userIdInsert: categorieActes.userIdInsert,
      userdateInsert: categorieActes.userdateInsert,
    });
  }

  protected createFromForm(): ICategorieActes {
    return {
      ...new CategorieActes(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      userIdInsert: this.editForm.get(['userIdInsert'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value,
    };
  }
}
