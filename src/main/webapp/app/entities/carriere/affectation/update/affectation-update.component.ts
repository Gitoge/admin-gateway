import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAffectation, Affectation } from '../affectation.model';
import { AffectationService } from '../service/affectation.service';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { ActesService } from 'app/entities/carriere/actes/service/actes.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';

@Component({
  selector: 'jhi-affectation-update',
  templateUrl: './affectation-update.component.html',
})
export class AffectationUpdateComponent implements OnInit {
  isSaving = false;

  actesCollection: IActes[] = [];
  agentsSharedCollection: IAgent[] = [];

  editForm = this.fb.group({
    id: [],
    motif: [],
    dateAffectation: [],
    dateEffet: [],
    datefin: [],
    status: [],
    servicesId: [],
    emploisId: [],
    userInsertId: [],
    actes: [],
    agent: [],
  });

  constructor(
    protected affectationService: AffectationService,
    protected actesService: ActesService,
    protected agentService: AgentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ affectation }) => {
      this.updateForm(affectation);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const affectation = this.createFromForm();
    if (affectation.id !== undefined) {
      this.subscribeToSaveResponse(this.affectationService.update(affectation));
    } else {
      this.subscribeToSaveResponse(this.affectationService.create(affectation));
    }
  }

  trackActesById(_index: number, item: IActes): number {
    return item.id!;
  }

  trackAgentById(_index: number, item: IAgent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAffectation>>): void {
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

  protected updateForm(affectation: IAffectation): void {
    this.editForm.patchValue({
      id: affectation.id,
      motif: affectation.motif,
      dateAffectation: affectation.dateAffectation,
      dateEffet: affectation.dateEffet,
      datefin: affectation.datefin,
      status: affectation.status,
      servicesId: affectation.servicesId,
      emploisId: affectation.emploisId,
      userInsertId: affectation.userInsertId,
      actes: affectation.actes,
      agent: affectation.agent,
    });

    this.actesCollection = this.actesService.addActesToCollectionIfMissing(this.actesCollection, affectation.actes);
    this.agentsSharedCollection = this.agentService.addAgentToCollectionIfMissing(this.agentsSharedCollection, affectation.agent);
  }

  protected loadRelationshipsOptions(): void {
    this.actesService
      .query({ filter: 'affectation-is-null' })
      .pipe(map((res: HttpResponse<IActes[]>) => res.body ?? []))
      .pipe(map((actes: IActes[]) => this.actesService.addActesToCollectionIfMissing(actes, this.editForm.get('actes')!.value)))
      .subscribe((actes: IActes[]) => (this.actesCollection = actes));

    this.agentService
      .query()
      .pipe(map((res: HttpResponse<IAgent[]>) => res.body ?? []))
      .pipe(map((agents: IAgent[]) => this.agentService.addAgentToCollectionIfMissing(agents, this.editForm.get('agent')!.value)))
      .subscribe((agents: IAgent[]) => (this.agentsSharedCollection = agents));
  }

  protected createFromForm(): IAffectation {
    return {
      ...new Affectation(),
      id: this.editForm.get(['id'])!.value,
      motif: this.editForm.get(['motif'])!.value,
      dateAffectation: this.editForm.get(['dateAffectation'])!.value,
      dateEffet: this.editForm.get(['dateEffet'])!.value,
      datefin: this.editForm.get(['datefin'])!.value,
      status: this.editForm.get(['status'])!.value,
      servicesId: this.editForm.get(['servicesId'])!.value,
      emploisId: this.editForm.get(['emploisId'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      actes: this.editForm.get(['actes'])!.value,
      agent: this.editForm.get(['agent'])!.value,
    };
  }
}
