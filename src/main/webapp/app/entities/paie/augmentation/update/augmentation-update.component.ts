import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAugmentation, Augmentation } from '../augmentation.model';
import { AugmentationService } from '../service/augmentation.service';
import { PostesService } from '../../../postes/service/postes.service';
import { IPostes } from '../../../postes/postes.model';
import { IHistoAugmentation } from '../../histo-augmentation/histo-augmentation.model';
import { HistoAugmentationService } from '../../histo-augmentation/service/histo-augmentation.service';

@Component({
  selector: 'jhi-augmentation-update',
  templateUrl: './augmentation-update.component.html',
})
export class AugmentationUpdateComponent implements OnInit {
  isSaving = false;

  augmentation!: IAugmentation;
  postes: IPostes[] = [];
  histoAugmentation: IHistoAugmentation[] = [];

  editForm = this.fb.group({
    id: [],
    codePoste: [],
    montant: [null, [Validators.required]],
    reference: [],
    posteId: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsertId: [],
    dateUpdateId: [],
    histoAugmentation: [],
  });

  constructor(
    protected augmentationService: AugmentationService,
    protected postesService: PostesService,
    protected histoAugmentationService: HistoAugmentationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ augmentation }) => {
      this.augmentation = augmentation;
      // console.error(augmentation);
      if (augmentation.id === undefined) {
        const today = dayjs().startOf('day');
        augmentation.dateInsertId = today;
        augmentation.dateUpdateId = today;
      }

      this.updateForm(augmentation);
    });

    this.load();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;

    this.augmentation.codePoste = this.augmentation.postes?.code;
    this.augmentation.libellePoste = this.augmentation.postes?.libelle;
    this.augmentation.posteId = this.augmentation.postes?.id;

    if (this.augmentation.id !== undefined) {
      this.subscribeToSaveResponse(this.augmentationService.update(this.augmentation));
    } else {
      this.subscribeToSaveResponse(this.augmentationService.create(this.augmentation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAugmentation>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }
  protected load(): any {
    this.postesService
      .findAll()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes)))
      .subscribe((postes: IPostes[]) => (this.postes = postes));

    this.histoAugmentationService
      .query()
      .pipe(map((res: HttpResponse<IHistoAugmentation[]>) => res.body ?? []))
      .pipe(
        map((histoAugmentation: IHistoAugmentation[]) =>
          this.histoAugmentationService.addHistoAugmentationToCollectionIfMissing(histoAugmentation)
        )
      )
      .subscribe((histoAugmentation: IHistoAugmentation[]) => (this.histoAugmentation = histoAugmentation));
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

  protected updateForm(augmentation: IAugmentation): void {
    this.editForm.patchValue({
      id: augmentation.id,
      codePoste: augmentation.codePoste,
      montant: augmentation.montant,
      reference: augmentation.reference,
      posteId: augmentation.posteId,
      histoAugmentation: augmentation.histoAugmentation,
      userInsertId: augmentation.userInsertId,
      userUpdateId: augmentation.userUpdateId,
      dateInsertId: augmentation.dateInsertId ? augmentation.dateInsertId.format(DATE_TIME_FORMAT) : null,
      dateUpdateId: augmentation.dateUpdateId ? augmentation.dateUpdateId.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IAugmentation {
    return {
      ...new Augmentation(),
      id: this.editForm.get(['id'])!.value,
      codePoste: this.editForm.get(['codePoste'])!.value?.codePoste,
      montant: this.editForm.get(['montant'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      posteId: this.editForm.get(['posteId'])!.value,
      histoAugmentation: this.editForm.get(['histoAugmentation'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsertId: this.editForm.get(['dateInsertId'])!.value
        ? dayjs(this.editForm.get(['dateInsertId'])!.value, DATE_TIME_FORMAT)
        : undefined,
      dateUpdateId: this.editForm.get(['dateUpdateId'])!.value
        ? dayjs(this.editForm.get(['dateUpdateId'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }
}
