import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypeReglement, TypeReglement } from '../type-reglement.model';
import { TypeReglementService } from '../service/type-reglement.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-type-reglement-update',
  templateUrl: './type-reglement-update.component.html',
})
export class TypeReglementUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    libelle: [null, [Validators.required]],
    description: [],
  });

  typeReglement!: ITypeReglement;
  titre!: string;
  constructor(protected typeReglementService: TypeReglementService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeReglement }) => {
      if (typeReglement.id !== undefined && typeReglement.id !== null) {
        this.titre = 'Modifier ce type de réglement';
      } else {
        this.titre = 'Ajouter un type de réglement';
      }
      this.updateForm(typeReglement);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeReglement = this.createFromForm();
    if (typeReglement.id !== undefined) {
      this.subscribeToSaveResponse(this.typeReglementService.update(typeReglement));
    } else {
      this.subscribeToSaveResponse(this.typeReglementService.create(typeReglement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeReglement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res: any) => this.onSaveSuccess(res.body),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(typeReglement: ITypeReglement): void {
    if (typeReglement !== null) {
      this.typeReglement = typeReglement;

      this.isSaving = false;

      if (this.typeReglement.id !== undefined) {
        Swal.fire({
          icon: 'success',
          title: 'Réussi ',
          text: `Type Réglement ${typeReglement?.libelle ?? ''} enregistré avec succès`,
        });
      }

      this.previousState();
    }
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(typeReglement: ITypeReglement): void {
    this.editForm.patchValue({
      id: typeReglement.id,
      code: typeReglement.code,
      libelle: typeReglement.libelle,
      description: typeReglement.description,
    });
  }

  protected createFromForm(): ITypeReglement {
    return {
      ...new TypeReglement(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
