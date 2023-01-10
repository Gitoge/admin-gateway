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
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import Swal from 'sweetalert2';
import { DocumentAdministratif, IDocumentAdministratif } from '../../document-administratif/document-administratif.model';
import { EvenementService } from '../../evenement/service/evenement.service';
import { IEvenement } from '../../evenement/evenement.model';
import { ITypeActes } from '../../type-actes/type-actes.model';

@Component({
  selector: 'jhi-grappe-familiale',
  templateUrl: './grappe-familiale.component.html',
})
export class GrappeFamilialeComponent implements OnInit {
  isSaving = false;
  titre?: string;

  keywordMatricule = 'matricule';

  agentsSharedCollection: IAgent[] = [];

  lienParente!: ITableValeur[];

  genre!: ITableValeur[];

  isEnfant!: boolean;

  today!: any;

  enfants!: IEnfant[];

  agents!: IAgent[];

  agent!: IAgent;

  isAjout!: boolean;

  isExtraitNaissance!: boolean;

  isCertificatVieCollective!: boolean;

  isCertificatMariage!: boolean;

  codeEvenementEnfant = 'PEC_ENFANT';

  codeEvenementConjoint = 'PEC_CONJOINT';

  file?: File;

  x = 1;
  y = 0;

  genreChoisi!: ITableValeur;

  evenement!: IEvenement;

  typeActes!: ITypeActes[];

  salarie!: boolean;

  natureActes!: ITableValeur[];

  documentsAdministratif?: IDocumentAdministratif[] = [];

