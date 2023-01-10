import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IExclusionAugmentation, ExclusionAugmentation } from '../exclusion-augmentation.model';
import { ExclusionAugmentationService } from '../service/exclusion-augmentation.service';
import { IEtablissement } from '../../../etablissement/etablissement.model';
import { EtablissementService } from '../../../etablissement/service/etablissement.service';
import { IPostes } from '../../../postes/postes.model';
import { PostesService } from '../../../postes/service/postes.service';

@Component({
  selector: 'jhi-exclusion-augmentation-update',
  templateUrl: './exclusion-augmentation-update.component.html',
})
export class ExclusionAugmentationUpdateComponent implements OnInit {
  isSaving = false;
  etablissementSharedCollection: IEtablissement[] = [];
  postesSharedCollection: IPostes[] = [];

  editForm = this.fb.group({
    id: [],
    etablissementId: [null, [Validators.required]],
    posteId: [null, [Validators.required]],
    userInsertId: [],
    userUpdateId: [],
    dateInsertId: [],
    dateUpdateId: [],
  });

  constructor(
    protected exclusionAugmentationService: ExclusionAugmentationService,
    protected etablissementService: EtablissementService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exclusionAugmentation }) => {
      if (exclusionAugmentation.id === undefined) {
        const today = dayjs().startOf('day');
        exclusionAugmentation.dateInsertId = today;
        exclusionAugmentation.dateUpdateId = today;
      }

      this.updateForm(exclusionAugmentation);
    });
    this.loadPage();
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exclusionAugmentation = this.createFromForm();
    // exclusionAugmentation?.posteId=
    if (exclusionAugmentation.id !== undefined) {
      this.subscribeToSaveResponse(this.exclusionAugmentationService.update(exclusionAugmentation));
    } else {
      this.subscribeToSaveResponse(this.exclusionAugmentationService.create(exclusionAugmentation));
    }
  }

  protected loadPage(): any {
    this.etablissementService
      .findAll()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissement: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissement, this.editForm.get('etablissementId')!.value)
        )
      )
      .subscribe((etablissement: IEtablissement[]) => (this.etablissementSharedCollection = etablissement));

    this.postesService
      .queryList()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('posteId')!.value)))
      .subscribe((postes: IPostes[]) => (this.postesSharedCollection = postes));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExclusionAugmentation>>): void {
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

  protected updateForm(exclusionAugmentation: IExclusionAugmentation): void {
    this.editForm.patchValue({
      id: exclusionAugmentation.id,
      etablissementId: exclusionAugmentation.etablissementId,
      posteId: exclusionAugmentation.posteId,
      userInsertId: exclusionAugmentation.userInsertId,
      userUpdateId: exclusionAugmentation.userUpdateId,
      dateInsertId: exclusionAugmentation.dateInsertId ? exclusionAugmentation.dateInsertId.format(DATE_TIME_FORMAT) : null,
      dateUpdateId: exclusionAugmentation.dateUpdateId ? exclusionAugmentation.dateUpdateId.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IExclusionAugmentation {
    return {
      ...new ExclusionAugmentation(),
      id: this.editForm.get(['id'])!.value,
      etablissementId: this.editForm.get(['etablissementId'])!.value?.id,
      posteId: this.editForm.get(['posteId'])!.value?.id,
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
