import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { INatureActes, NatureActes } from '../nature-actes.model';
import { NatureActesService } from '../service/nature-actes.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { ParamMatriculesService } from '../../param-matricules/service/param-matricules.service';
import { IParamMatricules, ParamMatricules } from '../../param-matricules/param-matricules.model';

@Component({
  selector: 'jhi-nature-actes-update',
  templateUrl: './nature-actes-update.component.html',
})
export class NatureActesUpdateComponent implements OnInit {
  isSaving = false;
  userInsert: any;
  natureActes: any;

  titre!: any;
  matricule = '';
  matriculeA: any;
  result: any;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    libelle: [null, [Validators.required]],
    userInsertId: [],
    userdateInsert: [],
  });

  constructor(
    protected natureActesService: NatureActesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private stateStorageService: StateStorageService,
    protected paramMatriculesService: ParamMatriculesService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ natureActes }) => {
      if (natureActes.id === undefined) {
        const today = dayjs().startOf('day');
        natureActes.userdateInsert = today;
      }

      this.updateForm(natureActes);
      if (natureActes.id !== undefined && natureActes.id !== null) {
        this.titre = 'Modifier le nom de ce nature Acte ';
        //this.titre = 'Modifier le nom de cette application: ' [applications.nom];
      } else {
        this.titre = 'Ajouter un nature Acte';
      }
    });
    this.userInsert = this.stateStorageService.getDataUser().id;
  }
  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    this.natureActes = this.createFromForm();
    if (this.natureActes.id !== undefined) {
      this.subscribeToSaveResponse(this.natureActesService.update(this.natureActes));
    } else {
      this.natureActes.userInsertId = this.userInsert;
      this.subscribeToSaveResponse(this.natureActesService.create(this.natureActes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<INatureActes>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }
  protected subscribeToSaveResponse1(result: Observable<HttpResponse<IParamMatricules>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess1(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess1(): void {
    this.router.navigate(['/nature-actes/new']);
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
      userInsertId: natureActes.userInsertId,
      userdateInsert: natureActes.userdateInsert ? natureActes.userdateInsert.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): INatureActes {
    return {
      ...new NatureActes(),
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
