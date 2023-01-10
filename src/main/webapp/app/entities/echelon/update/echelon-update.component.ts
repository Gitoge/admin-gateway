import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEchelon, Echelon } from '../echelon.model';
import { EchelonService } from '../service/echelon.service';

@Component({
  selector: 'jhi-echelon-update',
  templateUrl: './echelon-update.component.html',
})
export class EchelonUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
    libelle: [null, [Validators.required]],
    description: [],
  });

  constructor(protected echelonService: EchelonService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ echelon }) => {
      this.updateForm(echelon);
      if (echelon.id !== undefined && echelon.id !== null) {
        this.titre = 'Modifier cet Echelon';
      } else {
        this.titre = 'Ajouter un Echelon';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const echelon = this.createFromForm();
    if (echelon.id !== undefined) {
      this.subscribeToSaveResponse(this.echelonService.update(echelon));
    } else {
      this.subscribeToSaveResponse(this.echelonService.create(echelon));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEchelon>>): void {
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

  protected updateForm(echelon: IEchelon): void {
    this.editForm.patchValue({
      id: echelon.id,
      code: echelon.code,
      libelle: echelon.libelle,
      description: echelon.description,
    });
  }

  protected createFromForm(): IEchelon {
    return {
      ...new Echelon(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
