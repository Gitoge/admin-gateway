import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICategorie, Categorie } from '../categorie.model';
import { CategorieService } from '../service/categorie.service';

@Component({
  selector: 'jhi-categorie-update',
  templateUrl: './categorie-update.component.html',
})
export class CategorieUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
    libelle: [null, [Validators.required]],
    description: [],
  });

  constructor(protected categorieService: CategorieService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categorie }) => {
      this.updateForm(categorie);
      if (categorie.id !== undefined && categorie.id !== null) {
        this.titre = 'Modifier cette Categorie';
      } else {
        this.titre = 'Ajouter une Categorie';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const categorie = this.createFromForm();
    if (categorie.id !== undefined) {
      this.subscribeToSaveResponse(this.categorieService.update(categorie));
    } else {
      this.subscribeToSaveResponse(this.categorieService.create(categorie));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICategorie>>): void {
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

  protected updateForm(categorie: ICategorie): void {
    this.editForm.patchValue({
      id: categorie.id,
      code: categorie.code,
      libelle: categorie.libelle,
      description: categorie.description,
    });
  }

  protected createFromForm(): ICategorie {
    return {
      ...new Categorie(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
