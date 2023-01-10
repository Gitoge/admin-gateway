import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISituationFamiliale, SituationFamiliale } from '../situation-familiale.model';
import { SituationFamilialeService } from '../service/situation-familiale.service';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { ActesService } from 'app/entities/carriere/actes/service/actes.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';

@Component({
  selector: 'jhi-situation-familiale-update',
  templateUrl: './situation-familiale-update.component.html',
})
export class SituationFamilialeUpdateComponent implements OnInit {
  isSaving = false;

  actesCollection: IActes[] = [];
  agentsSharedCollection: IAgent[] = [];

  editForm = this.fb.group({
    id: [],
    situationMatrimoniale: [null, [Validators.required]],
    nombreEpouse: [],
    codeTravailConjoint: [],
    nombreEnfant: [],
    nombrePart: [],
    nombreEnfantImposable: [],
    nombreEnfantMajeur: [],
    nombreMinimumFiscal: [],
    nombreEnfantDecede: [],
    dateModification: [],
    status: [],
    userInsertId: [],
    actes: [],
    agent: [],
  });

  constructor(
    protected situationFamilialeService: SituationFamilialeService,
    protected actesService: ActesService,
    protected agentService: AgentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ situationFamiliale }) => {
      if (situationFamiliale.id === undefined) {
        const today = dayjs().startOf('day');
        situationFamiliale.dateModification = today;
      }

      this.updateForm(situationFamiliale);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const situationFamiliale = this.createFromForm();
    if (situationFamiliale.id !== undefined) {
      this.subscribeToSaveResponse(this.situationFamilialeService.update(situationFamiliale));
    } else {
      this.subscribeToSaveResponse(this.situationFamilialeService.create(situationFamiliale));
    }
  }

  trackActesById(_index: number, item: IActes): number {
    return item.id!;
  }

  trackAgentById(_index: number, item: IAgent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISituationFamiliale>>): void {
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

  protected updateForm(situationFamiliale: ISituationFamiliale): void {
    this.editForm.patchValue({
      id: situationFamiliale.id,
      situationMatrimoniale: situationFamiliale.situationMatrimoniale,
      nombreEpouse: situationFamiliale.nombreEpouse,
      codeTravailConjoint: situationFamiliale.codeTravailConjoint,
      nombreEnfant: situationFamiliale.nombreEnfant,
      nombrePart: situationFamiliale.nombrePart,
      nombreEnfantImposable: situationFamiliale.nombreEnfantImposable,
      nombreEnfantMajeur: situationFamiliale.nombreEnfantMajeur,
      nombreMinimumFiscal: situationFamiliale.nombreMinimumFiscal,
      nombreEnfantDecede: situationFamiliale.nombreEnfantDecede,
      dateModification: situationFamiliale.dateModification ? situationFamiliale.dateModification.format(DATE_TIME_FORMAT) : null,
      status: situationFamiliale.status,
      userInsertId: situationFamiliale.userInsertId,
      actes: situationFamiliale.actes,
      agent: situationFamiliale.agent,
    });

    this.actesCollection = this.actesService.addActesToCollectionIfMissing(this.actesCollection, situationFamiliale.actes);
    this.agentsSharedCollection = this.agentService.addAgentToCollectionIfMissing(this.agentsSharedCollection, situationFamiliale.agent);
  }

  protected loadRelationshipsOptions(): void {
    this.actesService
      .query({ filter: 'situationfamiliale-is-null' })
      .pipe(map((res: HttpResponse<IActes[]>) => res.body ?? []))
      .pipe(map((actes: IActes[]) => this.actesService.addActesToCollectionIfMissing(actes, this.editForm.get('actes')!.value)))
      .subscribe((actes: IActes[]) => (this.actesCollection = actes));

    this.agentService
      .query()
      .pipe(map((res: HttpResponse<IAgent[]>) => res.body ?? []))
      .pipe(map((agents: IAgent[]) => this.agentService.addAgentToCollectionIfMissing(agents, this.editForm.get('agent')!.value)))
      .subscribe((agents: IAgent[]) => (this.agentsSharedCollection = agents));
  }

  protected createFromForm(): ISituationFamiliale {
    return {
      ...new SituationFamiliale(),
      id: this.editForm.get(['id'])!.value,
      situationMatrimoniale: this.editForm.get(['situationMatrimoniale'])!.value,
      nombreEpouse: this.editForm.get(['nombreEpouse'])!.value,
      codeTravailConjoint: this.editForm.get(['codeTravailConjoint'])!.value,
      nombreEnfant: this.editForm.get(['nombreEnfant'])!.value,
      nombrePart: this.editForm.get(['nombrePart'])!.value,
      nombreEnfantImposable: this.editForm.get(['nombreEnfantImposable'])!.value,
      nombreEnfantMajeur: this.editForm.get(['nombreEnfantMajeur'])!.value,
      nombreMinimumFiscal: this.editForm.get(['nombreMinimumFiscal'])!.value,
      nombreEnfantDecede: this.editForm.get(['nombreEnfantDecede'])!.value,
      dateModification: this.editForm.get(['dateModification'])!.value
        ? dayjs(this.editForm.get(['dateModification'])!.value, DATE_TIME_FORMAT)
        : undefined,
      status: this.editForm.get(['status'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      actes: this.editForm.get(['actes'])!.value,
      agent: this.editForm.get(['agent'])!.value,
    };
  }
}
