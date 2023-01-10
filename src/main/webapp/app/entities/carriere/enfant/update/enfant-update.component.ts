import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, finalize, map } from 'rxjs/operators';

import { IEnfant, Enfant } from '../enfant.model';
import { EnfantService } from '../service/enfant.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';
import { TableValeurService } from 'app/entities/table-valeur/service/table-valeur.service';
import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';

@Component({
  selector: 'jhi-enfant-update',
  templateUrl: './enfant-update.component.html',
})
export class EnfantUpdateComponent implements OnInit {
  isSaving = false;
  titre?: string;

  keywordMatricule = 'matricule';

  agentsSharedCollection: IAgent[] = [];

  lienParente!: ITableValeur[];

  genre!: ITableValeur[];

  isEnfant!: boolean;

  today!: any;

  editForm = this.fb.group({
    id: [],
    matriculeParent: [],
    nom: [null, [Validators.required]],
    prenom: [null, [Validators.required]],
    sexe: [null, [Validators.required]],
    nin: [],
    lienParente: [null, [Validators.required]],
    dateNaissance: [null, [Validators.required]],
    lieuNaissance: [null, [Validators.required]],
    numeroActeNaissance: [],
    dateActeNaissance: [],
    rangEnfant: [],
    codeAge: [],
    enfantEnVie: [],
    enfantImposable: [],
    userInsertId: [],
    agent: [],
  });

  constructor(
    protected enfantService: EnfantService,
    protected agentService: AgentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected tableValeurService: TableValeurService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ enfant }) => {
      if (enfant?.id !== undefined) {
        this.titre = 'Modifier membre de la famille';
      } else {
        this.titre = 'Ajouter un membre de la famille';
      }
      this.updateForm(enfant);
      this.loadRelationshipsOptions();
    });

    // On charge les données venant de la table table_valeur : statut Marital
    this.tableValeurService
      .findLienParente()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((lienParente: ITableValeur[]) => (this.lienParente = lienParente));

    // On charge les données venant de la table table_valeur : GENRE
    this.tableValeurService
      .findGenre()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((genre: ITableValeur[]) => (this.genre = genre));
  }

  previousState(): void {
    window.history.back();
  }

  selectEventMatricule(item: any): any {
    // do something with selected item
  }

  onChangeSearch(search: string): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onLienParenteChange(param: string): void {
    switch (param) {
      case 'ENFANT':
        this.isEnfant = true;
        break;
      case 'CONJOINT(E)':
        this.isEnfant = false;
        break;
      default:
        break;
    }
  }

  onFocused(e: any): any {
    // do something
  }

  save(): void {
    this.isSaving = true;
    const enfant = this.createFromForm();
    enfant.enfantEnVie = true;
    enfant.enfantImposable = true;
    enfant.matriculeParent = enfant.agent?.matricule;
    if (enfant.id !== undefined) {
      this.subscribeToSaveResponse(this.enfantService.update(enfant));
    } else {
      this.subscribeToSaveResponse(this.enfantService.create(enfant));
    }
  }

  trackAgentById(_index: number, item: IAgent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEnfant>>): void {
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

  protected updateForm(enfant: IEnfant): void {
    this.editForm.patchValue({
      id: enfant.id,
      matriculeParent: enfant.matriculeParent,
      nom: enfant.nom,
      prenom: enfant.prenom,
      sexe: enfant.sexe,
      nin: enfant.nin,
      lienParente: enfant.lienParente,
      dateNaissance: enfant.dateNaissance,
      lieuNaissance: enfant.lieuNaissance,
      numeroActeNaissance: enfant.numeroActeNaissance,
      dateActeNaissance: enfant.dateActeNaissance,
      rangEnfant: enfant.rangEnfant,
      // codeAge: enfant.codeAge,
      enfantEnVie: enfant.enfantEnVie,
      enfantImposable: enfant.enfantImposable,
      userInsertId: enfant.userInsertId,
      agent: enfant.agent,
    });

    this.agentsSharedCollection = this.agentService.addAgentToCollectionIfMissing(this.agentsSharedCollection, enfant.agent);
  }

  protected loadRelationshipsOptions(): void {
    this.agentService
      .query()
      .pipe(map((res: HttpResponse<IAgent[]>) => res.body ?? []))
      .pipe(map((agents: IAgent[]) => this.agentService.addAgentToCollectionIfMissing(agents, this.editForm.get('agent')!.value)))
      .subscribe((agents: IAgent[]) => (this.agentsSharedCollection = agents));
  }

  protected createFromForm(): IEnfant {
    return {
      ...new Enfant(),
      id: this.editForm.get(['id'])!.value,
      matriculeParent: this.editForm.get(['matriculeParent'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      sexe: this.editForm.get(['sexe'])!.value,
      nin: this.editForm.get(['nin'])!.value,
      lienParente: this.editForm.get(['lienParente'])!.value,
      dateNaissance: this.editForm.get(['dateNaissance'])!.value,
      lieuNaissance: this.editForm.get(['lieuNaissance'])!.value,
      numeroActeNaissance: this.editForm.get(['numeroActeNaissance'])!.value,
      dateActeNaissance: this.editForm.get(['dateActeNaissance'])!.value,
      rangEnfant: this.editForm.get(['rangEnfant'])!.value,
      // codeAge: this.editForm.get(['codeAge'])!.value,
      enfantEnVie: this.editForm.get(['enfantEnVie'])!.value,
      enfantImposable: this.editForm.get(['enfantImposable'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      agent: this.editForm.get(['agent'])!.value,
    };
  }
}
