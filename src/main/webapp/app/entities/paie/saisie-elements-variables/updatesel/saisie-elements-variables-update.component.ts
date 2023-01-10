import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISaisieElementsVariables, SaisieElementsVariables } from '../saisie-elements-variables.model';
import { SaisieElementsVariablesService } from '../service/saisie-elements-variables.service';
import { IPeriodePaye } from 'app/entities/paie/periode-paye/periode-paye.model';
import { PeriodePayeService } from 'app/entities/paie/periode-paye/service/periode-paye.service';
import { IPostes } from '../../../postes/postes.model';
import { PostesService } from '../../../postes/service/postes.service';
import { IEmoluments } from '../../emoluments/emoluments.model';
import { EmolumentsService } from '../../emoluments/service/emoluments.service';
import { IAgent } from '../../../carriere/agent/agent.model';
import { AgentService } from '../../../carriere/agent/service/agent.service';
import { SaisieElementsVariablesDeleteDialogComponent } from '../delete/saisie-elements-variables-delete-dialog.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PostesReferenceActesService } from '../../../postes-reference-actes/service/postes-reference-actes.service';
import { DestinatairesService } from '../../../destinataires/service/destinataires.service';
import { IDestinataires } from '../../../destinataires/destinataires.model';
import Swal from 'sweetalert2';
import { IHeuresSupp } from '../heures_supp/heures-supp.model';
import { HeuresSuppComponent } from '../heures_supp/heures_supp.component';

@Component({
  selector: 'jhi-saisie-elements-variables-update',
  templateUrl: './saisie-elements-variables-update.component.html',
})
export class SaisieElementsVariablesUpdateSelComponent implements OnInit {
  isSaving = false;
  isAjout!: boolean;
  posteId: any;
  codePosteDestinataire: any;
  posteIdRefeference: any;
  saisieElementsVariables!: ISaisieElementsVariables;
  infosUpdate: any;
  libellePoste: any;
  show!: any;

  periodePayesSharedCollection: IPeriodePaye[] = [];
  postesSharedCollection: IPostes[] = [];
  elementsVar?: ISaisieElementsVariables[] = [];
  elements?: ISaisieElementsVariables[] = [];

  postes: any;
  codePostesReference: any;
  titre = '';
  keyword = 'code';
  keywordestinatire = 'code';
  public agents: any;
  emoluments!: IEmoluments;
  emolument!: IEmoluments[];
  agent!: IAgent[];
  matricule: any;
  agentId: any;
  montant: any;
  codeposte: any;
  sens: any;
  dateEcheange: any;
  date: any;
  destinataire: any;
  destinairesSharedCollection: any;

  periodePayeEnCours!: IPeriodePaye;

  etatPeriodePayeEnCours!: string;

  modalRef?: NgbModalRef;

  heuresSupp!: IHeuresSupp;
  heuresSupps!: IHeuresSupp[];

  editForm = this.fb.group({
    id: [],
    codePoste: [],
    matricule: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
    reference: [],
    montant: [null, [Validators.required]],
    taux: [],
    dateEffet: [],
    dateEcheance: [],
    date: [],
    periode: [],
    statut: [],
    agentId: [],
    etablissementId: [],
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
    periodePaye: [],
    postes: [],
    posteId: [],
    libellePoste: [],
    destinataire: [],
  });

