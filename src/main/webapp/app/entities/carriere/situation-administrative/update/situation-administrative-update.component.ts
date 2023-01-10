import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISituationAdministrative, SituationAdministrative } from '../situation-administrative.model';
import { SituationAdministrativeService } from '../service/situation-administrative.service';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { ActesService } from 'app/entities/carriere/actes/service/actes.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';
import { ICategorieAgent } from 'app/entities/carriere/categorie-agent/categorie-agent.model';
import { CategorieAgentService } from 'app/entities/carriere/categorie-agent/service/categorie-agent.service';

@Component({
  selector: 'jhi-situation-administrative-update',
  templateUrl: './situation-administrative-update.component.html',
})
export class SituationAdministrativeUpdateComponent implements OnInit {
  isSaving = false;

  actesCollection: IActes[] = [];
  agentsSharedCollection: IAgent[] = [];
  categorieAgentsSharedCollection: ICategorieAgent[] = [];

  editForm = this.fb.group({
    id: [],
    dateRecrutement: [null, [Validators.required]],
    numeroRecrutement: [null, [Validators.required]],
    datePriseRang: [],
    numeroOrdreService: [],
    dateOrdreService: [],
    loge: [],
    logementFonction: [],
    datedebut: [],
    datefin: [],
    numeroCompte: [],
    status: [],
    corpsId: [],
    hierarchieId: [],
    cadreId: [],
    gradeId: [],
    echelonId: [],
    classeId: [],
    reglementId: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
    actes: [],
    agent: [],
    categorieAgent: [],
    etablissementId: [],
  });

  constructor(
    protected situationAdministrativeService: SituationAdministrativeService,
    protected actesService: ActesService,
    protected agentService: AgentService,
    protected categorieAgentService: CategorieAgentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ situationAdministrative }) => {
      if (situationAdministrative.id === undefined) {
        const today = dayjs().startOf('day');
        situationAdministrative.dateInsert = today;
        situationAdministrative.dateUpdate = today;
      }

      this.updateForm(situationAdministrative);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const situationAdministrative = this.createFromForm();
    if (situationAdministrative.id !== undefined) {
      this.subscribeToSaveResponse(this.situationAdministrativeService.update(situationAdministrative));
    } else {
      this.subscribeToSaveResponse(this.situationAdministrativeService.create(situationAdministrative));
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISituationAdministrative>>): void {
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

  protected updateForm(situationAdministrative: ISituationAdministrative): void {
    this.editForm.patchValue({
      id: situationAdministrative.id,
      dateRecrutement: situationAdministrative.dateRecrutement,
      numeroRecrutement: situationAdministrative.numeroRecrutement,
      datePriseRang: situationAdministrative.datePriseRang,
      numeroOrdreService: situationAdministrative.numeroOrdreService,
      dateOrdreService: situationAdministrative.dateOrdreService,
      loge: situationAdministrative.loge,
      logementFonction: situationAdministrative.logementFonction,
      datedebut: situationAdministrative.datedebut,
      datefin: situationAdministrative.datefin,
      numeroCompte: situationAdministrative.numeroCompte,
      status: situationAdministrative.status,
      corpsId: situationAdministrative.corpsId,
      hierarchieId: situationAdministrative.hierarchieId,
      cadreId: situationAdministrative.cadreId,
      gradeId: situationAdministrative.gradeId,
      echelonId: situationAdministrative.echelonId,
      classeId: situationAdministrative.classeId,
      reglementId: situationAdministrative.reglementId,
      userInsertId: situationAdministrative.userInsertId,
      userUpdateId: situationAdministrative.userUpdateId,
      dateInsert: situationAdministrative.dateInsert ? situationAdministrative.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: situationAdministrative.dateUpdate ? situationAdministrative.dateUpdate.format(DATE_TIME_FORMAT) : null,
      actes: situationAdministrative.actes,
      agent: situationAdministrative.agent,
      categorieAgent: situationAdministrative.categorieAgent,
    });

    this.actesCollection = this.actesService.addActesToCollectionIfMissing(this.actesCollection, situationAdministrative.actes);
    this.agentsSharedCollection = this.agentService.addAgentToCollectionIfMissing(
      this.agentsSharedCollection,
      situationAdministrative.agent
    );
    this.categorieAgentsSharedCollection = this.categorieAgentService.addCategorieAgentToCollectionIfMissing(
      this.categorieAgentsSharedCollection,
      situationAdministrative.categorieAgent
    );
  }

  protected loadRelationshipsOptions(): void {
    this.actesService
      .query({ filter: 'situationadministrative-is-null' })
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

  protected createFromForm(): ISituationAdministrative {
    return {
      ...new SituationAdministrative(),
      id: this.editForm.get(['id'])!.value,
      dateRecrutement: this.editForm.get(['dateRecrutement'])!.value,
      numeroRecrutement: this.editForm.get(['numeroRecrutement'])!.value,
      datePriseRang: this.editForm.get(['datePriseRang'])!.value,
      numeroOrdreService: this.editForm.get(['numeroOrdreService'])!.value,
      dateOrdreService: this.editForm.get(['dateOrdreService'])!.value,
      loge: this.editForm.get(['loge'])!.value,
      logementFonction: this.editForm.get(['logementFonction'])!.value,
      datedebut: this.editForm.get(['datedebut'])!.value,
      datefin: this.editForm.get(['datefin'])!.value,
      numeroCompte: this.editForm.get(['numeroCompte'])!.value,
      status: this.editForm.get(['status'])!.value,
      corpsId: this.editForm.get(['corpsId'])!.value,
      hierarchieId: this.editForm.get(['hierarchieId'])!.value,
      cadreId: this.editForm.get(['cadreId'])!.value,
      gradeId: this.editForm.get(['gradeId'])!.value,
      echelonId: this.editForm.get(['echelonId'])!.value,
      etablissementId: this.editForm.get(['etablissementId'])!.value,
      classeId: this.editForm.get(['classeId'])!.value,
      reglementId: this.editForm.get(['reglementId'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      actes: this.editForm.get(['actes'])!.value,
      agent: this.editForm.get(['agent'])!.value,
      categorieAgent: this.editForm.get(['categorieAgent'])!.value,
    };
  }
}
