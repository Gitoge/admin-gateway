import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAvancement, Avancement } from '../avancement.model';
import { AvancementService } from '../service/avancement.service';
import { AgentService } from '../../agent/service/agent.service';
import { GradeService } from 'app/entities/grade/service/grade.service';
import { HierarchieService } from 'app/entities/hierarchie/service/hierarchie.service';
import { EchelonService } from 'app/entities/echelon/service/echelon.service';
import { IEchelon } from 'app/entities/echelon/echelon.model';
import { IGrade } from 'app/entities/grade/grade.model';
import { IHierarchie } from 'app/entities/hierarchie/hierarchie.model';
import { ISituationAdministrative, SituationAdministrative } from '../../situation-administrative/situation-administrative.model';
import { SituationAdministrativeService } from '../../situation-administrative/service/situation-administrative.service';
import { IndicesService } from '../../indices/service/indices.service';
import { IIndices } from '../../indices/indices.model';
import { IAgence } from 'app/entities/agence/agence.model';
import { IAgent } from '../../agent/agent.model';

@Component({
  selector: 'jhi-avancement-update',
  templateUrl: './avancement-update.component.html',
})
export class AvancementUpdateComponent implements OnInit {
  isSaving = false;

  avancement!: IAvancement;

  agents!: IAgent[];

  agent!: IAgent;

  matricule: string | undefined;

  situationAdministrative!: ISituationAdministrative;

  echelonSharedCollection: IEchelon[] = [];

  hierarchieSharedCollection: IHierarchie[] = [];

  gradeSharedCollection: IGrade[] = [];

  indicesSharedCollection: IIndices[] = [];

  situationAdministrativeSharedCollection: ISituationAdministrative[] = [];

  constructor(
    protected avancementService: AvancementService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    public agentService: AgentService,
    public gradeService: GradeService,
    public indiceService: IndicesService,
    public hierarchieService: HierarchieService,
    public echelonService: EchelonService,
    public situationAdministrativeService: SituationAdministrativeService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ avancement }) => {
      this.avancement = avancement;
    });
    this.loadRelationshipsOptions();
  }

  previousState(): void {
    window.history.back();
  }

  getSelectedMatricule(matricule: any): void {
    this.agent = matricule;
    this.matricule = this.agent.matricule;
    if (matricule === null || matricule === undefined) {
      this.avancement.ancienEchelonCode = undefined;
      this.avancement.ancienGradeCode = undefined;
      this.avancement.ancienHierarchieCode = undefined;
      this.avancement.ancienIndice = undefined;
    } else {
      this.situationAdministrativeService.findByAgent(matricule.id).subscribe((situationAdministrative: any) => {
        this.situationAdministrative = situationAdministrative.body;
        if (this.situationAdministrative.gradeId) {
          this.gradeService.find(this.situationAdministrative.gradeId).subscribe((grade: any) => {
            this.avancement.ancienGradeCode = grade.body.code;
          });
        }

        if (this.situationAdministrative.hierarchieId) {
          this.hierarchieService.find(this.situationAdministrative.hierarchieId).subscribe((hierarchie: any) => {
            this.avancement.ancienHierarchieCode = hierarchie.body.libelle;
          });
        }

        if (this.situationAdministrative.echelonId) {
          this.echelonService.find(this.situationAdministrative.echelonId).subscribe((echelon: any) => {
            this.avancement.ancienEchelonCode = echelon.body.libelle;
          });
        }

        if (this.situationAdministrative.indice) {
          if (this.situationAdministrative.indice.id) {
            this.indiceService.find(this.situationAdministrative.indice?.id).subscribe((indice: any) => {
              this.avancement.ancienIndice = indice.body.libelle;
            });
          }
        }
      });
    }
    console.error(this.avancement);
  }

  save(): void {
    this.isSaving = true;
    this.avancement.matricule = this.matricule;
    const avancement = this.avancement;
    console.error(avancement);
    if (avancement.id !== undefined) {
      this.subscribeToSaveResponse(this.avancementService.update(avancement));
    } else {
      this.subscribeToSaveResponse(this.avancementService.create(avancement));
    }
  }

  protected loadRelationshipsOptions(): void {
    this.echelonService
      .findAll()
      .pipe(map((res: HttpResponse<IEchelon[]>) => res.body ?? []))
      .pipe(map((echelon: IEchelon[]) => this.echelonService.addEchelonToCollectionIfMissing(echelon)))
      .subscribe((echelon: IEchelon[]) => (this.echelonSharedCollection = echelon));

    this.gradeService
      .findAll()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grade: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing(grade)))
      .subscribe((grade: IGrade[]) => (this.gradeSharedCollection = grade));

    this.hierarchieService
      .findAll()
      .pipe(map((res: HttpResponse<IHierarchie[]>) => res.body ?? []))
      .pipe(map((hierarchie: IHierarchie[]) => this.hierarchieService.addHierarchieToCollectionIfMissing(hierarchie)))
      .subscribe((hierarchie: IHierarchie[]) => (this.hierarchieSharedCollection = hierarchie));

    this.situationAdministrativeService
      .findAll()
      .pipe(map((res: HttpResponse<ISituationAdministrative[]>) => res.body ?? []))
      .pipe(
        map((sta: ISituationAdministrative[]) => this.situationAdministrativeService.addSituationAdministrativeToCollectionIfMissing(sta))
      )
      .subscribe((sta: ISituationAdministrative[]) => (this.situationAdministrativeSharedCollection = sta));

    this.indiceService
      .findAll()
      .pipe(map((res: HttpResponse<IIndices[]>) => res.body ?? []))
      .pipe(map((indices: IIndices[]) => this.indiceService.addIndicesToCollectionIfMissing(indices)))
      .subscribe((indices: IIndices[]) => (this.indicesSharedCollection = indices));

    this.agentService
      .findAll()
      .pipe(map((res: HttpResponse<IAgent[]>) => res.body ?? []))
      .pipe(map((agent: IAgent[]) => this.agentService.addAgentToCollectionIfMissing(agent)))
      .subscribe((agent: IAgent[]) => (this.agents = agent));
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAvancement>>): void {
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
}
