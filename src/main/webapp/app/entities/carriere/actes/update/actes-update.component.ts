import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IActes, Actes } from '../actes.model';
import { ActesService } from '../service/actes.service';
import { INatureActes } from 'app/entities/carriere/nature-actes/nature-actes.model';
import { NatureActesService } from 'app/entities/carriere/nature-actes/service/nature-actes.service';
import { ITypeActes } from 'app/entities/carriere/type-actes/type-actes.model';
import { TypeActesService } from 'app/entities/carriere/type-actes/service/type-actes.service';
import dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { StateStorageService } from 'app/core/auth/state-storage.service';

@Component({
  selector: 'jhi-actes-update',
  templateUrl: './actes-update.component.html',
})
export class ActesUpdateComponent implements OnInit {
  isSaving = false;

  titre: any;

  userInsert: any;

  natureActesSharedCollection: INatureActes[] = [];
  typeActesSharedCollection: ITypeActes[] = [];

  editForm = this.fb.group({
    id: [],
    numeroActe: [null, [Validators.required]],
    dateActe: [],
    dateEffet: [],
    origineId: [],
    userInsertId: [],
    natureActes: [],
    typeActes: [],
  });

  constructor(
    protected actesService: ActesService,
    protected natureActesService: NatureActesService,
    protected typeActesService: TypeActesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private stateStorageService: StateStorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actes }) => {
      if (actes.id === undefined) {
        const today = dayjs().startOf('day');
        actes.dateActe = today;
      }

      this.updateForm(actes);
      if (actes.id !== undefined && actes.id !== null) {
        this.titre = 'Modifier cet Acte ';
      } else {
        this.titre = 'Ajouter un Acte';
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
    const actes = this.createFromForm();
    if (actes.id !== undefined) {
      this.subscribeToSaveResponse(this.actesService.update(actes));
    } else {
      actes.userInsertId = this.userInsert;
      this.subscribeToSaveResponse(this.actesService.create(actes));
    }
  }

  trackNatureActesById(_index: number, item: INatureActes): number {
    return item.id!;
  }

  trackTypeActesById(_index: number, item: ITypeActes): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActes>>): void {
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

  protected updateForm(actes: IActes): void {
    this.editForm.patchValue({
      id: actes.id,
      numeroActe: actes.numeroActe,
      dateActe: actes.dateActe,
      dateEffet: actes.dateEffet ? actes.dateEffet.format(DATE_TIME_FORMAT) : null,
      origineId: actes.origineId,
      userInsertId: actes.userInsertId,
      natureActes: actes.natureActes,
      typeActes: actes.typeActes,
    });

    this.natureActesSharedCollection = this.natureActesService.addNatureActesToCollectionIfMissing(
      this.natureActesSharedCollection,
      actes.natureActes
    );
    this.typeActesSharedCollection = this.typeActesService.addTypeActesToCollectionIfMissing(
      this.typeActesSharedCollection,
      actes.typeActes
    );
  }

  protected loadRelationshipsOptions(): void {
    this.natureActesService
      .query()
      .pipe(map((res: HttpResponse<INatureActes[]>) => res.body ?? []))
      .pipe(
        map((natureActes: INatureActes[]) =>
          this.natureActesService.addNatureActesToCollectionIfMissing(natureActes, this.editForm.get('natureActes')!.value)
        )
      )
      .subscribe((natureActes: INatureActes[]) => (this.natureActesSharedCollection = natureActes));

    this.typeActesService
      .query()
      .pipe(map((res: HttpResponse<ITypeActes[]>) => res.body ?? []))
      .pipe(
        map((typeActes: ITypeActes[]) =>
          this.typeActesService.addTypeActesToCollectionIfMissing(typeActes, this.editForm.get('typeActes')!.value)
        )
      )
      .subscribe((typeActes: ITypeActes[]) => (this.typeActesSharedCollection = typeActes));
  }

  protected createFromForm(): IActes {
    return {
      ...new Actes(),
      id: this.editForm.get(['id'])!.value,
      numeroActe: this.editForm.get(['numeroActe'])!.value,
      dateActe: this.editForm.get(['dateActe'])!.value,
      dateEffet: this.editForm.get(['dateEffet'])!.value,
      origineId: this.editForm.get(['origineId'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      natureActes: this.editForm.get(['natureActes'])!.value,
      typeActes: this.editForm.get(['typeActes'])!.value,
    };
  }
}
