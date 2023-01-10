import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITypeActes, TypeActes } from '../type-actes.model';
import { TypeActesService } from '../service/type-actes.service';
import { ICategorieActes } from 'app/entities/categorie-actes/categorie-actes.model';
import { CategorieActesService } from 'app/entities/categorie-actes/service/categorie-actes.service';

@Component({
  selector: 'jhi-type-actes-update',
  templateUrl: './type-actes-update.component.html',
})
export class TypeActesUpdateComponent implements OnInit {
  isSaving = false;

  categorieActesSharedCollection: ICategorieActes[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
    userIdInsert: [],
    userdateInsert: [],
    categorieactes: [],
  });

  constructor(
    protected typeActesService: TypeActesService,
    protected categorieActesService: CategorieActesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeActes }) => {
      this.updateForm(typeActes);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeActes = this.createFromForm();
    if (typeActes.id !== undefined) {
      this.subscribeToSaveResponse(this.typeActesService.update(typeActes));
    } else {
      this.subscribeToSaveResponse(this.typeActesService.create(typeActes));
    }
  }

  trackCategorieActesById(_index: number, item: ICategorieActes): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeActes>>): void {
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

  protected updateForm(typeActes: ITypeActes): void {
    this.editForm.patchValue({
      id: typeActes.id,
      code: typeActes.code,
      libelle: typeActes.libelle,
      description: typeActes.description,
      userIdInsert: typeActes.userIdInsert,
      userdateInsert: typeActes.userdateInsert,
      categorieactes: typeActes.categorieactes,
    });

    this.categorieActesSharedCollection = this.categorieActesService.addCategorieActesToCollectionIfMissing(
      this.categorieActesSharedCollection,
      typeActes.categorieactes
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categorieActesService
      .query()
      .pipe(map((res: HttpResponse<ICategorieActes[]>) => res.body ?? []))
      .pipe(
        map((categorieActes: ICategorieActes[]) =>
          this.categorieActesService.addCategorieActesToCollectionIfMissing(categorieActes, this.editForm.get('categorieactes')!.value)
        )
      )
      .subscribe((categorieActes: ICategorieActes[]) => (this.categorieActesSharedCollection = categorieActes));
  }

  protected createFromForm(): ITypeActes {
    return {
      ...new TypeActes(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      userIdInsert: this.editForm.get(['userIdInsert'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value,
      categorieactes: this.editForm.get(['categorieactes'])!.value,
    };
  }
}
