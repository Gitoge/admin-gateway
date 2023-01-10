import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAugmentationHierarchie, AugmentationHierarchie } from '../augmentation-hierarchie.model';
import { AugmentationHierarchieService } from '../service/augmentation-hierarchie.service';
import { IHierarchie } from '../../../hierarchie/hierarchie.model';
import { HierarchieService } from '../../../hierarchie/service/hierarchie.service';
import { IAugmentation } from '../../augmentation/augmentation.model';
import { AugmentationService } from '../../augmentation/service/augmentation.service';

@Component({
  selector: 'jhi-augmentation-hierarchie-update',
  templateUrl: './augmentation-hierarchie-update.component.html',
})
export class AugmentationHierarchieUpdateComponent implements OnInit {
  isSaving = false;
  hierarchie: IHierarchie[] = [];
  augmentation: IAugmentation[] = [];

  editForm = this.fb.group({
    id: [],
    montant: [null, [Validators.required]],
    augmentationId: [null, [Validators.required]],
    hierarchieId: [null, [Validators.required]],
    userInserId: [],
    dateInsert: [],
  });

  constructor(
    protected augmentationHierarchieService: AugmentationHierarchieService,
    protected augmentationService: AugmentationService,
    protected hierarchieService: HierarchieService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ augmentationHierarchie }) => {
      if (augmentationHierarchie.id === undefined) {
        const today = dayjs().startOf('day');
        augmentationHierarchie.dateInsert = today;
      }

      this.updateForm(augmentationHierarchie);
      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const augmentationHierarchie = this.createFromForm();
    if (augmentationHierarchie.id !== undefined) {
      this.subscribeToSaveResponse(this.augmentationHierarchieService.update(augmentationHierarchie));
    } else {
      this.subscribeToSaveResponse(this.augmentationHierarchieService.create(augmentationHierarchie));
    }
  }

  protected loadRelationshipsOptions(): void {
    this.hierarchieService
      .query()
      .pipe(map((res: HttpResponse<IHierarchie[]>) => res.body ?? []))
      .pipe(
        map((hierarchie: IHierarchie[]) =>
          this.hierarchieService.addHierarchieToCollectionIfMissing(hierarchie, this.editForm.get('hierarchieId')!.value)
        )
      )
      .subscribe((hierarchie: IHierarchie[]) => (this.hierarchie = hierarchie));

    this.augmentationService
      .query()
      .pipe(map((res: HttpResponse<IAugmentation[]>) => res.body ?? []))
      .pipe(
        map((augmentation: IAugmentation[]) =>
          this.augmentationService.addAugmentationToCollectionIfMissing(augmentation, this.editForm.get('augmentationId')!.value)
        )
      )
      .subscribe((augmentation: IAugmentation[]) => (this.augmentation = augmentation));
  }
  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAugmentationHierarchie>>): void {
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

  protected updateForm(augmentationHierarchie: IAugmentationHierarchie): void {
    this.editForm.patchValue({
      id: augmentationHierarchie.id,
      montant: augmentationHierarchie.montant,
      augmentationId: augmentationHierarchie.augmentationId,
      hierarchieId: augmentationHierarchie.hierarchieId,
      userInserId: augmentationHierarchie.userInserId,
      dateInsert: augmentationHierarchie.dateInsert ? augmentationHierarchie.dateInsert.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IAugmentationHierarchie {
    return {
      ...new AugmentationHierarchie(),
      id: this.editForm.get(['id'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      augmentationId: this.editForm.get(['augmentationId'])!.value?.id,
      hierarchieId: this.editForm.get(['hierarchieId'])!.value?.id,
      userInserId: this.editForm.get(['userInserId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
