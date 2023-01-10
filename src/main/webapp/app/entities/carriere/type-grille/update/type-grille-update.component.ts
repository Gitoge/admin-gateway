import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypeGrille, TypeGrille } from '../type-grille.model';
import { TypeGrilleService } from '../service/type-grille.service';

@Component({
  selector: 'jhi-type-grille-update',
  templateUrl: './type-grille-update.component.html',
})
export class TypeGrilleUpdateComponent implements OnInit {
  isSaving = false;
  titre?: string;

  editForm = this.fb.group({
    id: [],
    code: [],
    libelle: [],
    description: [],
  });

  constructor(protected typeGrilleService: TypeGrilleService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeGrille }) => {
      this.updateForm(typeGrille);
      if (typeGrille?.id !== undefined && typeGrille?.id !== null) {
        this.titre = 'Modifier ce type grille';
      } else {
        this.titre = 'Ajouter type grille';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeGrille = this.createFromForm();
    if (typeGrille.id !== undefined) {
      this.subscribeToSaveResponse(this.typeGrilleService.update(typeGrille));
    } else {
      this.subscribeToSaveResponse(this.typeGrilleService.create(typeGrille));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeGrille>>): void {
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

  protected updateForm(typeGrille: ITypeGrille): void {
    this.editForm.patchValue({
      id: typeGrille.id,
      code: typeGrille.code,
      libelle: typeGrille.libelle,
      description: typeGrille.description,
    });
  }

  protected createFromForm(): ITypeGrille {
    return {
      ...new TypeGrille(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
