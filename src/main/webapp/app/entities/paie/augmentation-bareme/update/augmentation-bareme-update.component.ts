import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';
import { IAugmentationBareme, AugmentationBareme } from '../augmentation-bareme.model';
import { AugmentationBaremeService } from '../service/augmentation-bareme.service';
import { IPostes } from '../../postes/postes.model';
import { PostesService } from 'app/entities/postes/service/postes.service';

@Component({
  selector: 'jhi-augmentation-bareme-update',
  templateUrl: './augmentation-bareme-update.component.html',
})
export class AugmentationBaremeUpdateComponent implements OnInit {
  isSaving = false;

  augmentationBareme!: IAugmentationBareme;
  titre!: string;
  postesSharedCollection: IPostes[] = [];

  editForm = this.fb.group({
    id: [],
    codePoste: [],
    postes: [],
    montant: [null, [Validators.required]],
    posteId: [],
    dateInsertId: [],
    dateUpdateId: [],
    userInsertId: [],
    userUpdateId: [],
  });

  constructor(
    protected augmentationBaremeService: AugmentationBaremeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected postesService: PostesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ augmentationBareme }) => {
      this.augmentationBareme = augmentationBareme;

      if (augmentationBareme.id === undefined) {
        this.titre = 'Modifier augmentation Bareme';
        const today = dayjs().startOf('day');
        augmentationBareme.dateInsert = today;
        augmentationBareme.dateUpdate = today;
      } else {
        this.titre = 'Ajouter augmentation Bareme';
      }
      this.loadPage();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const today = dayjs().startOf('day');
    if (this.augmentationBareme.id !== undefined) {
      this.augmentationBareme.dateUpdate = today;
      this.subscribeToSaveResponse(this.augmentationBaremeService.update(this.augmentationBareme));
    } else {
      this.augmentationBareme.dateInsert = today;
      this.subscribeToSaveResponse(this.augmentationBaremeService.create(this.augmentationBareme));
    }
  }

  protected loadPage(): any {
    this.postesService
      .queryList()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('postes')!.value)))
      .subscribe((postes: IPostes[]) => (this.postesSharedCollection = postes));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAugmentationBareme>>): void {
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
