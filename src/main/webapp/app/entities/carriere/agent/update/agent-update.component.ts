import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IAgent, Agent } from '../agent.model';
import { AgentService } from '../service/agent.service';
import { INationalite } from 'app/entities/carriere/nationalite/nationalite.model';
import { NationaliteService } from 'app/entities/carriere/nationalite/service/nationalite.service';

@Component({
  selector: 'jhi-agent-update',
  templateUrl: './agent-update.component.html',
})
export class AgentUpdateComponent implements OnInit {
  isSaving = false;
  title?: string;

  nationalitesSharedCollection: INationalite[] = [];

  editForm = this.fb.group({
    id: [],
    matricule: [],
    typePiece: [null, [Validators.required]],
    numeroPiece: [null, [Validators.required, Validators.minLength(13), Validators.maxLength(14), Validators.pattern('^[a-zA-Z0-9]*$')]],
    prenom: [null, [Validators.required]],
    nom: [null, [Validators.required]],
    dateNaissance: [null, [Validators.required]],
    lieuNaissance: [null, [Validators.required]],
    sexe: [null, [Validators.required]],
    nomMari: [],
    telephone: [],
    email: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email]],
    adresse: [],
    femmeMariee: [],
    datePriseEnCharge: [],
    dateSortie: [],
    status: [],
    titre: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
    nationalite: [],
  });

  constructor(
    protected agentService: AgentService,
    protected nationaliteService: NationaliteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ agent }) => {
      if (agent.id === undefined) {
        const today = dayjs().startOf('day');
        agent.datePriseEnCharge = today;
        agent.dateSortie = today;
        agent.dateInsert = today;
        this.title = "Ajout d'un nouveau agent";
      } else {
        this.title = 'Modifier agent';
      }

      this.updateForm(agent);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const agent = this.createFromForm();
    if (agent.id !== undefined) {
      this.subscribeToSaveResponse(this.agentService.update(agent));
    } else {
      this.subscribeToSaveResponse(this.agentService.create(agent));
    }
  }

  trackNationaliteById(_index: number, item: INationalite): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAgent>>): void {
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

  protected updateForm(agent: IAgent): void {
    this.editForm.patchValue({
      id: agent.id,
      matricule: agent.matricule,
      typePiece: agent.typePiece,
      numeroPiece: agent.numeroPiece,
      prenom: agent.prenom,
      nom: agent.nom,
      dateNaissance: agent.dateNaissance,
      lieuNaissance: agent.lieuNaissance,
      sexe: agent.sexe,
      nomMari: agent.nomMari,
      telephone: agent.telephone,
      email: agent.email,
      adresse: agent.adresse,
      femmeMariee: agent.femmeMariee,
      datePriseEnCharge: agent.datePriseEnCharge ? agent.datePriseEnCharge.format(DATE_TIME_FORMAT) : null,
      dateSortie: agent.dateSortie ? agent.dateSortie.format(DATE_TIME_FORMAT) : null,
      status: agent.status,
      titre: agent.titre,
      userInsertId: agent.userInsertId,
      userUpdateId: agent.userUpdateId,
      dateInsert: agent.dateInsert ? agent.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: agent.dateUpdate ? agent.dateUpdate.format(DATE_TIME_FORMAT) : null,
      nationalite: agent.nationalite,
    });

    this.nationalitesSharedCollection = this.nationaliteService.addNationaliteToCollectionIfMissing(
      this.nationalitesSharedCollection,
      agent.nationalite
    );
  }

  protected loadRelationshipsOptions(): void {
    this.nationaliteService
      .query()
      .pipe(map((res: HttpResponse<INationalite[]>) => res.body ?? []))
      .pipe(
        map((nationalites: INationalite[]) =>
          this.nationaliteService.addNationaliteToCollectionIfMissing(nationalites, this.editForm.get('nationalite')!.value)
        )
      )
      .subscribe((nationalites: INationalite[]) => (this.nationalitesSharedCollection = nationalites));
  }

  protected createFromForm(): IAgent {
    return {
      ...new Agent(),
      id: this.editForm.get(['id'])!.value,
      matricule: this.editForm.get(['matricule'])!.value,
      typePiece: this.editForm.get(['typePiece'])!.value,
      numeroPiece: this.editForm.get(['numeroPiece'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      dateNaissance: this.editForm.get(['dateNaissance'])!.value,
      lieuNaissance: this.editForm.get(['lieuNaissance'])!.value,
      sexe: this.editForm.get(['sexe'])!.value,
      nomMari: this.editForm.get(['nomMari'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      email: this.editForm.get(['email'])!.value,
      adresse: this.editForm.get(['adresse'])!.value,
      femmeMariee: this.editForm.get(['femmeMariee'])!.value,
      datePriseEnCharge: this.editForm.get(['datePriseEnCharge'])!.value
        ? dayjs(this.editForm.get(['datePriseEnCharge'])!.value, DATE_TIME_FORMAT)
        : undefined,
      dateSortie: this.editForm.get(['dateSortie'])!.value ? dayjs(this.editForm.get(['dateSortie'])!.value, DATE_TIME_FORMAT) : undefined,
      status: this.editForm.get(['status'])!.value,
      titre: this.editForm.get(['titre'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      nationalite: this.editForm.get(['nationalite'])!.value,
    };
  }
}