  constructor(
    protected saisieElementsVariablesService: SaisieElementsVariablesService,
    protected periodePayeService: PeriodePayeService,
    protected emolumentsService: EmolumentsService,
    protected agentService: AgentService,
    protected postesService: PostesService,
    protected postesReferenceService: PostesReferenceActesService,
    protected destinatairesService: DestinatairesService,
    protected activatedRoute: ActivatedRoute,
    protected modalService: NgbModal,
    protected router: Router,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ saisieElementsVariables }) => {
      if (saisieElementsVariables.id === undefined) {
        const today = dayjs().startOf('day');
        saisieElementsVariables.dateInsert = today;
        saisieElementsVariables.dateUpdate = today;
        this.titre = 'Ajouter Eléments';
      } else {
        this.titre = 'Modifier Eléments';
        this.infosUpdate = saisieElementsVariables;
      }
      this.isAjout = false;

      this.etatPeriodePayeEnCours = '';
      this.periodePayeService.findPeriodeEnCours().subscribe((res: any) => {
        this.periodePayeEnCours = res.body;
        if (this.periodePayeEnCours.statut) {
          this.etatPeriodePayeEnCours = this.periodePayeEnCours.statut;
        }
      });

      this.updateForm(saisieElementsVariables);

      this.loadRelationshipsOptions();
    });
    console.error('ddddd', this.infosUpdate.libellePoste);
  }

  list(matricule: any): void {
    this.saisieElementsVariablesService.findElementByMatricule(matricule).subscribe((result: any) => {
      this.elements = result.body;
    });
  }
  infos(): void {
    const elt = new SaisieElementsVariables();
    const today = dayjs().startOf('day');
    elt.dateInsert = today;
    elt.matricule = this.matricule;
    elt.agentId = this.agentId;
    elt.montant = this.montant;
    elt.date = this.date;
    elt.dateEcheance = this.dateEcheange;
    elt.codePoste = this.codeposte;
    elt.sens = this.sens;
    elt.posteId = this.posteId;
    elt.libellePoste = this.libellePoste;
    elt.destinataire = this.codePosteDestinataire;
    this.elementsVar?.push(elt);
    console.error('tetetet', elt);
    if (this.editForm.valid) {
      this.codeposte = '';
    }
    this.editForm.patchValue({
      libellePoste: '',
      codePoste: '',
      montant: '',
      dateEcheance: '',
      date: '',
      destinataire: '',
    });
  }
  add(date1: dayjs.Dayjs): any {
    console.error('jjjjj', this.add(this.date));
    this.editForm.patchValue({
      dateEcheance: this.add(this.date),
    });
    return dayjs(date1).add(60, 'year');
  }
  veuxAjouter(): void {
    if (this.isAjout === false) {
      this.isAjout = true;
      // console.error('testtest');
    } else {
      this.isAjout = false;
      console.error('TEST');
    }
  }

  addHeuresSupp(): void {
    this.modalRef = this.modalService.open(HeuresSuppComponent, { size: 'lg' });

    this.modalRef.componentInstance.clickEvent.subscribe((heuresSupp: IHeuresSupp) => {
      this.heuresSupps?.push(heuresSupp);
      console.error(" tableau d'heures Supp", this.heuresSupps);
    });
  }

  previousState(): void {
    //window.history.back();
    this.router.navigate(['/saisie-elements-variables/list']);
  }
  selectEvent(item: any): any {
    // this.idEtablissement = item;
    this.posteId = item.id;
    this.libellePoste = item.libelle;
    this.codeposte = item.code;
    this.sens = item.sens;
    this.getPostesByCode(this.codeposte);
  }
  selectEventDestinataire(item: any): any {
    this.codePosteDestinataire = item.code;
  }
  onChangeSearch(search: string): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any): any {
    console.error('test');
  }
  onFocusOutEvent(item: any): any {
    if (item.libelle === null) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Ce code n existe pas!',
      });
    }
    this.posteId = item.id;
    this.libellePoste = item.libelle;
    this.codeposte = item.code;
    this.sens = item.sens;
    this.getPostesByCode(item.target.value);
  }
  onFocusOutEventDestinataire(item: any): any {
    this.codePosteDestinataire = item.target.value;
  }
  chargerInfos(emolument: IEmoluments): void {
    if (emolument.id) {
      this.emolumentsService.findByEmolument(emolument.id).subscribe((result: any) => {
        this.emoluments = result.body;
      });
    }
  }

  getAgentByMatricule(matricule: any): void {
    this.agentService.findAgentByMatricule(matricule).subscribe((result: any) => {
      if (result.body.length === 0) {
        console.error('jjjjjjj', result.body.length);
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Matricule introuvable!',
        });
      }
      this.agent = result.body;
      this.agentId = this.agent[0].id;
      this.emolument = result.body;
    });
  }
  deleteElementsVar(element: ISaisieElementsVariables): void {
    if (this.elementsVar) {
      for (let i = 0; i < this.elementsVar.length; i++) {
        if (this.elementsVar[i].matricule === element.matricule && this.elementsVar[i].montant === element.montant) {
          this.elementsVar.splice(i, 1);
          this.saisieElementsVariablesService.delete(element.id!);
        }
      }
    }
  }
  delete(saisieElementsVariables: ISaisieElementsVariables): void {
    const modalRef = this.modalService.open(SaisieElementsVariablesDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.saisieElementsVariables = saisieElementsVariables;
  }
  save(): void {
    this.isSaving = true;
    //  const saisieElementsVariables = this.createFromForm();
    for (let i = 0; i <= this.elementsVar!.length; i++) {
      if (this.elementsVar![i].id === undefined) {
        this.elementsVar![i].periodePaye = this.periodePayeEnCours;
        this.subscribeToSaveResponse(this.saisieElementsVariablesService.create(this.elementsVar![i]));
      }
    }
  }
  saveUpdate(): void {
    this.isSaving = true;
    const saisieElementsVariables = this.createFromForm();
    if (saisieElementsVariables.id !== undefined) {
      saisieElementsVariables.dateEcheance = this.infosUpdate.dateEcheance;
      saisieElementsVariables.date = this.infosUpdate.date;
      saisieElementsVariables.sens = this.infosUpdate.sens;
      saisieElementsVariables.periodePaye = this.infosUpdate.periodePaye;
      saisieElementsVariables.numero = this.infosUpdate.numero;
      saisieElementsVariables.statut = this.infosUpdate.statut;
      saisieElementsVariables.codePoste = this.infosUpdate.codePoste;
      saisieElementsVariables.libellePoste = this.infosUpdate.libellePoste;
      saisieElementsVariables.posteId = this.infosUpdate.posteId;
      saisieElementsVariables.agentId = this.infosUpdate.agentId;

      this.subscribeToSaveResponse(this.saisieElementsVariablesService.update(saisieElementsVariables));
    } else {
      this.subscribeToSaveResponse(this.saisieElementsVariablesService.create(saisieElementsVariables));
    }
  }

  trackPeriodePayeById(_index: number, item: IPeriodePaye): number {
    return item.id!;
  }

  trackPostesById(_index: number, item: IPostes): number {
    return item.id!;
  }
  refresh(): void {
    window.location.reload();
  }

  getPostesByCode(code: string | undefined): void {
    if (code) {
      this.postesService.findByCode(code).subscribe(
        (result: any) => {
          this.postes = result.body;
          this.posteId = this.postes?.id;
          this.codeposte = result.body.code;
          this.sens = result.body.sens;
          this.libellePoste = this.postes?.libelle;
          this.editForm.patchValue({
            posteId: this.postes?.id,
            libellePoste: this.postes?.libelle,
          });
          console.error('jjjjjjjjjj ', this.postes);
        },
        (res: HttpErrorResponse) => this.onError()
      );
      this.postesReferenceService.findByCode(code).subscribe(
        (result: any) => {
          this.codePostesReference = result.body[0].postes.code;
          console.error('this.codePostesReference', this.codePostesReference);
        },
        (res: HttpErrorResponse) => this.onError()
      );
    }
  }
  protected onError(): void {
    console.error('error');
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISaisieElementsVariables>>): void {
    result.subscribe(
      (res: HttpResponse<ISaisieElementsVariables>) => this.onSaveSuccess(res.body),
      err => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: err.error.message,
        });
        // console.error(err.error.message);
      }
    );
    this.isSaving = false;
  }

  protected onSaveSuccess(saisieElementsVariables: ISaisieElementsVariables | null): void {
    if (saisieElementsVariables !== null) {
      this.saisieElementsVariables = saisieElementsVariables;

      this.isSaving = false;

      if (this.saisieElementsVariables.id !== undefined) {
        Swal.fire(`<h4 style="font-family: Helvetica; font-size:16px">Elément(s) Variables <b>${''}</b> enregistré(s) avec succès</h4>`);
        this.router.navigate(['/saisie-elements-variables/list']);
      }
      this.router.navigate(['/saisie-elements-variables/list']);
    }
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(saisieElementsVariables: ISaisieElementsVariables): void {
    this.editForm.patchValue({
      id: saisieElementsVariables.id,
      codePoste: saisieElementsVariables.codePoste,
      matricule: saisieElementsVariables.matricule,
      reference: saisieElementsVariables.reference,
      montant: saisieElementsVariables.montant,
      taux: saisieElementsVariables.taux,
      dateEffet: saisieElementsVariables.dateEffet,
      dateEcheance: saisieElementsVariables.dateEcheance,
      periode: saisieElementsVariables.periode,
      statut: saisieElementsVariables.statut,
      agentId: saisieElementsVariables.agentId,
      etablissementId: saisieElementsVariables.etablissementId,
      userInsertId: saisieElementsVariables.userInsertId,
      userUpdateId: saisieElementsVariables.userUpdateId,
      dateInsert: saisieElementsVariables.dateInsert ? saisieElementsVariables.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: saisieElementsVariables.dateUpdate ? saisieElementsVariables.dateUpdate.format(DATE_TIME_FORMAT) : null,
      periodePaye: saisieElementsVariables.periodePaye,
      postes: saisieElementsVariables.postes,
      posteId: saisieElementsVariables.posteId,
      date: saisieElementsVariables.date,
    });

    this.periodePayesSharedCollection = this.periodePayeService.addPeriodePayeToCollectionIfMissing(
      this.periodePayesSharedCollection,
      saisieElementsVariables.periodePaye
    );
    this.postesSharedCollection = this.postesService.addPostesToCollectionIfMissing(
      this.postesSharedCollection,
      saisieElementsVariables.postes
    );
  }

  protected loadRelationshipsOptions(): void {
    this.periodePayeService
      .query()
      .pipe(map((res: HttpResponse<IPeriodePaye[]>) => res.body ?? []))
      .pipe(
        map((periodePayes: IPeriodePaye[]) =>
          this.periodePayeService.addPeriodePayeToCollectionIfMissing(periodePayes, this.editForm.get('periodePaye')!.value)
        )
      )
      .subscribe((periodePayes: IPeriodePaye[]) => (this.periodePayesSharedCollection = periodePayes));

    this.postesService
      .findAll()
      .pipe(map((res: HttpResponse<IPostes[]>) => res.body ?? []))
      .pipe(map((postes: IPostes[]) => this.postesService.addPostesToCollectionIfMissing(postes, this.editForm.get('postes')!.value)))
      .subscribe((postes: IPostes[]) => (this.postes = postes));

    this.destinatairesService
      .query()
      .pipe(map((res: HttpResponse<IDestinataires[]>) => res.body ?? []))
      .pipe(
        map((destinataires: IDestinataires[]) =>
          this.destinatairesService.addDestinatairesToCollectionIfMissing(destinataires, this.editForm.get('destinataire')!.value)
        )
      )
      .subscribe((destinataires: IDestinataires[]) => (this.destinairesSharedCollection = destinataires));
  }

  protected createFromForm(): ISaisieElementsVariables {
    return {
      ...new SaisieElementsVariables(),
      id: this.editForm.get(['id'])!.value,
      codePoste: this.editForm.get(['postes'])!.value?.code,
      matricule: this.editForm.get(['matricule'])!.value,
      reference: this.editForm.get(['reference'])!.value,
      montant: this.editForm.get(['montant'])!.value,
      taux: this.editForm.get(['taux'])!.value,
      dateEffet: this.editForm.get(['dateEffet'])!.value,
      dateEcheance: this.editForm.get(['dateEcheance'])!.value,
      date: this.editForm.get(['date'])!.value,
      periode: this.editForm.get(['periode'])!.value,
      statut: this.editForm.get(['statut'])!.value,
      agentId: this.editForm.get(['agentId'])!.value,
      etablissementId: this.editForm.get(['etablissementId'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      periodePaye: this.editForm.get(['periodePaye'])!.value,
      postes: this.editForm.get(['postes'])!.value,
      posteId: this.posteId,
      libellePoste: this.libellePoste,
    };
  }
}
