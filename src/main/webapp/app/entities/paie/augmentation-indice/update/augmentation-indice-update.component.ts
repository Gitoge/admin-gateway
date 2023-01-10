import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { IAugmentationIndice, AugmentationIndice } from '../augmentation-indice.model';
import { AugmentationIndiceService } from '../service/augmentation-indice.service';
import { IPostes } from '../../../postes/postes.model';
import { PostesService } from '../../../postes/service/postes.service';
import { HistoAugmentationService } from '../../histo-augmentation/service/histo-augmentation.service';
import { IHistoAugmentation } from '../../histo-augmentation/histo-augmentation.model';

@Component({
  selector: 'jhi-augmentation-indice-update',
  templateUrl: './augmentation-indice-update.component.html',
})
export class AugmentationIndiceUpdateComponent implements OnInit {
  isSaving = false;
  augmentationIndice!: IAugmentationIndice;
  postesSharedCollection: IHistoAugmentation[] = [];
  valeurSharedCollection: IHistoAugmentation[] = [];

  titre!: string;

  editForm = this.fb.group({
    id: [],
    libelle: [],
    valeur: [],
    postes: [],
    idPoste: [],
    codePoste: [],
    total: [],
  });

  constructor(
    protected augmentationIndiceService: AugmentationIndiceService,
    protected histoAugmentationService: HistoAugmentationService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ augmentationIndice }) => {
      this.augmentationIndice = augmentationIndice;
      if (augmentationIndice.id) {
        this.titre = 'Modifier augmentation indice';
      } else {
        this.titre = 'Ajouter augmentation indice';
      }
    });
    this.loadPage();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;

    this.augmentationIndice.idPoste = this.augmentationIndice.postes?.id;
    this.augmentationIndice.codePoste = this.augmentationIndice.postes?.code;
    this.augmentationIndice.libelle = this.augmentationIndice.postes?.libelle;
    this.augmentationIndice.valeur = this.augmentationIndice.histoAugmentation?.valeur;
    console.error('vggg', this.augmentationIndice.histoAugmentation?.valeur);

    if (this.augmentationIndice.id !== undefined) {
      this.subscribeToSaveResponse(this.augmentationIndiceService.update(this.augmentationIndice));
    } else {
      this.subscribeToSaveResponse(this.augmentationIndiceService.create(this.augmentationIndice));
    }
  }
  protected loadPage(): any {
    this.histoAugmentationService
      .queryIndice()
      .pipe(map((res: HttpResponse<IHistoAugmentation[]>) => res.body ?? []))
      .pipe(
        map((postes: IHistoAugmentation[]) =>
          this.histoAugmentationService.addHistoAugmentationToCollectionIfMissing(postes, this.editForm.get('postes')!.value)
        )
      )
      .subscribe((postes: IHistoAugmentation[]) => (this.postesSharedCollection = postes));

    this.histoAugmentationService
      .queryIndice()
      .pipe(map((res: HttpResponse<IHistoAugmentation[]>) => res.body ?? []))
      .pipe(
        map((postes: IHistoAugmentation[]) =>
          this.histoAugmentationService.addHistoAugmentationToCollectionIfMissing(postes, this.editForm.get('valeur')!.value)
        )
      )
      .subscribe((postes: IHistoAugmentation[]) => (this.valeurSharedCollection = postes));
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAugmentationIndice>>): void {
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
}
