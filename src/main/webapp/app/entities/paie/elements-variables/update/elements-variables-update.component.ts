import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IElementsVariables, ElementsVariables } from '../elements-variables.model';
import { ElementsVariablesService } from '../service/elements-variables.service';
import { IPostes } from 'app/entities/paie/postes/postes.model';
import { PostesService } from 'app/entities/paie/postes/service/postes.service';

@Component({
  selector: 'jhi-elements-variables-update',
  templateUrl: './elements-variables-update.component.html',
})
export class ElementsVariablesUpdateComponent implements OnInit {
  isSaving = false;

  postesSharedCollection: IPostes[] = [];

  editForm = this.fb.group({
    id: [],
    codePoste: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    matricule: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    reference: [null, [Validators.required]],
    montant: [null, [Validators.required]],
    taux: [null, [Validators.required]],
    dateDebut: [null, [Validators.required]],
    dateEcheance: [null, [Validators.required]],
    periode: [null, [Validators.required]],
    statut: [null, [Validators.required]],
    agentId: [null, [Validators.required]],
    etablissementId: [null, [Validators.required]],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
    postes: [],
  });

  constructor(
    protected elementsVariablesService: ElementsVariablesService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ elementsVariables }) => {
      if (elementsVariables.id === undefined) {
        const today = dayjs().startOf('day');
        elementsVariables.dateInsert = today;
        elementsVariables.dateUpdate = today;
      }

      this.updateForm(elementsVariables);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const elementsVariables = this.createFromForm();
    if (elementsVariables.id !== undefined) {
      this.subscribeToSaveResponse(this.elementsVariablesService.update(elementsVariables));
    } else {
      this.subscribeToSaveResponse(this.elementsVariablesService.create(elementsVariables));
    }
  }

  trackPostesById(_index: number, item: IPostes): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IElementsVariables>>): void {
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

  protected updateForm(elementsVariables: IElementsVariables): void {
    this.editForm.patchValue({
      id: elementsVariables.id,
      codePoste: elementsVariables.codePoste,
      matricule: elementsVariables.matricule,
      reference: elementsVariables.reference,
      montant: elementsVariables.montant,
      taux: elementsVariables.taux,
      dateDebut: elementsVariables.dateDebut,
      dateEcheance: elementsVariables.dateEcheance,
      periode: elementsVariables.periode,
      statut: elementsVariables.statut,
      agentId: elementsVariables.agentId,
      etablissementId: elementsVariables.etablissementId,
      userInsertId: elementsVariables.userInsertId,
      userUpdateId: elementsVariables.userUpdateId,
      dateInsert: elementsVariables.dateInsert ? elementsVariables.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: elementsVariables.dateUpdate ? elementsVariables.dateUpdate.format(DATE_TIME_FORMAT) : null,
      postes: elementsVariables.postes,
    });

    this.postesSharedCollection = this.postesService.addPostesToCollectionIfMissing(this.postesSharedCollection, elementsVariables.postes);
  }

  protected loadRelationshipsOptions(): void {
    this.postesService
      .query()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('postes')!.value)))
      .subscribe((postes: IPostes[]) => (this.postesSharedCollection = postes));
  }

  protected createFromForm(): IElementsVariables {
    return {
      ...new ElementsVariables(),
      id: this.editForm.get(['id'])!.value,
      codePoste: this.editForm.get(['codePoste'])!.value,
      matricule: this.editForm.get(['matricule'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      taux: this.editForm.get(['taux'])!.value,
      dateDebut: this.editForm.get(['dateDebut'])!.value,
      dateEcheance: this.editForm.get(['dateEcheance'])!.value,
      periode: this.editForm.get(['periode'])!.value,
      statut: this.editForm.get(['statut'])!.value,
      agentId: this.editForm.get(['agentId'])!.value,
      etablissementId: this.editForm.get(['etablissementId'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      postes: this.editForm.get(['postes'])!.value,
    };
  }
}
