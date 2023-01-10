import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { IPriseEnCompte } from '../prise-en-compte.model';
import { PriseEnCompteService } from '../service/prise-en-compte.service';

import { ILocalite } from 'app/entities/localite/localite.model';
import { LocaliteService } from 'app/entities/localite/service/localite.service';
import { IConvention } from 'app/entities/carriere/convention/convention.model';
import { ConventionService } from 'app/entities/carriere/convention/service/convention.service';
import { TypeLocaliteService } from 'app/entities/type-localite/service/type-localite.service';
import Swal from 'sweetalert2';
import { NgbModal, NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';
import { TableValeurService } from 'app/entities/table-valeur/service/table-valeur.service';
import dayjs from 'dayjs';
import { INationalite } from '../../nationalite/nationalite.model';
import { NationaliteService } from '../../nationalite/service/nationalite.service';
import { type } from 'os';
import { EvenementService } from '../../evenement/service/evenement.service';
import { IEvenement } from '../../evenement/evenement.model';
import { ITypeActes } from '../../type-actes/type-actes.model';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { EtablissementService } from 'app/entities/etablissement/service/etablissement.service';
import { ServiceService } from 'app/entities/service/service/service.service';
import { IService } from 'app/entities/service/service.model';
import { FormBuilder } from '@angular/forms';
import { EventManager } from '@angular/platform-browser';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { DataUtils } from 'app/core/util/data-util.service';
import { AgenceService } from 'app/entities/agence/service/agence.service';
import { BilleteurService } from 'app/entities/billeteur/service/billeteur.service';
import { CategorieService } from 'app/entities/categorie/service/categorie.service';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { EchelonService } from 'app/entities/echelon/service/echelon.service';
import { EmploisService } from 'app/entities/emplois/service/emplois.service';
import { GradeService } from 'app/entities/grade/service/grade.service';
import { HierarchieService } from 'app/entities/hierarchie/service/hierarchie.service';
import { AugmentationIndiceService } from 'app/entities/paie/augmentation-indice/service/augmentation-indice.service';
import { EmolumentsService } from 'app/entities/paie/emoluments/service/emoluments.service';
import { PosteCompoGradeService } from 'app/entities/paie/poste-compo-grade.service';
import { PositionsService } from 'app/entities/positions/service/positions.service';
import { AgentService } from '../../agent/service/agent.service';
import { CategorieAgentService } from '../../categorie-agent/service/categorie-agent.service';
import { DocumentAdministratifService } from '../../document-administratif/service/document-administratif.service';
import { EnfantService } from '../../enfant/service/enfant.service';
import { GrilleConventionService } from '../../grille-convention/service/grille-convention.service';
import { GrilleIndiciaireService } from '../../grille-indiciaire/service/grille-indiciaire.service';
import { GrilleSoldeGlobalService } from '../../grille-solde-global/service/grille-solde-global.service';
import { IndicesService } from '../../indices/service/indices.service';
import { ParamMatriculesService } from '../../param-matricules/service/param-matricules.service';
import { ICategorieAgent } from '../../categorie-agent/categorie-agent.model';
import { Classe, IClasse } from 'app/entities/classe/classe.model';
import { Echelon, IEchelon } from 'app/entities/echelon/echelon.model';
import { IEmplois } from 'app/entities/emplois/emplois.model';
import { Grade, IGrade } from 'app/entities/grade/grade.model';
import { Hierarchie, IHierarchie } from 'app/entities/hierarchie/hierarchie.model';
import { IPositions } from 'app/entities/positions/positions.model';
import { IIndices } from '../../indices/indices.model';
import { Indices } from 'app/entities/indices/indices.model';
import { Categorie, ICategorie } from 'app/entities/categorie/categorie.model';
import { Agence, IAgence } from 'app/entities/agence/agence.model';
import { IBilleteur } from 'app/entities/billeteur/billeteur.model';
import { modeReglement1, modeReglement2 } from 'app/config/input.constants';
import { ThisReceiver } from '@angular/compiler';
import { throws } from 'assert';
import { DocumentAdministratifDeleteDialogComponent } from '../../document-administratif/delete/document-administratif-delete-dialog.component';
import { DocumentAdministratif, IDocumentAdministratif } from '../../document-administratif/document-administratif.model';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { IEnfant } from '../../enfant/enfant.model';

@Component({
  selector: 'jhi-prise-en-compte-update',
  templateUrl: './prise-en-compte-modifi.component.html',
  styleUrls: ['../prise-en-compte.scss'],
})
export class PriseEnCompteModifComponent implements OnInit {
  priseEncompte!: IPriseEnCompte;
  isSaving!: boolean;

  active: any;

  typeMessage?: string;
  _success = new Subject<string>();

  matricule!: string;

  modeReglement1 = modeReglement1;
  modeReglement2 = modeReglement2;

  typePiece!: ITableValeur[];
  age!: number;
  today: any;
  numeroPiece!: number;

  genre!: ITableValeur[];
  isContrat = false;
  evenement!: IEvenement;
  typeActes!: ITypeActes[];

  @Output() clickEvent = new EventEmitter<ITypeActes[]>();

  // Shared Collection :
  nationaliteSharedCollection: INationalite[] = [];

  evenementSharedCollection: IEvenement[] = [];

  etablissementSharedCollection: IEtablissement[] = [];

  categorieAgentSharedCollection: ICategorieAgent[] = [];

  categorieSharedCollection: ICategorie[] = [];

  serviceSharedCollection: IService[] = [];

  positionSharedCollection: IPositions[] = [];

  emploisSharedCollection: IEmplois[] = [];

  services: IService[] = [];

  echelonSharedCollection: IEchelon[] = [];

  hierarchieSharedCollection: IHierarchie[] = [];

  classeSharedCollection: IClasse[] = [];

  gradeSharedCollection: IGrade[] = [];

  indicesSharedCollection: IIndices[] = [];

  agenceSharedCollection: IAgence[] = [];

  billeteurSharedCollection: IBilleteur[] = [];

  natureActes!: ITableValeur[];

  natureActeChoisi!: ITableValeur;

  // FIN shared Collection

  typePieceChoisi: any;
  isPasseport!: boolean;
  isCNI!: boolean;
  isUnique!: boolean;

  // Keys Words
  keyword = 'libelleLong';
  keywordGrade = 'code';

  keywordBanque = 'libelle';

  keywordEmploi = 'code';

  keywordService = 'code';

  keywordClasse = 'libelle';

  keywordEchelon = 'libelle';

  keywordIndice = 'libelle';

  keywordHierarchie = 'libelle';

  keywordCategorie = 'libelle';

  keywordBilleteur = 'prenom';

  //

  libelleEmploi: any;

  codeService: any;

  libelleService: any;

  soldeIndiciaire: any;

  convention!: IConvention;

  isConventionEntreprise = false;

  // Ids
  etablissementId!: number;

  numeroDocument!: number;
  dateDocument!: any;

  gradeId!: any;

  hierarchieId!: any;

  classeId!: number;

  categorieId!: number;

  emploisId!: any;

  servicesId!: any;

  codeEmplois!: string;

  indiceId!: any;

  etablissementChoisiId!: number;

  //
  // Quelques Données de l'agent
  etablissementAgent!: IEtablissement | null;
  gradeAgent!: IGrade;
  indiceAgent!: IIndices | null;
  hierarchieAgent!: IHierarchie | null;
  classeAgent!: IClasse | null;
  echelonAgent!: IEchelon | null;
  categorieDeAgent!: ICategorie | null;
  agenceAgent!: IAgence | null;

  // Quelques Données de l'agent FIN

  //
  dateRecrutement?: any;
  datePriseDeRang?: any;
  datePosition?: any;
  dateAnnulation?: any;

  infosPerso = 1;
  infosAdmin = 2;
  infosDocums = 1;

  isIndiciaire = false;
  isSoldeGlobal = false;
  isCasParticulier = false;
  isConvention = false;
  isModeBanque = false;
  isBilleteur = false;
  isMasculin = true;
  isCelibataire = true;
  isDivorce = true;
  isVeuf = true;

  isLoge!: boolean;

  priseEnCompteId: any;

  typeRemuneration!: ITableValeur[];

  typeRemunerationChoisi!: ITableValeur;

  modeReglement!: ITableValeur[];

  modeReglementChoisi!: ITableValeur;

  salairedeBase!: number;

  codeGrade: any;
  grade: any;

  libelleBanque: any;
  codeBanque: any;
  codeAgence: any;

  file?: File;

  ajoutActe!: boolean;

  compteurDocument!: number;

  enfants?: IEnfant[] = [];
  documents?: IDocumentAdministratif[] = [];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;
  sauvegardeAgent = false;

  documentsAdministratif?: IDocumentAdministratif[] = [];
  document?: IDocumentAdministratif;

  constructor(
    protected priseEncompteService: PriseEnCompteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    private stateStorageService: StateStorageService,
    private agentService: AgentService,
    private grilleIndiciaireService: GrilleIndiciaireService,
    private grilleConventionService: GrilleConventionService,
    private grilleSoldeGlobalService: GrilleSoldeGlobalService,
    private serviceService: ServiceService,
    private emploisService: EmploisService,
    private positionsService: PositionsService,
    private etablissementService: EtablissementService,
    private categorieAgentService: CategorieAgentService,
    private categorieService: CategorieService,
    private agenceService: AgenceService,
    private billeteurService: BilleteurService,
    protected enfantService: EnfantService,
    protected nationaliteService: NationaliteService,
    protected echelonService: EchelonService,
    protected classeService: ClasseService,
    protected gradeService: GradeService,
    protected indicesService: IndicesService,
    protected hierarchieService: HierarchieService,
    protected documentAdministratifService: DocumentAdministratifService,
    protected paramMatriculesService: ParamMatriculesService,
    protected emolumentsSerice: EmolumentsService,
    protected augmentationIndiceService: AugmentationIndiceService,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected router: Router,
    protected tableValeurService: TableValeurService,
    protected conventionService: ConventionService,
    protected evenementService: EvenementService,
    protected posteCompoGradeService: PosteCompoGradeService,
    protected eventManager: EventManager
  ) {}

  ngOnInit(): void {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ priseEncompte }) => {
      this.priseEncompte = priseEncompte;
      console.error(priseEncompte);
      const today = dayjs().startOf('day');
      this.etablissementService.find(this.priseEncompte.etablissementId!).subscribe((result: any) => {
        this.etablissementAgent = result.body;
        this.getServicesByEtablissement(this.etablissementAgent);
      });

      if (this.priseEncompte.gradeId) {
        this.gradeService.find(this.priseEncompte.gradeId).subscribe((result: any) => {
          this.gradeAgent = result.body;
        });
      }

      if (this.priseEncompte.hierarchieId) {
        this.hierarchieService.find(this.priseEncompte.hierarchieId).subscribe((result: any) => {
          this.hierarchieAgent = result.body;
        });
      }

      if (this.priseEncompte.echelonId) {
        this.echelonService.find(this.priseEncompte.echelonId).subscribe((result: any) => {
          this.echelonAgent = result.body;
        });
      }

      if (this.priseEncompte.categorieId) {
        this.categorieService.find(this.priseEncompte.categorieId).subscribe((result: any) => {
          this.categorieDeAgent = result.body;
        });
      }

      if (this.priseEncompte.indice?.id) {
        this.indicesService.find(this.priseEncompte.indice?.id).subscribe((result: any) => {
          this.indiceAgent = result.body;
        });
      }

      if (this.priseEncompte.classeId) {
        this.gradeService.find(this.priseEncompte.classeId).subscribe((result: any) => {
          this.classeAgent = result.body;
        });
      }

      if (this.priseEncompte.reglementId && this.priseEncompte.modeReglement === this.modeReglement1) {
        this.agenceService.find(this.priseEncompte.reglementId).subscribe((result: any) => {
          this.agenceAgent = result.body;
          this.codeAgence = this.agenceAgent?.code;
          this.codeBanque = this.agenceAgent?.etablissementBancaire?.code;
        });
      }
    });
    this.loadRelationshipsOptions();
    if (this.priseEncompte.numeroPiece) {
      this.numeroPiece = this.priseEncompte.numeroPiece?.length;
    }

    if (this.priseEncompte.codeGrille === 'A INDICE') {
      this.isIndiciaire = true;
    }

    if (this.priseEncompte.codeGrille === 'SOLDE GLOBALE') {
      this.isIndiciaire = true;
    }

    if (this.priseEncompte.codeGrille === 'CONVENTION') {
      this.isIndiciaire = true;
    }

    if (this.priseEncompte.codeGrille === 'CONVENTION') {
      this.isIndiciaire = true;
    }

    if (this.priseEncompte.natureActe === 'CAS PARTICULIERS') {
      this.isContrat = true;
    } else {
      this.isContrat = false;
    }
  }

  save(): void {
    //UPDATE ETABLISSEMENT
    this.priseEncompte.etablissementId = this.etablissementAgent?.id;
    this.priseEncompte.gradeId = this.gradeAgent.id;
    this.priseEncompte.echelonId = this.echelonAgent?.id;
    this.priseEncompte.indice = this.indiceAgent;
    this.priseEncompte.classeId = this.classeAgent?.id;
    if (this.priseEncompte.modeReglement === this.modeReglement1) {
      this.priseEncompte.reglementId = this.agenceAgent?.id;
    }
    if (this.priseEncompte.modeReglement === this.modeReglement2) {
      //
    }
    console.error(this.priseEncompte);

    if (
      this.priseEncompte.natureActe === null ||
      this.priseEncompte.natureActe === undefined ||
      this.priseEncompte.etablissementId === null ||
      this.priseEncompte.etablissementId === undefined ||
      this.priseEncompte.dateRecrutement === null ||
      this.priseEncompte.dateRecrutement === undefined ||
      this.priseEncompte.servicesId === null ||
      this.priseEncompte.servicesId === undefined ||
      this.priseEncompte.gradeId === null ||
      this.priseEncompte.gradeId === undefined ||
      this.priseEncompte.categorieAgent === null ||
      this.priseEncompte.categorieAgent === undefined ||
      this.priseEncompte.datePriseRang === null ||
      this.priseEncompte.datePriseRang === undefined ||
      this.priseEncompte.position === null ||
      this.priseEncompte.position === undefined ||
      this.priseEncompte.datedebut === null ||
      this.priseEncompte.datedebut === undefined ||
      this.priseEncompte.modeReglement === undefined ||
      this.priseEncompte.modeReglement === undefined
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: " Veuillez renseigner tous les champs obligatoires avant l'étape suivante !",
      });
    } else {
      if (this.priseEncompte.id !== undefined) {
        this.isSaving = true;
        console.error(this.priseEncompte);

        this.subscribeToSaveResponse(this.priseEncompteService.update(this.priseEncompte));
      }
    }
  }

  dateSaisie(date: any): void {
    if (date != null) {
      const a = dayjs(date);
      const annee1 = dayjs().year();
      const annee2 = a.toDate().getFullYear();
      this.age = annee1 - annee2;
    }
  }
  getSelectedTypePiece(typePiece: any): void {
    this.typePieceChoisi = typePiece;
    if (this.typePieceChoisi === 'PASSEPORT') {
      this.isPasseport = true;
      this.isCNI = false;
      this.numeroPiece = 10;
      //   this.priseEncompte.numeroPiece = '';
    } else {
      this.isPasseport = false;
      this.isCNI = true;
      this.numeroPiece = 14;
    }
    console.error('PASSEPORT : ', this.isPasseport);
    console.error('CNI : ', this.isCNI);
  }

  numeroPieceUnique(numeroPiece: any): void {
    this.isUnique = false;
    if (this.priseEncompte.typePiece) {
      this.priseEncompteService.numeroPieceUnique(this.priseEncompte.typePiece, numeroPiece.target.value).subscribe(
        (res: any) => {
          this.isUnique = res.body;
        },
        err => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: err.error.message,
          });
        }
      );
    }
  }

  onNavChange(changeEvent: NgbNavChangeEvent): void {
    if (changeEvent.nextId === 2) {
      const priseEncompte = this.priseEncompte;
      if (
        priseEncompte.typePiece === null ||
        priseEncompte.typePiece === undefined ||
        priseEncompte.numeroPiece === null ||
        priseEncompte.numeroPiece === undefined ||
        priseEncompte.prenom === null ||
        priseEncompte.prenom === undefined ||
        priseEncompte.nom === null ||
        priseEncompte.nom === undefined ||
        priseEncompte.dateNaissance === null ||
        priseEncompte.dateNaissance === undefined ||
        priseEncompte.lieuNaissance === null ||
        priseEncompte.lieuNaissance === undefined ||
        priseEncompte.sexe === null ||
        priseEncompte.sexe === undefined ||
        priseEncompte.nationalite === null ||
        priseEncompte.nationalite === undefined ||
        priseEncompte.telephone === null ||
        priseEncompte.telephone === undefined ||
        priseEncompte.adresse === null ||
        priseEncompte.adresse === undefined
        //  this.isUnique !== true
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: " Veuillez renseigner tous les champs obligatoires avant l'étape suivante !",
        });
        changeEvent.preventDefault();
      }
    }

    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  allerASituationAdmin(tab: NgbNav): void {
    const priseEncompte = this.priseEncompte;
    if (
      priseEncompte.typePiece === null ||
      priseEncompte.typePiece === undefined ||
      priseEncompte.numeroPiece === null ||
      priseEncompte.numeroPiece === undefined ||
      priseEncompte.prenom === null ||
      priseEncompte.prenom === undefined ||
      priseEncompte.nom === null ||
      priseEncompte.nom === undefined ||
      priseEncompte.dateNaissance === null ||
      priseEncompte.dateNaissance === undefined ||
      priseEncompte.lieuNaissance === null ||
      priseEncompte.lieuNaissance === undefined ||
      priseEncompte.sexe === null ||
      priseEncompte.sexe === undefined ||
      priseEncompte.nationalite === null ||
      priseEncompte.nationalite === undefined ||
      priseEncompte.telephone === null ||
      priseEncompte.telephone === undefined ||
      priseEncompte.adresse === null ||
      priseEncompte.adresse === undefined
      // this.isUnique !== true
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: " Veuillez renseigner tous les champs obligatoires avant l'étape suivante !",
      });
    } else {
      // if(priseEncompte.dateNaissance.year < 1995)
      tab.select(2);
    }
  }

  allerADocuments(tab: NgbNav): void {
    const priseEncompte = this.priseEncompte;
    console.error(priseEncompte);
    // priseEncompte.gradeId = this.gradeId;
    // priseEncompte.indiceId = this.indiceId;
    // priseEncompte.servicesId = this.servicesId;
    // priseEncompte.emploisId = this.emploisId;
    if (
      // priseEncompte.natureActe === null ||
      // priseEncompte.natureActe === undefined ||
      priseEncompte.etablissementId === null ||
      priseEncompte.etablissementId === undefined ||
      priseEncompte.dateRecrutement === null ||
      priseEncompte.dateRecrutement === undefined ||
      priseEncompte.servicesId === null ||
      priseEncompte.servicesId === undefined ||
      priseEncompte.gradeId === null ||
      priseEncompte.gradeId === undefined ||
      priseEncompte.categorieAgent === null ||
      priseEncompte.categorieAgent === undefined ||
      priseEncompte.datePriseRang === null ||
      priseEncompte.datePriseRang === undefined ||
      priseEncompte.position === null ||
      priseEncompte.position === undefined ||
      priseEncompte.datedebut === null ||
      priseEncompte.datedebut === undefined ||
      priseEncompte.modeReglement === undefined ||
      priseEncompte.modeReglement === undefined
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: " Veuillez renseigner tous les champs obligatoires avant l'étape suivante !",
      });
    } else {
      tab.select(3);
    }
  }

  getSelectedNatureActe(natureActe: any): void {
    if (natureActe.code === 'PEC_CONTRA') {
      this.isContrat = true;
    } else {
      this.isContrat = false;
    }
  }

  getTypeActesByEvenement(evenement: any): void {
    console.error(evenement);
    this.priseEncompte.natureActe = evenement.code;
    this.evenementService.find(evenement.id).subscribe((resulat: any) => {
      this.evenement = resulat.body;
      if (this.evenement.typeActes) {
        this.typeActes = this.evenement.typeActes;
      }
      this.envoyeEvenement();
    });
  }

  envoyeEvenement(): void {
    this.clickEvent.emit(this.typeActes);
  }

  selectEventEtablissement(item: any): any {
    this.etablissementChoisiId = item.id;
    this.priseEncompte.etablissementId = item.id;
    if (item.code === undefined) {
      this.priseEncompte.etablissementId = null;
    }

    this.priseEncompte.gradeId = null;
    this.priseEncompte.indiceId = null;
    this.priseEncompte.hierarchieId = null;
    this.priseEncompte.echelonId = null;
    this.priseEncompte.soldeIndiciaire = null;
    this.priseEncompte.servicesId = null;

    this.libelleService = '';
    this.priseEncompte.servicesId = null;
  }

  getSelectedDateRecrutement(param: any): void {
    this.dateRecrutement = param;
  }

  getSelectedDatePriseDeRang(param: any): void {
    console.error(this.datePriseDeRang);
    this.datePriseDeRang = param;
  }

  getSelectedDatePosition(param: any): void {
    this.datePosition = param;
  }

  onchangeEtablisement(param: any): void {
    console.error(param);

    if (param.conventionId !== null) {
      this.conventionService.find(param.conventionId).subscribe((result: any) => {
        this.convention = result.body;
        console.error(this.convention.code);
        if (this.convention.code === 'CONVENTION_ENTREPRISE') {
          this.isConventionEntreprise = true;
        } else {
          this.isConventionEntreprise = false;
        }
      });
      console.error(this.isConventionEntreprise);
    }
    if (param.conventionId === null) {
      this.isConventionEntreprise = false;
      console.error(this.isConventionEntreprise);
    }
  }

  getServicesByEtablissement(event: any): void {
    this.serviceService.findServicesByEtablissement(event.id).subscribe((resultat: any) => {
      this.services = resultat.body;
    });
  }

  onRemunerationChange(param: string): void {
    this.priseEncompte.hierarchieId = null;
    this.priseEncompte.echelonId = null;
    this.priseEncompte.gradeId = null;
    this.priseEncompte.indiceId = null;
    this.priseEncompte.soldeIndiciaire = null;
    this.priseEncompte.soldeGlobal = null;
    this.priseEncompte.classeId = null;
    this.priseEncompte.categorieId = null;
    this.indiceAgent = null;
    this.classeAgent = null;
    this.hierarchieAgent = null;
    this.echelonAgent = null;
    this.gradeAgent = new Grade();

    switch (param) {
      case 'SOLDE INDICIAIRE':
        this.isIndiciaire = true;
        this.isCasParticulier = false;
        this.isSoldeGlobal = false;
        this.isConvention = false;
        break;
      case 'SOLDE GLOBALE':
        this.isIndiciaire = false;
        this.isCasParticulier = false;
        this.isSoldeGlobal = true;
        this.isConvention = false;
        break;
      case 'CAS PARTICULIERS':
        this.isIndiciaire = false;
        this.isCasParticulier = true;
        this.isSoldeGlobal = false;
        this.isConvention = false;
        break;
      case 'CONVENTION':
        this.isIndiciaire = false;
        this.isCasParticulier = false;
        this.isSoldeGlobal = false;
        this.isConvention = true;
        break;
      default:
        break;
    }

    console.error(this.isCasParticulier, this.isConventionEntreprise, this.isIndiciaire);
  }

  selectEventEchelon(item: any): any {
    // this.echelonId = item.id;
    this.getGrilleSoldeGlobalByEchelon(item.id);
  }

  onFocused(e: any): any {
    // do something
  }

  onFocusedOut(e: any): any {
    // do something
  }

  onFocusedEmploi(e: any): any {
    // do something
  }
  onFocusedService(e: any): any {
    // do something
  }

  onFocusedBanque(e: any): any {
    // do something
  }

  onFocusedBilleteur(e: any): any {
    // do something
  }

  onChangeSearch(search: any): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onChangeEmploi(search: string): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  onChangeSearchService(search: string): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onChangeService(search: string): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onChangeSearchBanque(search: string): any {
    // fetch remote data from here
    this.priseEncompte.numeroCompte = null;
    this.codeAgence = null;
    this.codeBanque = null;
    this.libelleBanque = null;
  }

  onFocusOutNumeroCompte(event: any): void {
    // Swal.fire({
    //   text: 'veuillez saisir un numero valide',
    //   toast : true,
    // })
  }

  ajoutPiece(): any {
    this.ajoutActe = true;
  }

  fermerFormulaire(): any {
    this.ajoutActe = false;
  }

  printDocument(documentAdministratif: IDocumentAdministratif): void {
    this.isSaving = false;
  }

  deleteDocument(documentAdministratif: IDocumentAdministratif): void {
    this.isSaving = false;
    const modalRef = this.modalService.open(DocumentAdministratifDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.documentAdministratif = documentAdministratif;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPageD();
      }
    });
  }

  deleteDocumentAdmin(document: IDocumentAdministratif): void {
    if (this.documents) {
      for (let i = 0; i < this.documents.length; i++) {
        if (this.documents[i].nomDocument === document.nomDocument && this.documents[i].typeEntite === document.typeEntite) {
          this.documents.splice(i, 1);
        }
      }
    }
  }

  openFile(base64String: string | null | undefined, contentType: string | null | undefined): void {
    if (base64String !== undefined && base64String !== null) {
      return this.dataUtils.openFile(base64String, contentType);
    }
  }

  loadPageD(page?: number, dontNavigate?: boolean): void {
    // console.log("dans load",this.convention?.id);
    this.priseEnCompteId = 0;

    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.documentAdministratifService
      .findByProprietaire({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
        typeEntite: 'PRISE-EN-COMPTE',
      })
      .subscribe(
        (res: HttpResponse<IDocumentAdministratif[]>) => {
          this.isLoading = false;
          this.onSuccessad(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        err => {
          this.isLoading = false;
          this.onError(err);
        }
      );
  }

  getSelectedEtablissement(etablissementId: number | null | undefined): void {
    this.priseEncompte.servicesId = null;
    if (etablissementId !== null && etablissementId !== undefined) {
      this.etablissementId = etablissementId;
    }
  }

  getSelectedRemuneration(typeRemuneration: any): void {
    this.typeRemunerationChoisi = typeRemuneration;
  }

  previousState(): void {
    window.history.back();
  }

  delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  selectEventEmploi(item: any): any {
    // do something with selected item
    this.codeEmplois = item.code;
    this.emploisId = item.id;
    this.priseEncompte.emploisId = item.id;
    this.priseEncompte.codeEmplois = item.code;
    this.libelleEmploi = item.libelle;
  }

  selectEventGrade(item: any): any {
    this.gradeId = item.id;
    this.priseEncompte.indice = null;
    this.priseEncompte.hierarchieId = null;
    this.priseEncompte.echelonId = null;
    this.indiceAgent = null;
    this.hierarchieAgent = null;
    this.echelonAgent = null;
    // this.getHierarchieEchelonByGrade(item.id);
    // this.codeGrade = item.code;
  }

  getHierarchieEchelonByGrade(grade: number | null | undefined): void {
    if (this.isIndiciaire) {
      if (grade !== null && grade !== undefined) {
        const priseEncompte = this.priseEncompte;
        if (priseEncompte.indice?.id !== undefined && priseEncompte.indice?.id !== null) {
          this.grilleIndiciaireService.findGradeAndIndices(grade, priseEncompte.indice?.id).subscribe((result: any) => {
            priseEncompte.grilleIndiciaire = result.body;
            if (priseEncompte.grilleIndiciaire === null) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur...',
                text: ' Veuillez vérifier la correspondance grade indice dans la grille !',
              });
            }
            if (priseEncompte.grilleIndiciaire) {
              if (priseEncompte.grilleIndiciaire.hierarchieId && priseEncompte.grilleIndiciaire.echelonId) {
                this.hierarchieService.find(priseEncompte.grilleIndiciaire.hierarchieId).subscribe((resulthierarchie: any) => {
                  priseEncompte.hierarchie = resulthierarchie.body;
                  this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;

                  (this.hierarchieId = priseEncompte.hierarchie?.libelle),
                    (this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire);
                });
              }
            }

            if (priseEncompte.grilleIndiciaire) {
              if (priseEncompte.grilleIndiciaire.echelonId) {
                this.echelonService.find(priseEncompte.grilleIndiciaire.echelonId).subscribe((resultechelon: any) => {
                  priseEncompte.echelon = resultechelon.body;
                  this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;
                });
              }
            }
          });
        }
      } else {
        this.priseEncompte.hierarchieId = null;
        this.priseEncompte.echelonId = null;
      }
    }
  }

  onFocusOutEventGrade(item: any): any {
    this.priseEncompte.indice = null;
    this.priseEncompte.hierarchieId = null;
    this.priseEncompte.echelonId = null;
    this.indiceAgent = null;
    this.hierarchieAgent = null;
    this.echelonAgent = null;

    if (item.target.value !== null && item.target.value !== undefined && item.target.value !== '') {
      this.gradeService.findByCode(item.target.value).subscribe(
        (res: any) => {
          this.gradeId = res.body.id;
          this.grade = res.body.code;
          this.gradeAgent = res.body;
          this.getHierarchieEchelonByGrade(this.gradeId);
          this.codeGrade = res.body.code;
        },
        err => {
          this.gradeId = null;
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: err.error.message,
          });
        }
      );
    }
  }

  onFocusOutEventGrade2(item: any): any {
    if (item.target.value !== null && item.target.value !== undefined && item.target.value !== '') {
      this.gradeService.findByCode(item.target.value).subscribe(
        (res: any) => {
          this.gradeId = res.body.id;
          this.gradeAgent = res.body;
          this.grade = res.body.code;
          this.getGrilleConventionbyGrade(this.gradeId);
          this.getGrilleConventionEntreprisebyGrade(this.gradeId);
        },
        err => {
          this.gradeId = null;
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: err.error.message,
          });
        }
      );
    }
  }

  selectEventGrade2(item: any): any {
    this.gradeId = item.id;
    this.getGrilleConventionbyGrade(item.id);
    this.getGrilleConventionEntreprisebyGrade(item.id);
  }

  onFocusOutEventIndice(item: any): any {
    if (item.target.value !== null && item.target.value !== undefined && item.target.value !== '') {
      this.indicesService.findByCode(item.target.value).subscribe(
        (res: any) => {
          this.indiceId = res.body.id;
          this.indiceAgent = res.body;
          this.getHierarchieEchelonByIndice(this.indiceId);
        },
        err => {
          this.indiceId = null;
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: err.error.message,
          });
        }
      );
    }
  }

  selectEventIndice(item: any): any {
    this.indiceId = item.id;
    this.getHierarchieEchelonByIndice(item.id);
  }

  selectEventClasse(item: any): any {
    this.classeId = item.id;
    this.getGrilleConventionbyClasse(item.id);
  }

  selectEventBanque(item: any): any {
    this.libelleBanque = item.libelle;
    this.codeAgence = item.code;
    this.codeBanque = item.etablissementBancaire.code;
    // this.editForm.patchValue({
    //   codeAgence: item.code,
    // }); // do something with selected item
  }

  selectEventHierarchie(item: any): any {
    // do something with selected item
  }

  getHierarchieEchelonByIndice(indice: number | null | undefined): void {
    if (indice !== null && indice !== undefined) {
      const priseEncompte = this.priseEncompte;
      if (this.gradeId) {
        this.grilleIndiciaireService.findGradeAndIndices(this.gradeId, indice).subscribe((result: any) => {
          priseEncompte.grilleIndiciaire = result.body;
          if (priseEncompte.grilleIndiciaire === null) {
            Swal.fire({
              icon: 'error',
              title: 'Erreur...',
              text: ' Veuillez vérifier la correspondance grade indice dans la grille indiciaire!',
            });
          }
          if (priseEncompte.grilleIndiciaire) {
            if (priseEncompte.grilleIndiciaire.hierarchieId && priseEncompte.grilleIndiciaire.echelonId) {
              this.hierarchieService.find(priseEncompte.grilleIndiciaire.hierarchieId).subscribe((resulthierarchie: any) => {
                priseEncompte.hierarchie = resulthierarchie.body;
                this.hierarchieAgent = resulthierarchie.body;
                this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;

                this.priseEncompte.hierarchieId = this.hierarchieAgent?.id;
                /// soldeIndiciaire: priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire,
              });
            }

            // this.editForm.patchValue({
            //   hierarchieId: priseEncompte.grilleIndiciaire.hierarchieId,
            //   echelonId: priseEncompte.grilleIndiciaire.echelonId,
            // });
          }
          if (priseEncompte.grilleIndiciaire) {
            if (priseEncompte.grilleIndiciaire.echelonId) {
              this.echelonService.find(priseEncompte.grilleIndiciaire.echelonId).subscribe((resultechelon: any) => {
                priseEncompte.echelon = resultechelon.body;
                this.echelonAgent = resultechelon.body;
                this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;
              });
            }
          }
        });
      }
    }
  }

  getGrilleConventionbyGrade(grade: number | null | undefined): void {
    console.error('Grade :', grade);

    if (this.isConvention) {
      if (grade !== null && grade !== undefined) {
        const priseEncompte = this.priseEncompte;
        console.error('Etablissement :', priseEncompte.etablissementId);
        console.error('Classe :', priseEncompte.classeId);
        console.error('Categorie :', priseEncompte.categorieId);

        if (
          priseEncompte.etablissementId !== undefined &&
          priseEncompte.etablissementId !== null &&
          priseEncompte.classeId !== undefined &&
          priseEncompte.classeId !== null &&
          priseEncompte.categorieId !== undefined &&
          priseEncompte.categorieId !== null
        ) {
          this.grilleConventionService
            .findGrilleConvention(grade, priseEncompte.classeId, priseEncompte.categorieId, priseEncompte.etablissementId)
            .subscribe((result: any) => {
              priseEncompte.grilleConvention = result.body;
              if (priseEncompte.grilleConvention === null) {
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur...',
                  text: ' Veuillez vérifier la correspondance dans grille Convention !',
                });
              }

              // this.editForm.patchValue({
              //   soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
              //   classeId: priseEncompte.grilleConvention?.classeId,
              // });

              if (priseEncompte.grilleIndiciaire) {
                if (priseEncompte.grilleIndiciaire.echelonId) {
                  this.echelonService.find(priseEncompte.grilleIndiciaire.echelonId).subscribe((resultechelon: any) => {
                    this.priseEncompte.echelon = resultechelon.body;
                    this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;

                    this.priseEncompte.echelonId = priseEncompte.echelon?.id;
                    this.priseEncompte.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;
                  });
                }
              }
            });
        }
      } else {
        this.priseEncompte.soldeGlobal = null;
      }
    }
  }

  getGrilleConventionEntreprisebyGrade(grade: number | null | undefined): void {
    console.error('Grade :', grade);

    if (this.isConvention) {
      if (grade !== null && grade !== undefined) {
        const priseEncompte = this.priseEncompte;
        console.error('Etablissement :', priseEncompte.etablissementId);
        console.error('Categorie :', priseEncompte.categorieId);

        if (
          priseEncompte.etablissementId !== undefined &&
          priseEncompte.etablissementId !== null &&
          priseEncompte.categorieId !== undefined &&
          priseEncompte.categorieId !== null
        ) {
          this.grilleConventionService
            .findGrilleConventionEntreprise(grade, priseEncompte.categorieId, priseEncompte.etablissementId)
            .subscribe((result: any) => {
              priseEncompte.grilleConvention = result.body;
              if (priseEncompte.grilleConvention === null) {
                Swal.fire({
                  icon: 'error',
                  title: 'Erreur...',
                  text: ' Veuillez vérifier la correspondance dans grille Convention !',
                });
              }
              this.salairedeBase = priseEncompte.soldeGlobal!;

              if (priseEncompte.grilleIndiciaire) {
                if (priseEncompte.grilleIndiciaire.echelonId) {
                  this.echelonService.find(priseEncompte.grilleIndiciaire.echelonId).subscribe((resultechelon: any) => {
                    priseEncompte.echelon = resultechelon.body;
                    this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;

                    // this.editForm.patchValue({
                    //   echelonId: priseEncompte.echelon?.libelle,
                    //   soldeIndiciaire: priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire,
                    // });
                  });
                }
              }
            });
        }
      } else {
        // this.editForm.patchValue({
        //   soldeGlobal: null,
        // });
      }
    }
  }

  getGrilleConventionbyClasse(classe: number | null | undefined): void {
    console.error('Classe :', classe);

    if (classe !== null && classe !== undefined) {
      const priseEncompte = this.priseEncompte;

      if (
        priseEncompte.etablissementId !== undefined &&
        priseEncompte.etablissementId !== null &&
        priseEncompte.gradeId !== undefined &&
        priseEncompte.gradeId !== null &&
        priseEncompte.categorieId !== undefined &&
        priseEncompte.categorieId !== null
      ) {
        this.grilleConventionService
          .findGrilleConvention(priseEncompte.gradeId, classe, priseEncompte.categorieId, priseEncompte.etablissementId)
          .subscribe((result: any) => {
            priseEncompte.grilleConvention = result.body;
            if (priseEncompte.grilleConvention === null) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur...',
                text: ' Veuillez vérifier la correspondance dans grille Convention !',
              });
            }
            // this.salairedeBase = this.editForm.value['soldeGlobal'];
          });
      }
    } else {
      //
    }
  }

  // GET SALAIRE DE BASE BY GRADE ETABLISSEMENT CLASSE AND CATEGORIE (CONVENTION COLLECTIVE)
  getGrilleConventionbyCategorie(categorie: number | null | undefined): void {
    if (categorie !== null && categorie !== undefined) {
      const priseEncompte = this.priseEncompte;
      priseEncompte.gradeId = this.gradeId;

      if (
        priseEncompte.etablissementId !== undefined &&
        priseEncompte.etablissementId !== null &&
        priseEncompte.gradeId !== undefined &&
        priseEncompte.gradeId !== null &&
        priseEncompte.classeId !== undefined &&
        priseEncompte.classeId !== null
      ) {
        this.grilleConventionService
          .findGrilleConvention(priseEncompte.gradeId, priseEncompte.classeId, categorie, priseEncompte.etablissementId)
          .subscribe((result: any) => {
            priseEncompte.grilleConvention = result.body;
            if (priseEncompte.grilleConvention === null) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur...',
                text: ' Veuillez vérifier la correspondance dans grille Convention !',
              });
            }

            priseEncompte.soldeGlobal = priseEncompte.grilleConvention?.salaireDeBase;
            priseEncompte.classeId = priseEncompte.grilleConvention?.classeId;
            if (priseEncompte.grilleConvention?.salaireDeBase) {
              this.salairedeBase = priseEncompte.grilleConvention?.salaireDeBase;
            }
            if (result.body === null || result.body === undefined) {
              priseEncompte.soldeGlobal = null;
            }
          });
      }
    } else {
      this.priseEncompte.soldeGlobal = null;
    }
  }

  // GET SALAIRE DE BASE BY GRADE ETABLISSEMENT AND CATEGORIE (CONVENTION D'ENTREPRISE)
  getGrilleConventionEntreprisebyCategorie(categorie: number | null | undefined): void {
    if (categorie !== null && categorie !== undefined) {
      const priseEncompte = this.priseEncompte;
      priseEncompte.gradeId = this.gradeId;

      if (
        priseEncompte.etablissementId !== undefined &&
        priseEncompte.etablissementId !== null &&
        priseEncompte.gradeId !== undefined &&
        priseEncompte.gradeId !== null
      ) {
        this.grilleConventionService
          .findGrilleConventionEntreprise(priseEncompte.gradeId, categorie, priseEncompte.etablissementId)
          .subscribe((result: any) => {
            priseEncompte.grilleConvention = result.body;
            if (priseEncompte.grilleConvention === null) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur...',
                text: ' Veuillez vérifier la correspondance dans grille Convention!',
              });
            }

            priseEncompte.soldeGlobal = priseEncompte.grilleConvention?.salaireDeBase;
            priseEncompte.classeId = priseEncompte.grilleConvention?.classeId;

            if (priseEncompte.grilleConvention?.salaireDeBase) {
              this.salairedeBase = priseEncompte.grilleConvention?.salaireDeBase;
            }
            if (result.body === null || result.body === undefined) {
              priseEncompte.soldeGlobal = null;
            }
          });
      }
    } else {
      this.priseEncompte.soldeGlobal = null;
    }
  }

  isLogeChecked(event: any): void {
    if (event.target.checked === true) {
      this.isLoge = true;
    }

    if (event.target.checked === false) {
      this.isLoge = false;
    }
  }

  selectEventCategorie(item: any): any {
    this.categorieId = item.id;
    this.getGrilleConventionbyCategorie(item.id);
    this.getGrilleConventionEntreprisebyCategorie(item.id);
  }

  getGrilleSoldeGlobalByEchelon(echelon: number | null | undefined): void {
    if (echelon !== null && echelon !== undefined) {
      const priseEncompte = this.priseEncompte;
      if (
        priseEncompte.gradeId !== undefined &&
        priseEncompte.gradeId !== null &&
        priseEncompte.hierarchieId !== undefined &&
        priseEncompte.hierarchieId !== null
      ) {
        this.grilleSoldeGlobalService
          .findGrilleSoldeGlobal(priseEncompte.gradeId, priseEncompte.hierarchieId, echelon)
          .subscribe((result: any) => {
            priseEncompte.grilleSoldeGlobal = result.body;
            if (priseEncompte.grilleSoldeGlobal === null) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur...',
                text: ' Veuillez vérifier la correspondance dans grille solde Global !',
              });
            }
            // this.editForm.patchValue({
            //   soldeGlobal: priseEncompte.grilleSoldeGlobal?.soldeGlobal,
            //   classeId: priseEncompte.grilleSoldeGlobal?.classeId,
            // });
          });
      }
    } else {
      // this.editForm.patchValue({
      //   soldeGlobal: null,
      // });
    }
  }

  ajouterDocument(): void {
    this.compteurDocument = 0;
    const document = this.document;
    const documentAjoute = new DocumentAdministratif();
    console.error(document);
    console.error(this.documentsAdministratif);
    if (
      document?.numero === undefined ||
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

      document.fichier = null;
      document.fichierContentType = null;
      document.numero = null;
      document.date = null;
      //document.natureActe = null;
      document.typeActes = null;
    }
  }

  retirerDocument(document: IDocumentAdministratif): void {
    if (this.documentsAdministratif) {
      for (let i = 0; i < this.documentsAdministratif.length; i++) {
        // if (this.elementsVar[i].matricule === document.matricule && this.document[i].montant === element.montant) {
        this.documentsAdministratif.splice(i, 1);
        // }
      }
    }
  }

  onModeReglementChange(param: any): void {
    this.isModeBanque = false;
    this.modeReglementChoisi = param;
    this.priseEncompte.agenceId = null;
    this.priseEncompte.billeteurId = null;
    this.priseEncompte.reglementId = null;
    this.priseEncompte.numeroCompte = null;
    this.agenceAgent = null;
    this.codeAgence = null;
    this.codeBanque = null;
    this.libelleBanque = null;
    if (param.code === 'BANQUE') {
      this.isModeBanque = true;
      this.isBilleteur = false;
    }

    if (param.code === 'BILLETAGE') {
      this.isBilleteur = true;
    }
  }

  refresh(): void {
    window.location.reload();
  }

  public afficheMessage(msg: string, typeMessage?: string): void {
    this.typeMessage = typeMessage;
    this._success.next(msg);
  }

  protected sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? 'asc' : 'desc')];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }

  protected onSuccessad(data: IDocumentAdministratif[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    this.documentsAdministratif = data ?? [];
    console.error(' this.documentsAdministratif ', this.documentsAdministratif);
    this.ngbPaginationPage = this.page;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPriseEnCompte>>): void {
    result.subscribe(
      (res: HttpResponse<IPriseEnCompte>) => this.onSaveSuccess(res.body),
      (res: HttpErrorResponse) => this.onSaveError(res)
    );
  }

  protected onSaveSuccess(priseEncompte: IPriseEnCompte | null): void {
    if (priseEncompte !== null) {
      this.priseEncompte = priseEncompte;

      this.isSaving = false;

      if (this.priseEncompte.id !== undefined) {
        Swal.fire({
          icon: 'success',
          title: 'Réussi ',
          text: 'Modification effectuée avec succès',
        }).then(result => {
          if (result.isConfirmed) {
            this.previousState();
          }
        });
      }
    }
  }

  protected onSaveError(err: any): void {
    Swal.fire({
      icon: 'error',
      title: 'Erreur...',
      text: err.error.message,
    });
  }

  protected loadRelationshipsOptions(): void {
    this.etablissementService
      .findAll()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(map((etablissement: IEtablissement[]) => this.etablissementService.addEtablissementToCollectionIfMissing(etablissement)))
      .subscribe((etablissement: IEtablissement[]) => (this.etablissementSharedCollection = etablissement));

    // On charge les données venant de la table table_valeur : type de pièce, CNI ou passeport
    this.tableValeurService
      .findTypePiece()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((typePiece: ITableValeur[]) => (this.typePiece = typePiece));

    // On charge les données venant de la table table_valeur : GENRE
    this.tableValeurService
      .findGenre()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((genre: ITableValeur[]) => (this.genre = genre));

    // On charge les nationalités
    this.nationaliteService
      .query()
      .pipe(map((res: HttpResponse<INationalite[]>) => res.body ?? []))
      .pipe(map((nationalite: INationalite[]) => this.nationaliteService.addNationaliteToCollectionIfMissing(nationalite)))
      .subscribe((nationalite: INationalite[]) => (this.nationaliteSharedCollection = nationalite));

    // On charge l'ensemble des événements
    this.evenementService
      .query()
      .pipe(map((res: HttpResponse<IEvenement[]>) => res.body ?? []))
      .pipe(map((evenement: IEvenement[]) => this.evenementService.addEvenementToCollectionIfMissing(evenement)))
      .subscribe((evenement: IEvenement[]) => (this.evenementSharedCollection = evenement));

    // On charge les données venant de la table table_valeur : type de rémunération
    this.tableValeurService
      .findRemuneration()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((typeRemuneration: ITableValeur[]) => (this.typeRemuneration = typeRemuneration));

    this.categorieAgentService
      .query()
      .pipe(map((res: HttpResponse<ICategorieAgent[]>) => res.body ?? []))
      .pipe(map((categorieAgent: ICategorieAgent[]) => this.categorieAgentService.addCategorieAgentToCollectionIfMissing(categorieAgent)))
      .subscribe((categorieAgent: ICategorieAgent[]) => (this.categorieAgentSharedCollection = categorieAgent));

    this.echelonService
      .findAll()
      .pipe(map((res: HttpResponse<IEchelon[]>) => res.body ?? []))
      .pipe(map((echelon: IEchelon[]) => this.echelonService.addEchelonToCollectionIfMissing(echelon)))
      .subscribe((echelon: IEchelon[]) => (this.echelonSharedCollection = echelon));

    this.classeService
      .findAll()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(map((classe: IClasse[]) => this.classeService.addClasseToCollectionIfMissing(classe)))
      .subscribe((classe: IClasse[]) => (this.classeSharedCollection = classe));

    this.gradeService
      .findAll()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grade: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing(grade)))
      .subscribe((grade: IGrade[]) => (this.gradeSharedCollection = grade));

    this.indicesService
      .findAll()
      .pipe(map((res: HttpResponse<IIndices[]>) => res.body ?? []))
      .pipe(map((indices: IIndices[]) => this.indicesService.addIndicesToCollectionIfMissing(indices)))
      .subscribe((indices: IIndices[]) => (this.indicesSharedCollection = indices));

    this.hierarchieService
      .findAll()
      .pipe(map((res: HttpResponse<IHierarchie[]>) => res.body ?? []))
      .pipe(map((hierarchie: IHierarchie[]) => this.hierarchieService.addHierarchieToCollectionIfMissing(hierarchie)))
      .subscribe((hierarchie: IHierarchie[]) => (this.hierarchieSharedCollection = hierarchie));

    this.positionsService
      .findAll()
      .pipe(map((res: HttpResponse<IPositions[]>) => res.body ?? []))
      .pipe(map((position: IPositions[]) => this.positionsService.addPositionsToCollectionIfMissing(position)))
      .subscribe((position: IPositions[]) => (this.positionSharedCollection = position));

    this.emploisService
      .findAll()
      .pipe(map((res: HttpResponse<IEmplois[]>) => res.body ?? []))
      .pipe(map((emplois: IEmplois[]) => this.emploisService.addEmploisToCollectionIfMissing(emplois)))
      .subscribe((emplois: IEmplois[]) => (this.emploisSharedCollection = emplois));

    this.categorieService
      .findAll()
      .pipe(map((res: HttpResponse<ICategorie[]>) => res.body ?? []))
      .pipe(map((categorie: ICategorie[]) => this.categorieService.addCategorieToCollectionIfMissing(categorie)))
      .subscribe((categorie: ICategorie[]) => (this.categorieSharedCollection = categorie));

    this.agenceService
      .findAll()
      .pipe(map((res: HttpResponse<IAgence[]>) => res.body ?? []))
      .pipe(map((agence: IAgence[]) => this.agenceService.addAgenceToCollectionIfMissing(agence)))
      .subscribe((agence: IAgence[]) => (this.agenceSharedCollection = agence));

    this.billeteurService
      .findAll()
      .pipe(map((res: HttpResponse<IBilleteur[]>) => res.body ?? []))
      .pipe(map((billeteur: IBilleteur[]) => this.billeteurService.addBilleteurToCollectionIfMissing(billeteur)))
      .subscribe((billeteur: IBilleteur[]) => (this.billeteurSharedCollection = billeteur));

    // On charge les données venant de la table table_valeur : MODE_REGLEMENT
    this.tableValeurService
      .findModeReglement()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((modeReglement: ITableValeur[]) => (this.modeReglement = modeReglement));

    // On charge les données venant de la table table_valeur : NATURE_ACTES
    this.tableValeurService
      .findNatureActes()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((natureActes: ITableValeur[]) => (this.natureActes = natureActes));
  }

  protected onError(message: string): void {
    throw new Error('Method not implemented.');
  }

  protected onSaveSuccessAndShow(successMessage: string): void {
    this.isSaving = false;
    this.previousState();
  }
}
