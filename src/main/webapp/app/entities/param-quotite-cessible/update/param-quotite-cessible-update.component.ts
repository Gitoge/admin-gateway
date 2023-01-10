import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IParamQuotiteCessible, ParamQuotiteCessible } from '../param-quotite-cessible.model';
import { ParamQuotiteCessibleService } from '../service/param-quotite-cessible.service';

@Component({
  selector: 'jhi-param-quotite-cessible-update',
  templateUrl: './param-quotite-cessible-update.component.html',
})
export class ParamQuotiteCessibleUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    salaireDebut: [null, [Validators.required]],
    salaireFin: [null, [Validators.required]],
    tauxTranche: [null, [Validators.required]],
    dateImpact: [null, [Validators.required]],
    userIdInsert: [],
    userdateInsert: [],
  });

  constructor(
    protected paramQuotiteCessibleService: ParamQuotiteCessibleService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ paramQuotiteCessible }) => {
      if (paramQuotiteCessible.id !== undefined) {
        this.titre = 'Modifier Quotité';
      } else {
        this.titre = 'Ajouter Quotité';
      }
      this.updateForm(paramQuotiteCessible);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const paramQuotiteCessible = this.createFromForm();
    if (paramQuotiteCessible.id !== undefined) {
      this.subscribeToSaveResponse(this.paramQuotiteCessibleService.update(paramQuotiteCessible));
    } else {
      this.subscribeToSaveResponse(this.paramQuotiteCessibleService.create(paramQuotiteCessible));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParamQuotiteCessible>>): void {
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

  protected updateForm(paramQuotiteCessible: IParamQuotiteCessible): void {
    this.editForm.patchValue({
      id: paramQuotiteCessible.id,
      code: paramQuotiteCessible.code,
      libelle: paramQuotiteCessible.libelle,
      salaireDebut: paramQuotiteCessible.salaireDebut,
      salaireFin: paramQuotiteCessible.salaireFin,
      tauxTranche: paramQuotiteCessible.tauxTranche,
      dateImpact: paramQuotiteCessible.dateImpact,
      userIdInsert: paramQuotiteCessible.userIdInsert,
      userdateInsert: paramQuotiteCessible.userdateInsert,
    });
  }

  protected createFromForm(): IParamQuotiteCessible {
    return {
      ...new ParamQuotiteCessible(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      salaireDebut: this.editForm.get(['salaireDebut'])!.value,
      salaireFin: this.editForm.get(['salaireFin'])!.value,
      tauxTranche: this.editForm.get(['tauxTranche'])!.value,
      dateImpact: this.editForm.get(['dateImpact'])!.value,
      userIdInsert: this.editForm.get(['userIdInsert'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value,
    };
  }
}
