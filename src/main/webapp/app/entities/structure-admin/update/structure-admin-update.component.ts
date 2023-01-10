import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IStructureAdmin, StructureAdmin } from '../structure-admin.model';
import { StructureAdminService } from '../service/structure-admin.service';

@Component({
  selector: 'jhi-structure-admin-update',
  templateUrl: './structure-admin-update.component.html',
})
export class StructureAdminUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;
  editForm = this.fb.group({
    id: [],
    code: [],
    libelle: [],
    description: [],
    direction: [],
    services: [],
    adresse: [],
  });

  constructor(
    protected structureAdminService: StructureAdminService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ structureAdmin }) => {
      this.updateForm(structureAdmin);
      if (structureAdmin.id !== undefined && structureAdmin.id !== null) {
        this.titre = 'Modifier cette Structure';
      } else {
        this.titre = 'Ajouter une Struture';
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const structureAdmin = this.createFromForm();
    if (structureAdmin.id !== undefined) {
      this.subscribeToSaveResponse(this.structureAdminService.update(structureAdmin));
    } else {
      this.subscribeToSaveResponse(this.structureAdminService.create(structureAdmin));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStructureAdmin>>): void {
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

  protected updateForm(structureAdmin: IStructureAdmin): void {
    this.editForm.patchValue({
      id: structureAdmin.id,
      code: structureAdmin.code,
      libelle: structureAdmin.libelle,
      description: structureAdmin.description,
      direction: structureAdmin.direction,
      services: structureAdmin.services,
      adresse: structureAdmin.adresse,
    });
  }

  protected createFromForm(): IStructureAdmin {
    return {
      ...new StructureAdmin(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      direction: this.editForm.get(['direction'])!.value,
      services: this.editForm.get(['services'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
    };
  }
}
