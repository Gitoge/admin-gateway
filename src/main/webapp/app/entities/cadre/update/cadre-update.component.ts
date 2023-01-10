import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ICadre, Cadre } from '../cadre.model';
import { CadreService } from '../service/cadre.service';

@Component({
  selector: 'jhi-cadre-update',
  templateUrl: './cadre-update.component.html',
})
export class CadreUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
    libelle: [null, [Validators.required]],
    description: [],
    typeSalaire: [],
  });

  constructor(protected cadreService: CadreService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cadre }) => {
      this.updateForm(cadre);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cadre = this.createFromForm();
    if (cadre.id !== undefined) {
      this.subscribeToSaveResponse(this.cadreService.update(cadre));
    } else {
      this.subscribeToSaveResponse(this.cadreService.create(cadre));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICadre>>): void {
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

  protected updateForm(cadre: ICadre): void {
    this.editForm.patchValue({
      id: cadre.id,
      code: cadre.code,
      libelle: cadre.libelle,
      description: cadre.description,
      typeSalaire: cadre.typeSalaire,
    });
  }

  protected createFromForm(): ICadre {
    return {
      ...new Cadre(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      typeSalaire: this.editForm.get(['typeSalaire'])!.value,
    };
  }
}
