import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEmoluments, Emoluments } from '../emoluments.model';
import { EmolumentsService } from '../service/emoluments.service';
import { IPostes } from 'app/entities/postes/postes.model';
import { PostesService } from 'app/entities/postes/service/postes.service';

@Component({
  selector: 'jhi-emoluments-update',
  templateUrl: './emoluments-update.component.html',
})
export class EmolumentsUpdateComponent implements OnInit {
  isSaving = false;
  titre = '';

  postesSharedCollection: IPostes[] = [];

  editForm = this.fb.group({
    id: [],
    codePoste: [],
    matricule: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    reference: [null, [Validators.required]],
    montant: [null, [Validators.required]],
    taux: [null, [Validators.required]],
    dateEffet: [],
    dateEcheance: [],
    agentId: [],
    etablissementId: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
    postes: [],
  });

  constructor(
    protected emolumentsService: EmolumentsService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ emoluments }) => {
      if (emoluments.id === undefined) {
        const today = dayjs().startOf('day');
        emoluments.dateInsert = today;
        emoluments.dateUpdate = today;
        this.titre = 'Ajouter Emolument';
      } else {
        this.titre = 'Modifier Emolument';
      }

      this.updateForm(emoluments);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const emoluments = this.createFromForm();
    if (emoluments.id !== undefined) {
      this.subscribeToSaveResponse(this.emolumentsService.update(emoluments));
    } else {
      this.subscribeToSaveResponse(this.emolumentsService.create(emoluments));
    }
  }

  trackPostesById(_index: number, item: IPostes): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmoluments>>): void {
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

  protected updateForm(emoluments: IEmoluments): void {
    this.editForm.patchValue({
      id: emoluments.id,
      codePoste: emoluments.codePoste,
      matricule: emoluments.matricule,
      reference: emoluments.reference,
      montant: emoluments.montant,
      taux: emoluments.taux,
      dateEffet: emoluments.dateEffet,
      dateEcheance: emoluments.dateEcheance,
      agentId: emoluments.agentId,
      etablissementId: emoluments.etablissementId,
      userInsertId: emoluments.userInsertId,
      userUpdateId: emoluments.userUpdateId,
      dateInsert: emoluments.dateInsert ? emoluments.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: emoluments.dateUpdate ? emoluments.dateUpdate.format(DATE_TIME_FORMAT) : null,
      postes: emoluments.postes,
    });

    this.postesSharedCollection = this.postesService.addPostesToCollectionIfMissing(this.postesSharedCollection, emoluments.postes);
  }

  protected loadRelationshipsOptions(): void {
    this.postesService
      .query()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('postes')!.value)))
      .subscribe((postes: IPostes[]) => (this.postesSharedCollection = postes));
  }

  protected createFromForm(): IEmoluments {
    return {
      ...new Emoluments(),
      id: this.editForm.get(['id'])!.value,
      codePoste: this.editForm.get(['codePoste'])!.value,
      matricule: this.editForm.get(['matricule'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      taux: this.editForm.get(['taux'])!.value,
      dateEffet: this.editForm.get(['dateEffet'])!.value,
      dateEcheance: this.editForm.get(['dateEcheance'])!.value,
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