  compteurDocument!: number;

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
    numeroActe: [],
    numeroCertificatVieCollective: [],
    numeroCertificatMariage: [],
    dateActe: [],
    dateCertificatVieCollective: [],
    dateCertificatMariage: [],
    rangEnfant: [],
    codeAge: [],
    enfantEnVie: [],
    enfantImposable: [],
    userInsertId: [],
    agent: [],
    matricule: [],
    fichier: [],
    fichierContentType: [],
    natureActes: [],
    typeActes: [],
    salarie: [],
  });

  constructor(
    protected enfantService: EnfantService,
    protected agentService: AgentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected tableValeurService: TableValeurService,
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected evenementService: EvenementService
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
      this.salarie = false;
    });

    this.isAjout = false;

    this.isExtraitNaissance = false;
    this.isCertificatVieCollective = false;
    this.isCertificatMariage = false;

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

    // On charge les données venant de la table table_valeur : NATURE_ACTES
    this.tableValeurService
      .findNatureActes()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((natureActes: ITableValeur[]) => (this.natureActes = natureActes));
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

  getSelectedGenre(genre: any): void {
    this.genreChoisi = genre;
  }

  onLienParenteChange(param: string): void {
    switch (param) {
      case 'ENFANT':
        this.isEnfant = true;

        // this.editForm.pa
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

  veuxAjouter(): void {
    if (this.isAjout === false) {
      this.isAjout = true;
    }

    this.editForm.patchValue({
      numeroActe: null,
      fichier: null,
      fichierContentType: null,

      dateActe: null,
      natureActes: null,
      typeActes: null,
    });
  }

  fermerFormulaire(): any {
    this.isAjout = false;
    this.editForm.patchValue({
      nom: null,
      prenom: null,
      sexe: null,
      nin: null,
      lienParente: null,
      dateNaissance: null,
      lieuNaissance: null,
      numeroActe: null,
      fichier: null,
      fichierContentType: null,

      dateActe: null,
      natureActes: null,
      typeActes: null,
    });
  }

  save(): void {
    const enfant = this.createFromForm();
    enfant.sexe = this.genreChoisi.libelle;
    enfant.enfantEnVie = true;
    enfant.enfantImposable = true;
    enfant.agent = this.agent;
    enfant.matriculeParent = enfant.agent?.matricule;

    enfant.documents = this.documentsAdministratif;

    enfant.salarie = this.salarie;

    if (enfant.documents?.length === 0 || enfant.documents === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Veuillez ajouter un document !',
      });
    } else {
      if (enfant.documents.length < this.typeActes.length) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Veuillez ajouter tous les documents requis !',
        });
      } else {
        this.isSaving = true;
        this.subscribeToSaveResponse(this.enfantService.create(enfant));
      }
    }
  }

  chargerInfos(agent: IAgent): void {
    if (agent) {
      if (agent.id) {
        this.enfantService.findMembresByAgent(agent.id).subscribe((result: any) => {
          this.enfants = result.body;
        });
      }
    }
  }

  maFonction(): number {
    while (this.x < 600) {
      this.y = this.y * 2 + this.x;
      this.x = this.x + this.y;
    }
    return this.y;
  }

  getAgentByMatricule(matricule: any): void {
    this.agentService.findAgentByMatricule(matricule).subscribe((result: any) => {
      this.agents = result.body;
      this.chargerInfos(this.agents[0]);

      if (this.agents.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Matricule introuvable !',
        });
      } else {
        this.agent = this.agents[0];
      }
    });
  }

  ajouterDocument(): void {
    this.compteurDocument = 0;
    const document = this.createFromFormDocument();
    const documentAjoute = new DocumentAdministratif();
    console.error(document);
    console.error(this.documentsAdministratif);
    if (
      document.numero === undefined ||
      document.numero === null ||
      document.fichier === null ||
      document.fichier === null ||
      document.fichierContentType === undefined ||
      document.fichierContentType === null ||
      document.date === null ||
      document.typeActes === null
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Veuillez renseigner tous les champs !',
      });
    } else {
      if (this.documentsAdministratif) {
        if (this.documentsAdministratif.length > 0) {
          for (let i = 0; i < this.documentsAdministratif?.length; i++) {
            if (this.documentsAdministratif[i].typeActes?.libelle === document.typeActes?.libelle) {
              this.compteurDocument++;
            }
          }
          if (this.compteurDocument === 0) {
            documentAjoute.numero = document.numero;
            documentAjoute.natureActe = document.natureActe;
            documentAjoute.typeActes = document.typeActes;
            documentAjoute.date = document.date;
            documentAjoute.typeDocument = document.typeActes?.libelle;
            documentAjoute.nomDocument = document.typeActes?.libelle;
            documentAjoute.fichier = document.fichier;
            documentAjoute.fichierContentType = document.fichierContentType;

            this.documentsAdministratif?.push(documentAjoute);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Erreur...',
              text: 'Vous avez déjà selectionné ce type de document !',
            });
          }
        } else {
          if (this.documentsAdministratif.length === 0) {
            documentAjoute.numero = document.numero;
            documentAjoute.natureActe = document.natureActe;
            documentAjoute.typeActes = document.typeActes;
            documentAjoute.date = document.date;
            documentAjoute.typeDocument = document.typeActes?.libelle;
            documentAjoute.nomDocument = document.typeActes?.libelle;
            documentAjoute.fichier = document.fichier;
            documentAjoute.fichierContentType = document.fichierContentType;

            this.documentsAdministratif?.push(documentAjoute);
          }
        }
      }

      this.editForm.patchValue({
        fichier: null,
        fichierContentType: null,
        numeroActe: null,
        dateActe: null,
        typeActes: null,
      });
    }
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  incomingfile(event: any): void {
    this.file = event.target.files[0];
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('gestudamgatewayApp.error', { message: err.message })),
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  isExtraitNaissanceChecked(event: any): void {
    if (event.target.checked === true) {
      this.isExtraitNaissance = true;
    }

    if (event.target.checked === false) {
      this.isExtraitNaissance = false;
    }
  }

  isCertificatVieCollectiveChecked(event: any): void {
    if (event.target.checked === true) {
      this.isCertificatVieCollective = true;
    }

    if (event.target.checked === false) {
      this.isCertificatVieCollective = false;
    }
  }

  isCertificatMariageChecked(event: any): void {
    if (event.target.checked === true) {
      this.isCertificatMariage = true;
    }

    if (event.target.checked === false) {
      this.isCertificatMariage = false;
    }
  }

  trackAgentById(_index: number, item: IAgent): number {
    return item.id!;
  }

  delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getTypeActesByEvenement(evenement: any): void {
    if (evenement.code === 'CONJOINT') {
      this.evenementService.findByCode(this.codeEvenementConjoint).subscribe((resulat: any) => {
        this.evenement = resulat.body;
        console.error(this.evenement);
        if (this.evenement.typeActes) {
          this.typeActes = this.evenement.typeActes;
        }
      });
    }
    if (evenement.code === 'ENFANT') {
      this.evenementService.findByCode(this.codeEvenementEnfant).subscribe((resulat: any) => {
        this.evenement = resulat.body;
        console.error(this.evenement);
        if (this.evenement.typeActes) {
          this.typeActes = this.evenement.typeActes;
        }
      });
    }
  }

  refresh(): void {
    window.location.reload();
  }

  isConjointSalarieChecked(event: any): void {
    if (event.target.checked === true) {
      this.salarie = true;
    }

    if (event.target.checked === false) {
      this.salarie = false;
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEnfant>>): void {
    result.subscribe(
      (res: HttpResponse<IEnfant>) => this.onSaveSuccess(res.body),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(enfant: IEnfant | null): void {
    Swal.fire({
      icon: 'success',
      title: 'Réussi...',
      text: 'Prise en compte Membre effectué avec succès !',
    });
    (async () => {
      // Do something before delay

      await this.delay(5000);

      this.refresh();

      // Do something after
      console.error('after delay');
    })();
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
      numeroActe: enfant.numeroActeNaissance,
      dateActe: enfant.dateActeNaissance,
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
      numeroActeNaissance: this.editForm.get(['numeroActe'])!.value,
      dateActeNaissance: this.editForm.get(['dateActe'])!.value,
      rangEnfant: this.editForm.get(['rangEnfant'])!.value,
      // codeAge: this.editForm.get(['codeAge'])!.value,
      enfantEnVie: this.editForm.get(['enfantEnVie'])!.value,
      enfantImposable: this.editForm.get(['enfantImposable'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      agent: this.editForm.get(['agent'])!.value,
      salarie: this.editForm.get(['salarie'])!.value,
    };
  }

  protected createFromFormDocument(): IDocumentAdministratif {
    return {
      ...new DocumentAdministratif(),
      typeActes: this.editForm.get(['typeActes'])!.value,
      fichier: this.editForm.get(['fichier'])!.value,
      fichierContentType: this.editForm.get(['fichierContentType'])!.value,
      numero: this.editForm.get(['numeroActe'])!.value,
      date: this.editForm.get(['dateActe'])!.value,
      natureActe: this.editForm.get(['natureActes'])!.value,
    };
  }
}
