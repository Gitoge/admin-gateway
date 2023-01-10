import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IHistoAugmentation, HistoAugmentation } from '../histo-augmentation.model';
import { HistoAugmentationService } from '../service/histo-augmentation.service';
import { IPostes } from '../../../postes/postes.model';
import { PostesService } from '../../../postes/service/postes.service';
import { IHierarchie } from '../../../hierarchie/hierarchie.model';
import { HierarchieService } from '../../../hierarchie/service/hierarchie.service';

@Component({
  selector: 'jhi-histo-augmentation-update',
  templateUrl: './histo-augmentation-update.component.html',
})
export class HistoAugmentationUpdateComponent implements OnInit {
  isSaving = false;
  titre = '';
  typeChoisi: any;
  isMontant = true;
  isTaux = false;
  isValeur = false;
  isIndice = false;
  isNonIndice = false;
  isPoste = true;
  isHierarchie = true;
  postesSharedCollection: IPostes[] = [];
  hierarchie: IHierarchie[] = [];

  editForm = this.fb.group({
    id: [],
    codePoste: [],
    libelle: [null, [Validators.required]],
    type: [],
    date: [null, [Validators.required]],
    categorie: [null, [Validators.required]],
    hierarchie: [],
    plafond: [],
    montant: [],
    taux: [],
    valeur: [],
  });

  constructor(
    protected histoAugmentationService: HistoAugmentationService,
    protected hierarchieService: HierarchieService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ histoAugmentation }) => {
      this.updateForm(histoAugmentation);
      if (histoAugmentation.id === undefined) {
        this.titre = 'Ajout Historique Augmentation';
      } else {
        this.titre = 'Modification Historique Augmentation';
      }
    });
    this.loadPage();
  }

  previousState(): void {
    window.history.back();
  }
  getSelectedType(param: string): void {
    switch (param) {
      case 'Montant':
        this.isMontant = true;
        this.isValeur = false;
        this.isTaux = false;
        break;
      case 'Taux':
        this.isMontant = false;
        this.isValeur = false;
        this.isTaux = true;
        break;
      case 'Valeur':
        this.isMontant = false;
        this.isValeur = true;
        this.isTaux = false;
        break;
      default:
        break;
    }
  }

  getSelectedCategorie(param: string): void {
    switch (param) {
      case 'Indice':
        this.isNonIndice = false;
        this.isIndice = true;
        break;
      case 'Non Indice':
        this.isNonIndice = true;
        this.isIndice = false;
        break;
      default:
        break;
    }
  }

  getSelectedHierarchie(option: IHierarchie, selectedVals?: IHierarchie[]): IHierarchie {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.libelle === selectedVal.libelle) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  save(): void {
    this.isSaving = true;
    const histoAugmentation = this.createFromForm();
    if (histoAugmentation.id !== undefined) {
      this.subscribeToSaveResponse(this.histoAugmentationService.update(histoAugmentation));
    } else {
      this.subscribeToSaveResponse(this.histoAugmentationService.create(histoAugmentation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHistoAugmentation>>): void {
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
  protected loadPage(): any {
    this.postesService
      .queryList()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('codePoste')!.value)))
      .subscribe((postes: IPostes[]) => (this.postesSharedCollection = postes));

    this.hierarchieService
      .query()
      .pipe(map((res: HttpResponse<IHierarchie[]>) => res.body ?? []))
      .pipe(
        map((hierarchie: IHierarchie[]) =>
          this.hierarchieService.addHierarchieToCollectionIfMissing(hierarchie, this.editForm.get('hierarchie')!.value)
        )
      )
      .subscribe((hierarchie: IHierarchie[]) => (this.hierarchie = hierarchie));
  }

  protected updateForm(histoAugmentation: IHistoAugmentation): void {
    this.editForm.patchValue({
      id: histoAugmentation.id,
      codePoste: histoAugmentation.codePoste,
      libelle: histoAugmentation.libelle,
      type: histoAugmentation.type,
      date: histoAugmentation.date,
      categorie: histoAugmentation.categorie,
      hierarchie: histoAugmentation.hierarchie,
      plafond: histoAugmentation.plafond,
      montant: histoAugmentation.montant,
      taux: histoAugmentation.taux,
      valeur: histoAugmentation.valeur,
    });
  }

  protected createFromForm(): IHistoAugmentation {
    return {
      ...new HistoAugmentation(),
      id: this.editForm.get(['id'])!.value,
      codePoste: this.editForm.get(['codePoste'])!.value?.code,
      libelle: this.editForm.get(['libelle'])!.value,
      type: this.editForm.get(['type'])!.value,
      date: this.editForm.get(['date'])!.value,
      categorie: this.editForm.get(['categorie'])!.value,
      hierarchie: this.editForm.get(['hierarchie'])!.value,
      plafond: this.editForm.get(['plafond'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      taux: this.editForm.get(['taux'])!.value,
      valeur: this.editForm.get(['valeur'])!.value,
    };
  }
}
