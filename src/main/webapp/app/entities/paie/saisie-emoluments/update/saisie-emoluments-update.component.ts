import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISaisieEmoluments, SaisieEmoluments } from '../saisie-emoluments.model';
import { SaisieEmolumentsService } from '../service/saisie-emoluments.service';
import { IPeriodePaye } from 'app/entities/paie/periode-paye/periode-paye.model';
import { PeriodePayeService } from 'app/entities/paie/periode-paye/service/periode-paye.service';
import { IPostes } from 'app/entities/postes/postes.model';
import { PostesService } from 'app/entities/postes/service/postes.service';
import { IEmoluments } from '../../emoluments/emoluments.model';
import { EmolumentsService } from '../../emoluments/service/emoluments.service';

@Component({
  selector: 'jhi-saisie-emoluments-update',
  templateUrl: './saisie-emoluments-update.component.html',
})
export class SaisieEmolumentsUpdateComponent implements OnInit {
  isSaving = false;
  isAjout!: boolean;

  periodePayesSharedCollection: IPeriodePaye[] = [];
  postesSharedCollection: IPostes[] = [];
  titre = '';
  keyword = 'prenom';
  public agents: any;
  emoluments!: IEmoluments;
  emolument!: IEmoluments[];

  editForm = this.fb.group({
    id: [],
    codePoste: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    matricule: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    reference: [null, [Validators.required]],
    montant: [null, [Validators.required]],
    taux: [null, [Validators.required]],
    dateEffet: [null, [Validators.required]],
    dateEcheance: [null, [Validators.required]],
    statut: [null, [Validators.required]],
    agentId: [],
    etablissementId: [null, [Validators.required]],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
    periodePaye: [],
    postes: [],
  });

  constructor(
    protected saisieEmolumentsService: SaisieEmolumentsService,
    protected emolumentsService: EmolumentsService,
    protected periodePayeService: PeriodePayeService,
    protected postesService: PostesService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ saisieEmoluments }) => {
      if (saisieEmoluments.id === undefined) {
        const today = dayjs().startOf('day');
        saisieEmoluments.dateInsert = today;
        saisieEmoluments.dateUpdate = today;
        this.titre = 'Ajouter Emoluments';
      } else {
        this.titre = 'Modifier Emoluments';
      }

      this.updateForm(saisieEmoluments);

      this.loadRelationshipsOptions();
    });
  }
  veuxAjouter(): void {
    if (this.isAjout === false) {
      this.isAjout = true;
      console.error('testtest');
    } else {
      this.isAjout = false;
      console.error('TEST');
    }
  }

  previousState(): void {
    window.history.back();
  }
  selectEvent(item: any): any {
    // this.idEtablissement = item;
  }

  onChangeSearch(search: string): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any): any {
    // do something
  }

  save(): void {
    this.isSaving = true;
    const saisieEmoluments = this.createFromForm();
    if (saisieEmoluments.id !== undefined) {
      this.subscribeToSaveResponse(this.saisieEmolumentsService.update(saisieEmoluments));
    } else {
      this.subscribeToSaveResponse(this.saisieEmolumentsService.create(saisieEmoluments));
    }
  }
  chargerInfos(emolument: IEmoluments): void {
    if (emolument.id) {
      this.emolumentsService.findByEmolument(emolument.id).subscribe((result: any) => {
        this.emoluments = result.body;
      });
    }
  }

  getAgentByMatricule(matricule: any): void {
    this.emolumentsService.findEmolumentsByMatricule(matricule).subscribe((result: any) => {
      this.emoluments = result.body;
      this.emolument = result.body;
    });
  }
  trackPeriodePayeById(_index: number, item: IPeriodePaye): number {
    return item.id!;
  }

  trackPostesById(_index: number, item: IPostes): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISaisieEmoluments>>): void {
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

  protected updateForm(saisieEmoluments: ISaisieEmoluments): void {
    this.editForm.patchValue({
      id: saisieEmoluments.id,
      codePoste: saisieEmoluments.codePoste,
      matricule: saisieEmoluments.matricule,
      reference: saisieEmoluments.reference,
      montant: saisieEmoluments.montant,
      taux: saisieEmoluments.taux,
      dateEffet: saisieEmoluments.dateEffet,
      dateEcheance: saisieEmoluments.dateEcheance,
      statut: saisieEmoluments.statut,
      agentId: saisieEmoluments.agentId,
      etablissementId: saisieEmoluments.etablissementId,
      userInsertId: saisieEmoluments.userInsertId,
      userUpdateId: saisieEmoluments.userUpdateId,
      dateInsert: saisieEmoluments.dateInsert ? saisieEmoluments.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: saisieEmoluments.dateUpdate ? saisieEmoluments.dateUpdate.format(DATE_TIME_FORMAT) : null,
      periodePaye: saisieEmoluments.periodePaye,
      posteId: this.editForm.get(['postes'])!.value.id!,
    });

    //this.postesSharedCollection = this.postesService.addPostesToCollectionIfMissing(this.postesSharedCollection, saisieEmoluments.postes);
  }

  protected loadRelationshipsOptions(): void {
    this.postesService
      .query()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('postes')!.value)))
      .subscribe((postes: IPostes[]) => (this.postesSharedCollection = postes));
  }

  protected createFromForm(): ISaisieEmoluments {
    return {
      ...new SaisieEmoluments(),
      id: this.editForm.get(['id'])!.value,
      codePoste: this.editForm.get(['codePoste'])!.value,
      matricule: this.editForm.get(['matricule'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      taux: this.editForm.get(['taux'])!.value,
      dateEffet: this.editForm.get(['dateEffet'])!.value,
      dateEcheance: this.editForm.get(['dateEcheance'])!.value,
      statut: this.editForm.get(['statut'])!.value,
      agentId: this.editForm.get(['agentId'])!.value,
      etablissementId: this.editForm.get(['etablissementId'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      periodePaye: this.editForm.get(['periodePaye'])!.value,
      posteId: this.editForm.get(['postes'])!.value.id!,
    };
  }
}
