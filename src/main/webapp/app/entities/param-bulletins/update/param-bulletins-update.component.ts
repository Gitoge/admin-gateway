import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IParamBulletins, ParamBulletins } from '../param-bulletins.model';
import { ParamBulletinsService } from '../service/param-bulletins.service';

@Component({
  selector: 'jhi-param-bulletins-update',
  templateUrl: './param-bulletins-update.component.html',
})
export class ParamBulletinsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    entete: [],
    signature: [],
    arrierePlan: [],
    userIdInsert: [],
    userdateInsert: [],
  });

  constructor(
    protected paramBulletinsService: ParamBulletinsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramBulletins }) => {
      this.updateForm(paramBulletins);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paramBulletins = this.createFromForm();
    if (paramBulletins.id !== undefined) {
      this.subscribeToSaveResponse(this.paramBulletinsService.update(paramBulletins));
    } else {
      this.subscribeToSaveResponse(this.paramBulletinsService.create(paramBulletins));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParamBulletins>>): void {
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

  protected updateForm(paramBulletins: IParamBulletins): void {
    this.editForm.patchValue({
      id: paramBulletins.id,
      code: paramBulletins.code,
      libelle: paramBulletins.libelle,
      entete: paramBulletins.entete,
      signature: paramBulletins.signature,
      arrierePlan: paramBulletins.arrierePlan,
      userIdInsert: paramBulletins.userIdInsert,
      userdateInsert: paramBulletins.userdateInsert,
    });
  }

  protected createFromForm(): IParamBulletins {
    return {
      ...new ParamBulletins(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      entete: this.editForm.get(['entete'])!.value,
      signature: this.editForm.get(['signature'])!.value,
      arrierePlan: this.editForm.get(['arrierePlan'])!.value,
      userIdInsert: this.editForm.get(['userIdInsert'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value,
    };
  }
}
