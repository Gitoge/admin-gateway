import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IConventionEtablissements, ConventionEtablissements } from '../convention-etablissements.model';
import { ConventionEtablissementsService } from '../service/convention-etablissements.service';

@Component({
  selector: 'jhi-convention-etablissements-update',
  templateUrl: './convention-etablissements-update.component.html',
})
export class ConventionEtablissementsUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    etablissementId: [],
    conventionId: [],
  });

  constructor(
    protected conventionEtablissementsService: ConventionEtablissementsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conventionEtablissements }) => {
      this.updateForm(conventionEtablissements);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const conventionEtablissements = this.createFromForm();
    if (conventionEtablissements.id !== undefined) {
      this.subscribeToSaveResponse(this.conventionEtablissementsService.update(conventionEtablissements));
    } else {
      this.subscribeToSaveResponse(this.conventionEtablissementsService.create(conventionEtablissements));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConventionEtablissements>>): void {
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

  protected updateForm(conventionEtablissements: IConventionEtablissements): void {
    this.editForm.patchValue({
      id: conventionEtablissements.id,
      etablissementId: conventionEtablissements.etablissementId,
      conventionId: conventionEtablissements.conventionId,
    });
  }

  protected createFromForm(): IConventionEtablissements {
    return {
      ...new ConventionEtablissements(),
      id: this.editForm.get(['id'])!.value,
      etablissementId: this.editForm.get(['etablissementId'])!.value,
      conventionId: this.editForm.get(['conventionId'])!.value,
    };
  }
}
