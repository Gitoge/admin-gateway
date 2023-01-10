import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITypeDestinataires, TypeDestinataires } from '../type-destinataires.model';
import { TypeDestinatairesService } from '../service/type-destinataires.service';

@Component({
  selector: 'jhi-type-destinataires-update',
  templateUrl: './type-destinataires-update.component.html',
})
export class TypeDestinatairesUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;
  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
    libelle: [null, [Validators.required]],
    description: [],
  });

  constructor(
    protected typeDestinatairesService: TypeDestinatairesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ typeDestinataires }) => {
      this.updateForm(typeDestinataires);
      if (typeDestinataires.id !== undefined && typeDestinataires.id !== null) {
        this.titre = 'Modifier ce Type destinataire';
      } else {
        this.titre = 'Ajouter un Type Destinataire';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const typeDestinataires = this.createFromForm();
    if (typeDestinataires.id !== undefined) {
      this.subscribeToSaveResponse(this.typeDestinatairesService.update(typeDestinataires));
    } else {
      this.subscribeToSaveResponse(this.typeDestinatairesService.create(typeDestinataires));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITypeDestinataires>>): void {
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

  protected updateForm(typeDestinataires: ITypeDestinataires): void {
    this.editForm.patchValue({
      id: typeDestinataires.id,
      code: typeDestinataires.code,
      libelle: typeDestinataires.libelle,
      description: typeDestinataires.description,
    });
  }

  protected createFromForm(): ITypeDestinataires {
    return {
      ...new TypeDestinataires(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }
}
