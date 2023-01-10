import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypePosition, TypePosition } from '../type-position.model';
import { TypePositionService } from '../service/type-position.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-type-position-update',
  templateUrl: './type-position-update.component.html',
})
export class TypePositionUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
    userIdInsert: [],
    userdateInsert: [],
  });

  constructor(
    protected typePositionService: TypePositionService,
    private stateStorageService: StateStorageService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typePosition }) => {
      this.updateForm(typePosition);
      if (typePosition.id !== undefined && typePosition.id !== null) {
        this.titre = 'Modifier un type de position: ';
      } else {
        this.titre = 'Ajouter un type de position';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typePosition = this.createFromForm();
    if (typePosition.id !== undefined) {
      this.subscribeToSaveResponse(this.typePositionService.update(typePosition));
    } else {
      this.subscribeToSaveResponse(this.typePositionService.create(typePosition));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypePosition>>): void {
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

  protected updateForm(typePosition: ITypePosition): void {
    this.editForm.patchValue({
      id: typePosition.id,
      code: typePosition.code,
      libelle: typePosition.libelle,
      description: typePosition.description,
      userIdInsert: typePosition.userIdInsert,
      userdateInsert: typePosition.userdateInsert,
    });
  }

  protected createFromForm(): ITypePosition {
    return {
      ...new TypePosition(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      userIdInsert: this.stateStorageService.getPersonne().jhiUserId,
      userdateInsert: dayjs(),
    };
  }
}
