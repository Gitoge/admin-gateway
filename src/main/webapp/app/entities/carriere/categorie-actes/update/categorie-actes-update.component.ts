import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ICategorieActes, CategorieActes } from '../categorie-actes.model';
import { CategorieActesService } from '../service/categorie-actes.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';

@Component({
  selector: 'jhi-categorie-actes-update',
  templateUrl: './categorie-actes-update.component.html',
})
export class CategorieActesUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  userInsert: any;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
    libelle: [null, [Validators.required]],
    userInsertId: [],
    userdateInsert: [],
  });

  constructor(
    protected categorieActesService: CategorieActesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private stateStorageService: StateStorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ categorieActes }) => {
      if (categorieActes.id === undefined) {
        const today = dayjs().startOf('day');
        categorieActes.userdateInsert = today;
      }

      this.updateForm(categorieActes);
      if (categorieActes.id !== undefined && categorieActes.id !== null) {
        this.titre = "Modifier cette catégorie d'actes: ";
        //this.titre = 'Modifier le nom de cette application: ' [applications.nom];
      } else {
        this.titre = "Ajouter une catégorie d'actes";
      }
    });
    this.userInsert = this.stateStorageService.getDataUser().id;
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
      categorieActes.userInsertId = this.userInsert;
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
      userInsertId: categorieActes.userInsertId,
      userdateInsert: categorieActes.userdateInsert ? categorieActes.userdateInsert.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): ICategorieActes {
    return {
      ...new CategorieActes(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value
        ? dayjs(this.editForm.get(['userdateInsert'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
