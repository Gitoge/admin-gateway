import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDiplomes, Diplomes } from '../diplomes.model';
import { DiplomesService } from '../service/diplomes.service';

@Component({
  selector: 'jhi-diplomes-update',
  templateUrl: './diplomes-update.component.html',
})
export class DiplomesUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    description: [],
    userIdInsert: [],
    userdateInsert: [],
  });

  constructor(protected diplomesService: DiplomesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ diplomes }) => {
      this.updateForm(diplomes);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const diplomes = this.createFromForm();
    if (diplomes.id !== undefined) {
      this.subscribeToSaveResponse(this.diplomesService.update(diplomes));
    } else {
      this.subscribeToSaveResponse(this.diplomesService.create(diplomes));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiplomes>>): void {
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

  protected updateForm(diplomes: IDiplomes): void {
    this.editForm.patchValue({
      id: diplomes.id,
      code: diplomes.code,
      libelle: diplomes.libelle,
      description: diplomes.description,
      userIdInsert: diplomes.userIdInsert,
      userdateInsert: diplomes.userdateInsert,
    });
  }

  protected createFromForm(): IDiplomes {
    return {
      ...new Diplomes(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      userIdInsert: this.editForm.get(['userIdInsert'])!.value,
      userdateInsert: this.editForm.get(['userdateInsert'])!.value,
    };
  }
}
