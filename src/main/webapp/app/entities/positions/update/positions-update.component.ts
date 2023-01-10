import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPositions, Positions } from '../positions.model';
import { PositionsService } from '../service/positions.service';
import { ITypePosition } from 'app/entities/type-position/type-position.model';
import { TypePositionService } from 'app/entities/type-position/service/type-position.service';

@Component({
  selector: 'jhi-positions-update',
  templateUrl: './positions-update.component.html',
})
export class PositionsUpdateComponent implements OnInit {
  isSaving = false;
  titre!: string;
  typePositionsSharedCollection: ITypePosition[] = [];

  editForm = this.fb.group({
    id: [],
    code: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(2), Validators.pattern('^[Z0-9]*$')]],
    libelle: [null, [Validators.required]],
    description: [],
    typeAgent: [],
    impactSolde: [],
    statutPosition: [],
    typeposition: [],
  });
  statutPosition!: boolean;

  constructor(
    protected positionsService: PositionsService,
    protected typePositionService: TypePositionService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ positions }) => {
      this.updateForm(positions);
      if (positions.id !== undefined && positions.id !== null) {
        this.titre = 'Modifier cette position ';
      } else {
        this.titre = 'Ajouter une position';
      }
      this.statutPosition = true;

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const positions = this.createFromForm();
    positions.statutPosition = this.statutPosition;
    if (positions.id !== undefined) {
      this.subscribeToSaveResponse(this.positionsService.update(positions));
    } else {
      this.subscribeToSaveResponse(this.positionsService.create(positions));
    }
  }

  trackTypePositionById(_index: number, item: ITypePosition): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPositions>>): void {
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

  protected updateForm(positions: IPositions): void {
    this.editForm.patchValue({
      id: positions.id,
      code: positions.code,
      libelle: positions.libelle,
      description: positions.description,
      typeAgent: positions.typeAgent,
      impactSolde: positions.impactSolde,
      statutPosition: positions.statutPosition,
      typeposition: positions.typeposition,
    });

    this.typePositionsSharedCollection = this.typePositionService.addTypePositionToCollectionIfMissing(
      this.typePositionsSharedCollection,
      positions.typeposition
    );
  }

  protected loadRelationshipsOptions(): void {
    this.typePositionService
      .query()
      .pipe(map((res: HttpResponse<ITypePosition[]>) => res.body ?? []))
      .pipe(
        map((typePositions: ITypePosition[]) =>
          this.typePositionService.addTypePositionToCollectionIfMissing(typePositions, this.editForm.get('typeposition')!.value)
        )
      )
      .subscribe((typePositions: ITypePosition[]) => (this.typePositionsSharedCollection = typePositions));
  }

  protected createFromForm(): IPositions {
    return {
      ...new Positions(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,
      description: this.editForm.get(['description'])!.value,
      typeAgent: this.editForm.get(['typeAgent'])!.value,
      impactSolde: this.editForm.get(['impactSolde'])!.value,
      statutPosition: this.editForm.get(['statutPosition'])!.value,
      typeposition: this.editForm.get(['typeposition'])!.value,
    };
  }
}
