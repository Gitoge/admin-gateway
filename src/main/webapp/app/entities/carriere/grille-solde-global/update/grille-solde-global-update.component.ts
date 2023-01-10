import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGrilleSoldeGlobal, GrilleSoldeGlobal } from '../grille-solde-global.model';
import { GrilleSoldeGlobalService } from '../service/grille-solde-global.service';
import { IGrade } from '../../../grade/grade.model';
import { GradeService } from '../../../grade/service/grade.service';
import { ICorps } from '../../../corps/corps.model';
import { CorpsService } from '../../../corps/service/corps.service';
import { IEchelon } from '../../../echelon/echelon.model';
import { EchelonService } from '../../../echelon/service/echelon.service';
import { CadreService } from '../../../cadre/service/cadre.service';
import { ICadre } from '../../../cadre/cadre.model';
import { ClasseService } from '../../../classe/service/classe.service';
import { IClasse } from '../../../classe/classe.model';
import { IHierarchie } from '../../../hierarchie/hierarchie.model';
import { HierarchieService } from '../../../hierarchie/service/hierarchie.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'jhi-grille-solde-global-update',
  templateUrl: './grille-solde-global-update.component.html',
})
export class GrilleSoldeGlobalUpdateComponent implements OnInit {
  isSaving = false;
  titre?: string;

  grilleSoldeGlobal!: IGrilleSoldeGlobal;
  gradeSharedCollection: IGrade[] = [];
  corpsSharedCollection: ICorps[] = [];
  echelonSharedCollection: IEchelon[] = [];
  cadreSharedCollection: ICadre[] = [];
  classeSharedCollection: IClasse[] = [];
  hierarchieSharedCollection: IHierarchie[] = [];

  editForm = this.fb.group({
    id: [],
    soldeGlobal: [],
    anciennete: [],
    corps: [],
    cadre: [],
    grade: [],
    echelon: [],
    classe: [],
    hierarchie: [],
  });

  constructor(
    protected grilleSoldeGlobalService: GrilleSoldeGlobalService,
    protected gradeService: GradeService,
    protected corpsService: CorpsService,
    protected echelonService: EchelonService,
    protected classeService: ClasseService,
    protected cadreService: CadreService,
    protected hierarchieService: HierarchieService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grilleSoldeGlobal }) => {
      this.grilleSoldeGlobal = grilleSoldeGlobal;
      if (grilleSoldeGlobal.id !== undefined) {
        this.titre = 'Modifier ce grille solde global';
      } else {
        this.titre = 'Ajouter grille Solde global';
      }
      this.updateForm(grilleSoldeGlobal);
      this.loadPage();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    // const grilleSoldeGlobal = this.createFromForm();
    if (this.grilleSoldeGlobal.id !== undefined) {
      this.subscribeToSaveResponse(this.grilleSoldeGlobalService.update(this.grilleSoldeGlobal));
    } else {
      this.subscribeToSaveResponse(this.grilleSoldeGlobalService.create(this.grilleSoldeGlobal));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrilleSoldeGlobal>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: (res: any) => this.onSaveSuccess(res.body),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(grilleSoldeGlobal: IGrilleSoldeGlobal): void {
    if (grilleSoldeGlobal !== null) {
      this.grilleSoldeGlobal = grilleSoldeGlobal;

      this.isSaving = false;

      if (this.grilleSoldeGlobal.id !== undefined) {
        Swal.fire({
          icon: 'success',
          title: 'Réussi ',
          text: `Grille Solde enregistré avec succès`,
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
  protected loadPage(): any {
    this.gradeService
      .findAll()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grade: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing(grade, this.editForm.get('grade')!.value)))
      .subscribe((grade: IGrade[]) => (this.gradeSharedCollection = grade));

    this.corpsService
      .findAll()
      .pipe(map((res: HttpResponse<ICorps[]>) => res.body ?? []))
      .pipe(map((corps: ICorps[]) => this.corpsService.addCorpsToCollectionIfMissing(corps, this.editForm.get('corps')!.value)))
      .subscribe((corps: ICorps[]) => (this.corpsSharedCollection = corps));

    this.echelonService
      .findAll()
      .pipe(map((res: HttpResponse<IEchelon[]>) => res.body ?? []))
      .pipe(map((echelon: IEchelon[]) => this.echelonService.addEchelonToCollectionIfMissing(echelon, this.editForm.get('echelon')!.value)))
      .subscribe((echelon: IEchelon[]) => (this.echelonSharedCollection = echelon));

    this.cadreService
      .query()
      .pipe(map((res: HttpResponse<ICadre[]>) => res.body ?? []))
      .pipe(map((cadre: ICadre[]) => this.cadreService.addCadreToCollectionIfMissing(cadre, this.editForm.get('cadre')!.value)))
      .subscribe((cadre: ICadre[]) => (this.cadreSharedCollection = cadre));

    this.classeService
      .findAll()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(map((classe: IClasse[]) => this.classeService.addClasseToCollectionIfMissing(classe, this.editForm.get('classe')!.value)))
      .subscribe((classe: IClasse[]) => (this.classeSharedCollection = classe));

    this.hierarchieService
      .findAll()
      .pipe(map((res: HttpResponse<IHierarchie[]>) => res.body ?? []))
      .pipe(
        map((hierarchie: IHierarchie[]) =>
          this.hierarchieService.addHierarchieToCollectionIfMissing(hierarchie, this.editForm.get('hierarchie')!.value)
        )
      )
      .subscribe((hierarchie: IHierarchie[]) => (this.hierarchieSharedCollection = hierarchie));
  }

  protected updateForm(grilleSoldeGlobal: IGrilleSoldeGlobal): void {
    this.editForm.patchValue({
      id: grilleSoldeGlobal.id,
      soldeGlobal: grilleSoldeGlobal.soldeGlobal,
      anciennete: grilleSoldeGlobal.anciennete,
      corpsId: grilleSoldeGlobal.corpsId,
      hierarchieId: grilleSoldeGlobal.hierarchieId,
      cadreId: grilleSoldeGlobal.cadreId,
      gradeId: grilleSoldeGlobal.gradeId,
      echelonId: grilleSoldeGlobal.echelonId,
      classeId: grilleSoldeGlobal.classeId,
    });
  }

  protected createFromForm(): IGrilleSoldeGlobal {
    return {
      ...new GrilleSoldeGlobal(),
      id: this.editForm.get(['id'])!.value,
      soldeGlobal: this.editForm.get(['soldeGlobal'])!.value,
      anciennete: this.editForm.get(['anciennete'])!.value,
      corpsId: this.editForm.get(['corps'])!.value?.id,
      cadreId: this.editForm.get(['cadre'])!.value?.id,
      gradeId: this.editForm.get(['grade'])!.value?.id,
      echelonId: this.editForm.get(['echelon'])!.value?.id,
      classeId: this.editForm.get(['classe'])!.value?.id,
      hierarchieId: this.editForm.get(['hierarchie'])!.value?.id,
      libelleHierarchie: this.editForm.get(['hierarchie'])!.value?.libelle,
      codeGrade: this.editForm.get(['grade'])!.value?.code,
      libelleClasse: this.editForm.get(['classe'])!.value?.libelle,
      libelleEchelon: this.editForm.get(['echelon'])!.value?.libelle,
    };
  }
}
