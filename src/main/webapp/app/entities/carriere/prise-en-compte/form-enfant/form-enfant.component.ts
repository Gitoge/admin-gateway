import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableValeurService } from 'app/entities/table-valeur/service/table-valeur.service';
import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';
import dayjs from 'dayjs';
import { filter, finalize, map, Observable } from 'rxjs';

import { IAgent } from '../../agent/agent.model';
import { AgentService } from '../../agent/service/agent.service';
import { Enfant, IEnfant } from '../../enfant/enfant.model';
import { EnfantService } from '../../enfant/service/enfant.service';

@Component({
  selector: 'jhi-form-enfant-update',
  templateUrl: './form-enfant.component.html',
})
export class FormEnfantComponent implements OnInit {
  isSaving = false;

  agentsSharedCollection: IAgent[] = [];

  @Output() clickEvent = new EventEmitter<IEnfant>();

  enfantEnVie!: boolean;

  enfantImposable!: boolean;

  isEnfant!: boolean;

  lienParente!: ITableValeur[];

  today: any;

  editForm = this.fb.group({
    id: [],
    matriculeParent: [null],
    prenom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    nom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
    sexe: [null, [Validators.required]],
    nin: [null, [Validators.minLength(13), Validators.maxLength(14), Validators.pattern('^[a-zA-Z0-9]*$')]],
    lienParente: [null, [Validators.required]],
    dateNaissance: [null, [Validators.required]],
    lieuNaissance: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0]*$')]],
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
    protected activeModal: NgbActiveModal,
    protected tableValeurService: TableValeurService
  ) {}

  ngOnInit(): void {
    this.today = dayjs().startOf('day');
    this.editForm.patchValue({
      enfantEnVie: true,
      enfantImposable: false,
    });

    // On charge les données venant de la table table_valeur : statut Marital
    this.tableValeurService
      .findLienParente()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((lienParente: ITableValeur[]) => (this.lienParente = lienParente));
  }

  previousState(): void {
    window.history.back();
  }
  isEnfantEnvie(event: any): void {
    if (event.target.checked === true) {
      this.enfantEnVie = true;
    }

    if (event.target.checked === false) {
      this.enfantEnVie = false;
    }
  }

  isEnfantImposable(event: any): void {
    if (event.target.checked === true) {
      this.enfantImposable = true;
    }

    if (event.target.checked === false) {
      this.enfantImposable = false;
    }
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

  save(): void {
    this.isSaving = true;
    const enfant = this.createFromForm();
    enfant.enfantEnVie = true;
    if (enfant.id !== undefined) {
      this.subscribeToSaveResponse(this.enfantService.update(enfant));
    } else {
      this.subscribeToSaveResponse(this.enfantService.create(enfant));
    }
  }

  trackAgentById(_index: number, item: IAgent): number {
    return item.id!;
  }

  cancel(): void {
    this.activeModal.dismiss('Cross click');
    this.activeModal.dismiss('success');
  }

  ajouterEnfant(): void {
    console.error('ce qui est envoyé : ', this.createFromForm());
    this.clickEvent.emit(this.createFromForm());
    this.cancel();
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
      lienParente: this.editForm.get(['lienParente'])!.value?.libelle,
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
