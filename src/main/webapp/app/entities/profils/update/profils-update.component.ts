import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProfils, Profils } from '../profils.model';
import { ProfilsService } from '../service/profils.service';
import { IModules } from 'app/entities/modules/modules.model';
import { ModulesService } from 'app/entities/modules/service/modules.service';
import { IRoles } from 'app/entities/roles/roles.model';
import { RolesService } from 'app/entities/roles/service/roles.service';

@Component({
  selector: 'jhi-profils-update',
  templateUrl: './profils-update.component.html',
})
export class ProfilsUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  rolesSharedCollection: IRoles[] = [];

  editForm = this.fb.group({
    id: [],
    code: [],
    libelle: [],
    description: [],
    roles: [],
  });

  constructor(
    protected profilsService: ProfilsService,
    protected rolesService: RolesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ profils }) => {
      this.updateForm(profils);
      if (profils.id !== undefined && profils.id !== null) {
        this.titre = 'Modifier ce Profil';
      } else {
        this.titre = 'Ajouter un Profil';
      }
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const profils = this.createFromForm();
    if (profils.id !== undefined) {
      this.subscribeToSaveResponse(this.profilsService.update(profils));
    } else {
      this.subscribeToSaveResponse(this.profilsService.create(profils));
    }
  }

  trackRolesById(_index: number, item: IRoles): number {
    return item.id!;
  }

  getSelectedRoles(option: IRoles, selectedVals?: IRoles[]): IRoles {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfils>>): void {
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

  protected updateForm(profils: IProfils): void {
    this.editForm.patchValue({
      id: profils.id,
      code: profils.code,
      libelle: profils.libelle,
      description: profils.description,
      roles: profils.roles,
    });

    this.rolesSharedCollection = this.rolesService.addRolesToCollectionIfMissing(this.rolesSharedCollection, ...(profils.roles ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.rolesService
      .query()
      .pipe(map((res: HttpResponse<IModules[]>) => res.body ?? []))
      .pipe(map((roles: IRoles[]) => this.rolesService.addRolesToCollectionIfMissing(roles, ...(this.editForm.get('roles')!.value ?? []))))
      .subscribe((roles: IRoles[]) => (this.rolesSharedCollection = roles));
  }

  protected createFromForm(): IProfils {
    return {
      ...new Profils(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      roles: this.editForm.get(['roles'])!.value,
    };
  }
}
