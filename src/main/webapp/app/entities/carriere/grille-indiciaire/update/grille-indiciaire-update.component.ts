import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGrilleIndiciaire, GrilleIndiciaire } from '../grille-indiciaire.model';
import { GrilleIndiciaireService } from '../service/grille-indiciaire.service';
import { IIndices } from 'app/entities/carriere/indices/indices.model';
import { IndicesService } from 'app/entities/carriere/indices/service/indices.service';
import { CorpsService } from '../../../corps/service/corps.service';
import { IHierarchie } from '../../../hierarchie/hierarchie.model';
import { HierarchieService } from '../../../hierarchie/service/hierarchie.service';
import { IGrade } from '../../../grade/grade.model';
import { GradeService } from '../../../grade/service/grade.service';
import { IEchelon } from '../../../echelon/echelon.model';
import { EchelonService } from '../../../echelon/service/echelon.service';

@Component({
  selector: 'jhi-grille-indiciaire-update',
  templateUrl: './grille-indiciaire-update.component.html',
})
export class GrilleIndiciaireUpdateComponent implements OnInit {
  isSaving = false;
  titre?: string;
  ngGrade?: string;

  indicesSharedCollection: IIndices[] = [];
  hierarchieSharedCollection: IHierarchie[] = [];
  gradeSharedCollection: IGrade[] = [];
  echelonSharedCollection: IEchelon[] = [];
  libelleHierarchie?: string;
  libelleEchelon?: string;

  editForm = this.fb.group({
    id: [],
    salaireDeBase: [],
    borneInferieure: [],
    borneSuperieure: [],
    anciennete: [],
    corps: [],
    hierarchie: [],
    grade: [],
    echelon: [],
    indices: [],
    libelleHierarchie: [],
    libelleEchelon: [],
  });

  constructor(
    protected grilleIndiciaireService: GrilleIndiciaireService,
    protected indicesService: IndicesService,
    protected corpsService: CorpsService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected hierarchieService: HierarchieService,
    protected gradeService: GradeService,
    protected echelonService: EchelonService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grilleIndiciaire }) => {
      this.updateForm(grilleIndiciaire);
      if (grilleIndiciaire.id !== undefined) {
        this.titre = 'Modifier ce grille indiciaire';
      } else {
        this.titre = 'Ajouter un grille indiciaire';
      }
      this.loadRelationshipsOptions();
    });
    this.ngGrade = this.editForm.get(['grade'])!.value?.id;
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grilleIndiciaire = this.createFromForm();
    if (grilleIndiciaire.id !== undefined) {
      this.subscribeToSaveResponse(this.grilleIndiciaireService.update(grilleIndiciaire));
    } else {
      this.subscribeToSaveResponse(this.grilleIndiciaireService.create(grilleIndiciaire));
    }
  }

  trackIndicesById(_index: number, item: IIndices): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrilleIndiciaire>>): void {
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

  protected updateForm(grilleIndiciaire: IGrilleIndiciaire): void {
    this.editForm.patchValue({
      id: grilleIndiciaire.id,
      salaireDeBase: grilleIndiciaire.salaireDeBase,
      borneInferieure: grilleIndiciaire.borneInferieure,
      borneSuperieure: grilleIndiciaire.borneSuperieure,
      anciennete: grilleIndiciaire.anciennete,
      corpsId: grilleIndiciaire.corpsId,
      hierarchieId: grilleIndiciaire.hierarchieId,
      gradeId: grilleIndiciaire.gradeId,
      echelonId: grilleIndiciaire.echelonId,
      indices: grilleIndiciaire.indices,
      libelleHierarchie: this.editForm.get(['hierarchie'])!.value?.libelle,
      libelleEchelon: this.editForm.get(['echelon'])!.value?.libelle,
    });

    this.indicesSharedCollection = this.indicesService.addIndicesToCollectionIfMissing(
      this.indicesSharedCollection,
      grilleIndiciaire.indices
    );
  }

  protected loadRelationshipsOptions(): void {
    this.indicesService
      .query()
      .pipe(map((res: HttpResponse<IIndices[]>) => res.body ?? []))
      .pipe(map((indices: IIndices[]) => this.indicesService.addIndicesToCollectionIfMissing(indices, this.editForm.get('indices')!.value)))
      .subscribe((indices: IIndices[]) => (this.indicesSharedCollection = indices));

    this.hierarchieService
      .query()
      .pipe(map((res: HttpResponse<IHierarchie[]>) => res.body ?? []))
      .pipe(
        map((hierarchie: IHierarchie[]) =>
          this.hierarchieService.addHierarchieToCollectionIfMissing(hierarchie, this.editForm.get('hierarchie')!.value)
        )
      )
      .subscribe((hierarchie: IHierarchie[]) => (this.hierarchieSharedCollection = hierarchie));

    this.gradeService
      .query()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grade: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing(grade, this.editForm.get('grade')!.value)))
      .subscribe((grade: IGrade[]) => (this.gradeSharedCollection = grade));

    this.echelonService
      .query()
      .pipe(map((res: HttpResponse<IEchelon[]>) => res.body ?? []))
      .pipe(map((echelon: IEchelon[]) => this.echelonService.addEchelonToCollectionIfMissing(echelon, this.editForm.get('echelon')!.value)))
      .subscribe((echelon: IEchelon[]) => (this.echelonSharedCollection = echelon));
  }

  protected createFromForm(): IGrilleIndiciaire {
    return {
      ...new GrilleIndiciaire(),
      id: this.editForm.get(['id'])!.value,
      salaireDeBase: this.editForm.get(['salaireDeBase'])!.value,
      borneInferieure: this.editForm.get(['borneInferieure'])!.value,
      borneSuperieure: this.editForm.get(['borneSuperieure'])!.value,
      anciennete: this.editForm.get(['anciennete'])!.value,
      hierarchieId: this.editForm.get(['hierarchie'])!.value?.id,
      gradeId: this.editForm.get(['grade'])!.value?.id,
      echelonId: this.editForm.get(['echelon'])!.value?.id,
      indices: this.editForm.get(['indices'])!.value,
      libelleHierarchie: this.editForm.get(['hierarchie'])!.value?.libelle,
      libelleEchelon: this.editForm.get(['echelon'])!.value?.libelle,
    };
  }
}
