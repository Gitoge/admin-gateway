import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IConvention, Convention } from '../convention.model';
import { ConventionService } from '../service/convention.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';

@Component({
  selector: 'jhi-convention-update',
  templateUrl: './convention-update.component.html',
})
export class ConventionUpdateComponent implements OnInit {
  isSaving = false;

  titre: any;

  userInsert: any;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
  });

  constructor(
    protected conventionService: ConventionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private stateStorageService: StateStorageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ convention }) => {
      if (convention.id === undefined) {
        const today = dayjs().startOf('day');
        convention.dateInsert = today;
        convention.dateUpdate = today;
      }

      if (convention.id !== undefined && convention.id !== null) {
        this.titre = 'Modifier cette Convention ';
      } else {
        this.titre = 'Ajouter une Convention';
      }
      this.updateForm(convention);
    });
    this.userInsert = this.stateStorageService.getPersonne().id;
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const convention = this.createFromForm();

    if (convention.id !== undefined) {
      convention.userUpdateId = this.userInsert;
      this.subscribeToSaveResponse(this.conventionService.update(convention));
    } else {
      convention.userInsertId = this.userInsert;
      this.subscribeToSaveResponse(this.conventionService.create(convention));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConvention>>): void {
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

  protected updateForm(convention: IConvention): void {
    this.editForm.patchValue({
      id: convention.id,
      code: convention.code,
      libelle: convention.libelle,
      description: convention.description,
      userInsertId: convention.userInsertId,
      userUpdateId: convention.userUpdateId,
      dateInsert: convention.dateInsert ? convention.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: convention.dateUpdate ? convention.dateUpdate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IConvention {
    return {
      ...new Convention(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
