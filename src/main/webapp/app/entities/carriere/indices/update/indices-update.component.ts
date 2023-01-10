import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IIndices, Indices } from '../indices.model';
import { IndicesService } from '../service/indices.service';
import { ITypeLocalite } from '../../../type-localite/type-localite.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-indices-update',
  templateUrl: './indices-update.component.html',
})
export class IndicesUpdateComponent implements OnInit {
  isSaving = false;
  titre?: string;

  indice!: IIndices;

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [],
    soldeIndiciaire: [],
    mntSFTenf02: [],
    mntSFTenf01: [],
  });

  constructor(protected indicesService: IndicesService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ indices }) => {
      this.updateForm(indices);
      this.indice = indices;
      if (indices.id !== undefined) {
        this.titre = "Modification de l'indice";
      } else {
        this.titre = 'Ajouter indice';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const indices = this.createFromForm();
    if (indices.id !== undefined) {
      this.subscribeToSaveResponse(this.indicesService.update(indices));
    } else {
      this.subscribeToSaveResponse(this.indicesService.create(indices));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IIndices>>): void {
    result.subscribe(
      (res: any) => this.onSaveSuccess(res.body),
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: err.error.message,
        });
        // console.error(err.error.message);
      }
    );
  }

  protected onSaveSuccess(indice: IIndices): void {
    if (indice !== null) {
      this.indice = indice;

      this.isSaving = false;

      if (this.indice.id !== undefined) {
        Swal.fire({
          icon: 'success',
          title: 'Réussi ',
          text: `Type Réglement ${indice?.libelle ?? ''} enregistré avec succès`,
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

  protected updateForm(indices: IIndices): void {
    this.editForm.patchValue({
      id: indices.id,
      code: indices.code,
      libelle: indices.libelle,
      soldeIndiciaire: indices.soldeIndiciaire,
    });
  }

  protected createFromForm(): IIndices {
    return {
      ...new Indices(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      soldeIndiciaire: this.editForm.get(['soldeIndiciaire'])!.value,
    };
  }
}
