import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPositionsAgent, PositionsAgent } from '../positions-agent.model';
import { PositionsAgentService } from '../service/positions-agent.service';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { ActesService } from 'app/entities/carriere/actes/service/actes.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';
import { ICategorieAgent } from 'app/entities/carriere/categorie-agent/categorie-agent.model';
import { CategorieAgentService } from 'app/entities/carriere/categorie-agent/service/categorie-agent.service';

@Component({
  selector: 'jhi-positions-agent-update',
  templateUrl: './positions-agent-update.component.html',
})
export class PositionsAgentUpdateComponent implements OnInit {
  isSaving = false;

  actesCollection: IActes[] = [];
  agentsSharedCollection: IAgent[] = [];
  categorieAgentsSharedCollection: ICategorieAgent[] = [];

  editForm = this.fb.group({
    id: [],
    motif: [],
    datePosition: [],
    dateAnnulation: [],
    dateFinAbsence: [],
    status: [],
    posistionsId: [],
    userInsertId: [],
    actes: [],
    agent: [],
    categorieAgent: [],
  });

  constructor(
    protected positionsAgentService: PositionsAgentService,
    protected actesService: ActesService,
    protected agentService: AgentService,
    protected categorieAgentService: CategorieAgentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ positionsAgent }) => {
      this.updateForm(positionsAgent);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const positionsAgent = this.createFromForm();
    if (positionsAgent.id !== undefined) {
      this.subscribeToSaveResponse(this.positionsAgentService.update(positionsAgent));
    } else {
      this.subscribeToSaveResponse(this.positionsAgentService.create(positionsAgent));
    }
  }

  trackActesById(_index: number, item: IActes): number {
    return item.id!;
  }

  trackAgentById(_index: number, item: IAgent): number {
    return item.id!;
  }

  trackCategorieAgentById(_index: number, item: ICategorieAgent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPositionsAgent>>): void {
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

  protected updateForm(positionsAgent: IPositionsAgent): void {
    this.editForm.patchValue({
      id: positionsAgent.id,
      motif: positionsAgent.motif,
      datePosition: positionsAgent.datePosition,
      dateAnnulation: positionsAgent.dateAnnulation,
      dateFinAbsence: positionsAgent.dateFinAbsence,
      status: positionsAgent.status,
      posistionsId: positionsAgent.posistionsId,
      userInsertId: positionsAgent.userInsertId,
      actes: positionsAgent.actes,
      agent: positionsAgent.agent,
      categorieAgent: positionsAgent.categorieAgent,
    });

    this.actesCollection = this.actesService.addActesToCollectionIfMissing(this.actesCollection, positionsAgent.actes);
    this.agentsSharedCollection = this.agentService.addAgentToCollectionIfMissing(this.agentsSharedCollection, positionsAgent.agent);
    this.categorieAgentsSharedCollection = this.categorieAgentService.addCategorieAgentToCollectionIfMissing(
      this.categorieAgentsSharedCollection,
      positionsAgent.categorieAgent
    );
  }

  protected loadRelationshipsOptions(): void {
    this.actesService
      .query({ filter: 'positionsagent-is-null' })
      .pipe(map((res: HttpResponse<IActes[]>) => res.body ?? []))
      .pipe(map((actes: IActes[]) => this.actesService.addActesToCollectionIfMissing(actes, this.editForm.get('actes')!.value)))
      .subscribe((actes: IActes[]) => (this.actesCollection = actes));

    this.agentService
      .query()
      .pipe(map((res: HttpResponse<IAgent[]>) => res.body ?? []))
      .pipe(map((agents: IAgent[]) => this.agentService.addAgentToCollectionIfMissing(agents, this.editForm.get('agent')!.value)))
      .subscribe((agents: IAgent[]) => (this.agentsSharedCollection = agents));

    this.categorieAgentService
      .query()
      .pipe(map((res: HttpResponse<ICategorieAgent[]>) => res.body ?? []))
      .pipe(
        map((categorieAgents: ICategorieAgent[]) =>
          this.categorieAgentService.addCategorieAgentToCollectionIfMissing(categorieAgents, this.editForm.get('categorieAgent')!.value)
        )
      )
      .subscribe((categorieAgents: ICategorieAgent[]) => (this.categorieAgentsSharedCollection = categorieAgents));
  }

  protected createFromForm(): IPositionsAgent {
    return {
      ...new PositionsAgent(),
      id: this.editForm.get(['id'])!.value,
      motif: this.editForm.get(['motif'])!.value,
      datePosition: this.editForm.get(['datePosition'])!.value,
      dateAnnulation: this.editForm.get(['dateAnnulation'])!.value,
      dateFinAbsence: this.editForm.get(['dateFinAbsence'])!.value,
      status: this.editForm.get(['status'])!.value,
      posistionsId: this.editForm.get(['posistionsId'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      actes: this.editForm.get(['actes'])!.value,
      agent: this.editForm.get(['agent'])!.value,
      categorieAgent: this.editForm.get(['categorieAgent'])!.value,
    };
  }
}
