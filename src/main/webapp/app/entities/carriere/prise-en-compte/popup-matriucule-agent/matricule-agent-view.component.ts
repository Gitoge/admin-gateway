import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize, map, Observable } from 'rxjs';

import { IAgent } from '../../agent/agent.model';
import { AgentService } from '../../agent/service/agent.service';
import { Enfant, IEnfant } from '../../enfant/enfant.model';
import { EnfantService } from '../../enfant/service/enfant.service';
import { IPriseEnCompte } from '../prise-en-compte.model';

@Component({
  selector: 'jhi-form-matricule-agent-view',
  templateUrl: './matricule-agent-view.component.html',
})
export class MatriculeAgentViewComponent implements OnInit {
  isSaving = false;

  agentsSharedCollection: IAgent[] = [];

  @Input() priseEnCompte?: IPriseEnCompte;

  @Output() clickEvent = new EventEmitter<IEnfant>();

  enfantEnVie!: boolean;

  enfantImposable!: boolean;

  isEnfant!: boolean;

  editForm = this.fb.group({
    id: [],
    matriculeParent: [null],
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
    protected activeModal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.editForm.patchValue({
      enfantEnVie: false,
      enfantImposable: false,
    });
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
      case 'CONJOINT':
        this.isEnfant = false;
        break;
      default:
        break;
    }
  }

  save(): void {
    this.isSaving = true;
    const enfant = this.createFromForm();
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
