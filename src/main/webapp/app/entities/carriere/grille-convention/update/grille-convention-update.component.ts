import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IGrilleConvention, GrilleConvention } from '../grille-convention.model';
import { GrilleConventionService } from '../service/grille-convention.service';
import { IEtablissement } from '../../../etablissement/etablissement.model';
import { EtablissementService } from '../../../etablissement/service/etablissement.service';
import { ICategorie } from '../../../categorie/categorie.model';
import { CategorieService } from '../../../categorie/service/categorie.service';
import { IGrade } from '../../../grade/grade.model';
import { GradeService } from '../../../grade/service/grade.service';
import { ClasseService } from '../../../classe/service/classe.service';
import { IClasse } from '../../../classe/classe.model';

@Component({
  selector: 'jhi-grille-convention-update',
  templateUrl: './grille-convention-update.component.html',
})
export class GrilleConventionUpdateComponent implements OnInit {
  isSaving = false;

  titre!: string;

  etablissementSharedCollection: IEtablissement[] = [];
  categorieSharedCollection: ICategorie[] = [];
  gradeSharedCollection: IGrade[] = [];
  classeSharedCollection: IClasse[] = [];

  etablissement!: IEtablissement;

  grilleConvention!: IGrilleConvention;

  editForm = this.fb.group({
    id: [],
    salaireDeBase: [null, [Validators.required]],
    tauxPrimeDeTechnicite: [],
    gradeId: [],
    classeId: [],
    etablissement: [],
    //  libelleEtablissement: [],
    categorie: [],
    grade: [null, [Validators.required]],
    classe: [],
  });

  constructor(
    protected grilleConventionService: GrilleConventionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected etablissementService: EtablissementService,
    protected categorieService: CategorieService,
    protected gradeService: GradeService,
    protected classeService: ClasseService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grilleConvention }) => {
      this.updateForm(grilleConvention);

      /*TITRE DE LA PAGE AJOUT ET MODIF*/
      if (grilleConvention.id !== undefined && grilleConvention.id !== null) {
        this.titre = 'Modifier cette grille';
      } else {
        this.titre = 'Ajouter une grille';
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grilleConvention = this.createFromForm();
    this.grilleConvention = grilleConvention;
    this.grilleConvention.etablissementId = grilleConvention.etablissementId;
    if (grilleConvention.id !== undefined) {
      this.subscribeToSaveResponse(this.grilleConventionService.update(grilleConvention));
    } else {
      this.subscribeToSaveResponse(this.grilleConventionService.create(grilleConvention));
    }
  }
  protected loadRelationshipsOptions(): void {
    this.etablissementService
      .findAll()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissement: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissement, this.editForm.get('etablissement')!.value)
        )
      )
      .subscribe((etablissement: IEtablissement[]) => (this.etablissementSharedCollection = etablissement));

    this.categorieService
      .findAll()
      .pipe(map((res: HttpResponse<ICategorie[]>) => res.body ?? []))
      .pipe(
        map((categorie: ICategorie[]) =>
          this.categorieService.addCategorieToCollectionIfMissing(categorie, this.editForm.get('categorie')!.value)
        )
      )
      .subscribe((categorie: ICategorie[]) => (this.categorieSharedCollection = categorie));

    this.gradeService
      .findAll()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grade: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing(grade, this.editForm.get('grade')!.value)))
      .subscribe((grade: IGrade[]) => (this.gradeSharedCollection = grade));

    this.classeService
      .findAll()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(map((classe: IClasse[]) => this.classeService.addClasseToCollectionIfMissing(classe, this.editForm.get('classe')!.value)))
      .subscribe((classe: IClasse[]) => (this.classeSharedCollection = classe));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrilleConvention>>): void {
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

  protected updateForm(grilleConvention: IGrilleConvention): void {
    this.editForm.patchValue({
      id: grilleConvention.id,
      salaireDeBase: grilleConvention.salaireDeBase,
      tauxPrimeDeTechnicite: grilleConvention.tauxPrimeDeTechnicite,
      gradeId: grilleConvention.gradeId,
      classeId: grilleConvention.classeId,
      etablissementId: grilleConvention.etablissementId,
      categorieId: grilleConvention.categorieId,
      codeGrade: this.editForm.get(['grade'])!.value?.code,
      libelleCategorie: this.editForm.get(['categorie'])!.value?.libelle,
      libelleClasse: this.editForm.get(['classe'])!.value?.libelle,
      libelleEtablissement: this.editForm.get(['etablissement'])!.value?.libelleLong,
    });
  }

  protected createFromForm(): IGrilleConvention {
    return {
      ...new GrilleConvention(),
      id: this.editForm.get(['id'])!.value,
      salaireDeBase: this.editForm.get(['salaireDeBase'])!.value,
      tauxPrimeDeTechnicite: this.editForm.get(['tauxPrimeDeTechnicite'])!.value,
      gradeId: this.editForm.get(['grade'])!.value?.id,
      classeId: this.editForm.get(['classe'])!.value?.id,
      etablissementId: this.editForm.get(['etablissement'])!.value?.id,
      categorieId: this.editForm.get(['categorie'])!.value?.id,
      libelleCategorie: this.editForm.get(['categorie'])!.value?.libelle,
      libelleEtablissement: this.editForm.get(['etablissement'])!.value?.libelleLong,
      codeGrade: this.editForm.get(['grade'])!.value?.code,
      libelleClasse: this.editForm.get(['classe'])!.value?.libelle,
    };
  }
}
