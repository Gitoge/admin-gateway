import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IArrondissement, Arrondissement } from '../arrondissement.model';
import { ArrondissementService } from '../service/arrondissement.service';
import { IDepartement } from 'app/entities/departement/departement.model';
import { DepartementService } from 'app/entities/departement/service/departement.service';

@Component({
  selector: 'jhi-arrondissement-update',
  templateUrl: './arrondissement-update.component.html',
})
export class ArrondissementUpdateComponent implements OnInit {
  isSaving = false;
  titre: any;

  departementsSharedCollection: IDepartement[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required]],
    libelle: [null, [Validators.required]],
    departement: [],
  });

  constructor(
    protected arrondissementService: ArrondissementService,
    protected departementService: DepartementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ arrondissement }) => {
      if (arrondissement.id === undefined) {
        this.titre = 'Ajouter arrondissement';
      } else {
        this.titre = `Modifier arrondissement  `;
      }
      this.updateForm(arrondissement);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const arrondissement = this.createFromForm();
    if (arrondissement.id !== undefined) {
      this.subscribeToSaveResponse(this.arrondissementService.update(arrondissement));
    } else {
      this.subscribeToSaveResponse(this.arrondissementService.create(arrondissement));
    }
  }

  trackDepartementById(index: number, item: IDepartement): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IArrondissement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
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

  protected updateForm(arrondissement: IArrondissement): void {
    this.editForm.patchValue({
      id: arrondissement.id,
      code: arrondissement.code,
      libelle: arrondissement.libelle,
      departement: arrondissement.departement,
    });

    this.departementsSharedCollection = this.departementService.addDepartementToCollectionIfMissing(
      this.departementsSharedCollection,
      arrondissement.departement
    );
  }

  protected loadRelationshipsOptions(): void {
    this.departementService
      .queryAll()
      .pipe(map((res: HttpResponse<IDepartement[]>) => res.body ?? []))
      .pipe(
        map((departements: IDepartement[]) =>
          this.departementService.addDepartementToCollectionIfMissing(departements, this.editForm.get('departement')!.value)
        )
      )
      .subscribe((departements: IDepartement[]) => (this.departementsSharedCollection = departements));
  }

  protected createFromForm(): IArrondissement {
    return {
      ...new Arrondissement(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      departement: this.editForm.get(['departement'])!.value,
    };
  }
}
