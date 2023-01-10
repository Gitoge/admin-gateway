import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ITypeActes, TypeActes } from '../type-actes.model';
import { TypeActesService } from '../service/type-actes.service';
import { ICategorieActes } from 'app/entities/carriere/categorie-actes/categorie-actes.model';
import { CategorieActesService } from 'app/entities/carriere/categorie-actes/service/categorie-actes.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ITypeLocalite } from '../../../type-localite/type-localite.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-type-actes-update',
  templateUrl: './type-actes-update.component.html',
})
export class TypeActesUpdateComponent implements OnInit {
  isSaving = false;
  typeActe!: ITypeActes;

  titre!: string;

  userInsert: any;

  categorieActesSharedCollection: ICategorieActes[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    userInsertId: [],
    userdateInsert: [],
    categorieActes: [],
  });

  constructor(
    protected typeActesService: TypeActesService,
    protected categorieActesService: CategorieActesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private stateStorageService: StateStorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeActes }) => {
      if (typeActes.id === undefined) {
        const today = dayjs().startOf('day');
        typeActes.userdateInsert = today;
      }

      this.updateForm(typeActes);

      if (typeActes.id !== undefined && typeActes.id !== null) {
        this.titre = 'Modifier le Type Acte : ';
        // this.titre = 'Modifier le nom de cette application: ' [applications.nom];
      } else {
        this.titre = 'Ajouter un Type Acte';
      }

      this.loadRelationshipsOptions();
    });
    this.userInsert = this.stateStorageService.getDataUser().id;
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
      typeActes.userInsertId = this.userInsert;
      this.subscribeToSaveResponse(this.typeActesService.create(typeActes));
    }
  }

  trackCategorieActesById(_index: number, item: ICategorieActes): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeActes>>): void {
    result.subscribe(
      (res: HttpResponse<ITypeLocalite>) => this.onSaveSuccess(res.body),
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: err.error.message,
        });
        // console.error(err.error.message);
      }
    );
  }

  protected onSaveSuccess(typeActe: ITypeActes | null): void {
    if (typeActe !== null) {
      this.typeActe = typeActe;

      this.isSaving = false;

      if (this.typeActe.id !== undefined) {
        Swal.fire(
          `<h4 style="font-family: Helvetica; font-size:16px">Type acte <b>${typeActe?.libelle ?? ''}</b> enregistré avec succès</h4>`
        );
      }

      this.previousState();
    }
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
      userInsertId: typeActes.userInsertId,
      userdateInsert: typeActes.userdateInsert ? typeActes.userdateInsert.format(DATE_TIME_FORMAT) : null,
      categorieActes: typeActes.categorieActes,
    });

    this.categorieActesSharedCollection = this.categorieActesService.addCategorieActesToCollectionIfMissing(
      this.categorieActesSharedCollection,
      typeActes.categorieActes
    );
  }

  protected loadRelationshipsOptions(): void {
    this.categorieActesService
      .query()
      .pipe(map((res: HttpResponse<ICategorieActes[]>) => res.body ?? []))
      .pipe(
        map((categorieActes: ICategorieActes[]) =>
          this.categorieActesService.addCategorieActesToCollectionIfMissing(categorieActes, this.editForm.get('categorieActes')!.value)
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
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value
        ? dayjs(this.editForm.get(['userdateInsert'])!.value, DATE_TIME_FORMAT)
        : undefined,
      categorieActes: this.editForm.get(['categorieActes'])!.value,
    };
  }
}
