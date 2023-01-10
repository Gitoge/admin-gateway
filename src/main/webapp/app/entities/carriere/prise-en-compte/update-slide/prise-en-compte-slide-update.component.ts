import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { finalize, debounceTime, map, filter } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPriseEnCompte, PriseEnCompte } from '../prise-en-compte.model';
import { PriseEnCompteService } from '../service/prise-en-compte.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { NgbAlert, NgbModal, NgbModalRef, NgbNav, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { AgentService } from '../../agent/service/agent.service';
import { ICategorieAgent } from '../../categorie-agent/categorie-agent.model';
import { IService } from '../../../service/service.model';
import { ServiceService } from '../../../service/service/service.service';
import { IEmplois } from '../../../emplois/emplois.model';
import { EmploisService } from '../../../emplois/service/emplois.service';
import { IPositions } from '../../../positions/positions.model';
import { PositionsService } from '../../../positions/service/positions.service';
import { IEtablissement } from '../../../etablissement/etablissement.model';
import { EtablissementService } from '../../../etablissement/service/etablissement.service';
import { IBilleteur } from 'app/entities/billeteur/billeteur.model';
import { BilleteurService } from 'app/entities/billeteur/service/billeteur.service';
import { CategorieAgentService } from '../../categorie-agent/service/categorie-agent.service';
import { FormEnfantComponent } from '../form-enfant/form-enfant.component';
import { IEnfant } from '../../enfant/enfant.model';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { EnfantService } from '../../enfant/service/enfant.service';
import { NationaliteService } from '../../nationalite/service/nationalite.service';
import { INationalite } from '../../nationalite/nationalite.model';
import { IEchelon } from 'app/entities/echelon/echelon.model';
import { IHierarchie } from 'app/entities/hierarchie/hierarchie.model';
import { EchelonService } from 'app/entities/echelon/service/echelon.service';
import { HierarchieService } from 'app/entities/hierarchie/service/hierarchie.service';
import { IGrilleIndiciaire } from '../../grille-indiciaire/grille-indiciaire.model';
import { GrilleIndiciaireService } from '../../grille-indiciaire/service/grille-indiciaire.service';
import { PieceAdministrativeComponent } from '../piece-administrative';
import { DocumentAdministratif, IDocumentAdministratif } from '../../document-administratif/document-administratif.model';
import { DocumentAdministratifDeleteDialogComponent } from '../../document-administratif/delete/document-administratif-delete-dialog.component';
import { DataUtils, FileLoadError } from '../../../../core/util/data-util.service';
import { DocumentAdministratifService } from '../../document-administratif/service/document-administratif.service';
import { ParamMatriculesService } from '../../param-matricules/service/param-matricules.service';
import { IParamMatricules, ParamMatricules } from '../../param-matricules/param-matricules.model';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { IGrade } from 'app/entities/grade/grade.model';
import { GradeService } from 'app/entities/grade/service/grade.service';
import { IndicesService } from '../../indices/service/indices.service';
import { IIndices } from '../../indices/indices.model';
import { ICategorie } from 'app/entities/categorie/categorie.model';
import { CategorieService } from 'app/entities/categorie/service/categorie.service';
import { GrilleConventionService } from '../../grille-convention/service/grille-convention.service';
import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';
import { TableValeurService } from 'app/entities/table-valeur/service/table-valeur.service';
import { Emoluments, IEmoluments } from 'app/entities/paie/emoluments/emoluments.model';
import Swal from 'sweetalert2';
import { ConventionService } from '../../convention/service/convention.service';
import { EmolumentsService } from 'app/entities/paie/emoluments/service/emoluments.service';
import { IConvention } from '../../convention/convention.model';
import { GrilleSoldeGlobalService } from '../../grille-solde-global/service/grille-solde-global.service';
import { EvenementService } from '../../evenement/service/evenement.service';
import { IEvenement } from '../../evenement/evenement.model';
import { ITypeActes } from '../../type-actes/type-actes.model';

import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { AugmentationIndiceService } from '../../../paie/augmentation-indice/service/augmentation-indice.service';
import { PosteCompoGradeService } from '../../../paie/poste-compo-grade.service';
import { AgenceService } from 'app/entities/agence/service/agence.service';
import { IAgence } from 'app/entities/agence/agence.model';
import { Dayjs } from 'dayjs';
import { text } from 'stream/consumers';
import { ParametreService } from '../../parametre/service/parametre.service';
@Component({
  selector: 'jhi-prise-en-compte-slide-update',
  templateUrl: './prise-en-compte-slide-update.component.html',
  styleUrls: ['../prise-en-compte.scss'],
})
export class PriseEnCompteSlideUpdateComponent implements OnInit {
  isSaving = false;

  userInsert: any;

  matricule = '';

  priseEnCompteId: any;

  soldeIndiciaire: any;

  totalTaux: any;

  taux: any;

  age!: number;

  modalRef?: NgbModalRef;

  priseEncompte!: IPriseEnCompte;
  documentsAdministratif?: IDocumentAdministratif[] = [];
  document?: IDocumentAdministratif;
  priseEnCompte!: IPriseEnCompte;
  categorieAgentSharedCollection: ICategorieAgent[] = [];
  categorieSharedCollection: ICategorieAgent[] = [];
  serviceSharedCollection: IService[] = [];

  positionSharedCollection: IPositions[] = [];
  etablissementSharedCollection: IEtablissement[] = [];
  emploisSharedCollection: IEmplois[] = [];
  services: IService[] = [];
  nationaliteSharedCollection: INationalite[] = [];
  echelonSharedCollection: IEchelon[] = [];
  hierarchieSharedCollection: IHierarchie[] = [];
  classeSharedCollection: IClasse[] = [];
  gradeSharedCollection: IGrade[] = [];
  indicesSharedCollection: IIndices[] = [];

  keyword = 'libelleLong';

  keywordBanque = 'code';

  libelleBanque: any;
  codeBanque: any;
  codeAgence: any;

  keywordGrade = 'code';

  keywordEmploi = 'code';

  libelleEmploi: any;

  codeService: any;

  libelleService: any;

  keywordService = 'code';

  keywordClasse = 'libelle';

  keywordEchelon = 'libelle';

  keywordIndice = 'libelle';

  keywordHierarchie = 'libelle';

  keywordCategorie = 'libelle';

  keywordBilleteur = 'prenom';

  billeteurSharedCollection: IBilleteur[] = [];

  agenceSharedCollection: IAgence[] = [];

  evenementSharedCollection: IEvenement[] = [];

  // ----------------------------------------

  success: any;

  typeMessage?: string;
  _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage = '';

  active: any;

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

  isConventionEntreprise = false;

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

  hierarchieId!: number;
  echelonId!: any;

  gradeId!: any;

  classeId!: number;

  categorieId!: number;

  etablissementId!: number;

  emploisId!: any;

  servicesId!: any;

  codeEmplois!: string;

  indiceId!: any;

  etablissementChoisiId!: number;
  isLoge!: boolean;

  matriculeA: any;

  matriculeAgen: any;

  isLogementFonction!: boolean;

  isCDI!: boolean;

  isPasseport!: boolean;

  isCNI!: boolean;

  canSave!: boolean;
  isPieceCorrect!: boolean;

  grilleIndicaire!: IGrilleIndiciaire;

  typeRemuneration!: ITableValeur[];

  typeRemunerationChoisi!: ITableValeur;

  typePiece!: ITableValeur[];

  typePieceChoisi!: ITableValeur;

  statutMarital!: ITableValeur[];

  statutMaritalChoisi!: ITableValeur;

  genre!: ITableValeur[];

  convention!: IConvention;

  genreChoisi!: ITableValeur;

  natureActes!: ITableValeur[];

  natureActeChoisi!: ITableValeur;

  typeActes!: ITypeActes[];

  evenement!: IEvenement;

  modeReglement!: ITableValeur[];

  modeReglementChoisi!: ITableValeur;

  salairedeBase!: number;

  today: any;

  dateRecrutement?: any;
  datePriseDeRang?: any;
  datePosition?: any;
  dateAnnulation?: any;
  codeGrade: any;

  @ViewChild('staticAlert', { static: false }) staticAlert?: NgbAlert;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert?: NgbAlert;

  @Output() clickEvent = new EventEmitter<ITypeActes[]>();

  editForm = this.fb.group({
    id: [],
    code: [],
    libelle: [null],

    // Informations communes
    userInsertId: [],
    userUpdateId: [],
    dateInsert: [],
    dateUpdate: [],
    //

    categorieAgent: [null, [Validators.required]],
    categorie: [],
    service: [],
    emplois: [],
    etablissement: [],
    etablissementId: [],
    billeteur: [],
    agence: [],
    echelon: [],
    hierarchie: [],
    classe: [],
    grade: [],
    indice: [],

    // Informations Agents :
    matricule: [],
    typePiece: [],
    numeroPiece: [null, [Validators.minLength(10), Validators.maxLength(14), Validators.pattern('^[a-zA-Z0-9]*$')]],
    prenom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    nom: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
    dateNaissance: [null, [Validators.required]],
    lieuNaissance: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    sexe: [null, [Validators.required]],
    nomMari: [],
    telephone: [null, [Validators.required, Validators.minLength(9), Validators.pattern('^[Z0-9]*$')]],
    email: [null],
    adresse: [],
    femmeMariee: [],
    datePriseEnCharge: [],
    dateSortie: [],
    status: [],
    titre: [],
    nationalite: [null, [Validators.required]],

    // Situation Familiale :
    situationMatrimoniale: [null],
    nombreEpouse: [],
    conjointSalarie: [],
    nombreEnfant: [],
    nombrePart: [],
    nombreEnfantImposable: [],
    nombreEnfantMajeur: [],
    nombreMinimumFiscal: [],
    nombreEnfantDecede: [],
    enfants: [],

    // Situation Administrative :

    dateRecrutement: [null, [Validators.required]],
    // numeroRecrutement: [null, [Validators.required]],
    datePriseRang: [null, [Validators.required]],
    numeroOrdreService: [],
    dateOrdreService: [],
    loge: [],
    logementFonction: [],
    datedebut: [null, [Validators.required]],
    datefin: [],
    numeroCompte: [null, [Validators.minLength(15), Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9]*$')]],
    corpsId: [],
    hierarchieId: [],
    cadreId: [],
    categorieId: [],
    gradeId: [],
    indiceId: [],
    echelonId: [],
    classeId: [],
    position: [null, [Validators.required]],
    agenceId: [],
    reglementId: [],
    billeteurId: [],
    modeReglement: [null, [Validators.required]],
    emploisId: [],
    servicesId: [],
    grilleIndiciaire: [],
    grilleConvention: [],
    soldeGlobal: [],
    soldeGlobalCP: [],
    soldeIndiciaire: [],
    typeRemuneration: [],
    codeEmplois: [],
    natureActe: [null, [Validators.required]],
    cdi: [],
    cleRib: [],
    codeAgence: [],
    codeBanque: [],
    evenement: [],

    fichier: [],
    fichierContentType: [],
    numero: [],
    date: [],
    natureActes: [],
    typeActes: [],
  });

  nombreEnfant: any;
  nombreEpouse: any;
  natureActe: any;
  isContrat = false;

  file?: File;

  ajoutActe!: boolean;

  compteurDocument!: number;

  minDateNaissance?: dayjs.Dayjs;
  isUnique: any;
  grade!: string;

  ageMinPEC!: number;

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
    protected eventManager: EventManager,
    protected parametreService: ParametreService
  ) {}

  initMessage(): void {
    this._success.subscribe(message => (this.successMessage = message));
    this._success.pipe(debounceTime(1000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.selfClosingAlert.close();
      }
    });
  }

  ngOnInit(): void {
    (this.compteurDocument = 0),
      this.activatedRoute.data.subscribe(({ priseEncompte }) => {
        this.priseEncompte = priseEncompte;
        this.nombreEnfant = 0;
        this.nombreEpouse = 0;
        if (priseEncompte.id === undefined) {
          const today = dayjs().startOf('day');
          this.dateRecrutement = today;
          this.datePriseDeRang = today;
          this.datePosition = today;
          this.dateAnnulation = today;
          priseEncompte.dateInsert = today;
          priseEncompte.dateUpdate = today;
        }
        this.updateForm(priseEncompte);
      });
    this.loadRelationshipsOptions();

    this.sauvegardeAgent = false;

    this.isLoge = false;

    this.isPasseport = false;

    this.isCNI = false;

    this.isLogementFonction = false;

    this.isCDI = false;

    this.isUnique = false;

    this.today = dayjs().startOf('day');
    this.userInsert = this.stateStorageService.getPersonne().id;

    this.parametreService.getAgeMinPEC().subscribe((result: any) => {
      this.ageMinPEC = result.body;
    });
  }
  effacer(): void {
    const dirtyFormID = 'field_prenom';
    const resetForm = <HTMLFormElement>document.getElementById(dirtyFormID);
    resetForm.reset();
  }

  test(): any {
    Swal.fire(
      '<h3 style="font-family: arial">Prise en compte de test test <br> effectuée avec succés</h3>',
      `Le matricule generé est :<br><br> <h2 style="text-shadow: 1px 1px 1px black, 2px 2px 1px black"> 172777J </h2>`,
      'success'
    );
  }

  getMatricule(): any {
    this.agentService.getMatricule().subscribe((result: any) => {
      this.matricule = result.body.matricule;
    });
  }
  genererMatricule(): any {
    const today = dayjs().startOf('day');
    this.matriculeA = new ParamMatricules();
    this.matriculeA.numeroMatricule = 'AAAAA';
    this.matriculeA.datePriseEnCompte = today;
    this.subscribeToSaveResponse1(this.paramMatriculesService.create(this.matriculeA));
    this.getMatricule();
  }

  previousState(): void {
    window.history.back();
  }
  public afficheMessage(msg: string, typeMessage?: string): void {
    this.typeMessage = typeMessage;
    this._success.next(msg);
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
        () => {
          this.isLoading = false;
          this.onError();
        }
      );
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
  trackId(index: number, item: IDocumentAdministratif): number {
    return item.id!;
  }

  openFile(base64String: string | null | undefined, contentType: string | null | undefined): void {
    if (base64String !== undefined && base64String !== null) {
      return this.dataUtils.openFile(base64String, contentType);
    }
  }

  onRemunerationChange(param: string): void {
    console.error('onRemunerationChange :', param);

    this.editForm.patchValue({
      hierarchieId: null,
      echelonId: null,
      gradeId: null,
      indiceId: null,
      soldeIndiciaire: null,
      soldeGlobal: null,
      classeId: null,
      categorieId: null,
    });

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
  }
  add(date1: dayjs.Dayjs): any {
    return dayjs(date1).add(65, 'year');
  }
  onHierarchieChange(param: string): void {
    console.error('onHierarchieChange', param);
  }

  onModeReglementChange(param: any): void {
    this.isModeBanque = false;
    this.modeReglementChoisi = param;
    if (param.code === 'BANQUE') {
      this.isModeBanque = true;
      this.isBilleteur = false;
    }

    this.editForm.patchValue({
      agenceId: null,
      billeteurId: null,
      numeroCompte: null,
    });

    if (param.code === 'BILLETAGE') {
      this.isBilleteur = true;
    }
  }

  onChoixSexe(param: string): void {
    this.isMasculin = false;
    if (param === 'MASCULIN') {
      this.isMasculin = true;
    }

    if (param === 'FEMININ') {
      this.isMasculin = false;
    }
  }

  onSituationMatrimoniale(param: string): void {
    this.isCelibataire = true;
    if (param === 'CELIBATAIRE') {
      this.isCelibataire = true;
    }

    if (param === 'Marié(e)') {
      this.isCelibataire = false;
    }

    if (param === 'Divorcé(e)') {
      this.isDivorce = true;
    }
    if (param === 'Veuf(ve)') {
      this.isVeuf = true;
    }
  }

  onchangeEtablisement(param: any): void {
    // console.error(param);
    if (param.conventionId !== null) {
      this.conventionService.find(param.conventionId).subscribe((result: any) => {
        this.convention = result.body;
        // console.error(this.convention);

        if (this.convention.code === 'CONVENTION_ENTREPRISE') {
          this.isConventionEntreprise = true;
        } else {
          this.isConventionEntreprise = false;
        }
      });
    }
  }

  getSelectedTypePiece(typePiece: any): void {
    this.typePieceChoisi = typePiece;
    if (this.typePieceChoisi.libelle === 'PASSEPORT') {
      this.isPasseport = true;
      this.isCNI = false;
      this.editForm.patchValue({
        numeroPiece: [],
      });
    } else {
      this.isPasseport = false;
      this.isCNI = true;
    }
  }

  getSelectedNatureActe(natureActe: any): void {
    this.natureActeChoisi = natureActe;
    if (natureActe.code === 'PEC_CONTRA') {
      this.isContrat = true;
    } else {
      this.isContrat = false;
    }
  }

  getTypeActesByEvenement(evenement: any): void {
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

  getSelectedRemuneration(typeRemuneration: any): void {
    this.typeRemunerationChoisi = typeRemuneration;
    console.error(this.typeRemunerationChoisi);
  }

  getSelectedGenre(genre: any): void {
    this.genreChoisi = genre;
  }

  getSelectedStatutMarital(statutMariral: any): void {
    this.statutMaritalChoisi = statutMariral;
  }
  selectEventEtablissement(item: any): any {
    this.etablissementChoisiId = item.id;
    if (item.code === undefined) {
      this.editForm.patchValue({
        etablissementId: null,
      });
    }

    this.editForm.patchValue({
      gradeId: null,
      indiceId: null,
      hierarchieId: null,
      echelonId: null,
      soldeIndiciaire: null,
      servicesId: null,
    });

    this.libelleService = '';
  }

  onFocusOutEventEtablissement(item: any): any {
    if (item.libelle === null) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Ce code n existe pas!',
      });
    }
    if (item.code === undefined) {
      this.editForm.patchValue({
        etablissementId: null,
      });
    }

    this.editForm.patchValue({
      gradeId: null,
      indiceId: null,
      hierarchieId: null,
      echelonId: null,
      soldeIndiciaire: null,
      servicesId: null,
    });

    this.libelleService = '';
  }

  selectEventBanque(item: any): any {
    this.libelleBanque = item.libelle;
    this.codeAgence = item.code;
    this.codeBanque = item.etablissementBancaire.code;
    this.editForm.patchValue({
      codeAgence: item.code,
    }); // do something with selected item
  }

  selectEventHierarchie(item: any): any {
    // do something with selected item
  }

  selectEventGrade(item: any): any {
    this.gradeId = item.id;
    this.getHierarchieEchelonByGrade(item.id);
    this.codeGrade = item.code;
    console.error(this.gradeId);
  }

  onFocusOutEventGrade(item: any): any {
    if (item.target.value !== null && item.target.value !== undefined && item.target.value !== '') {
      this.gradeService.findByCode(item.target.value).subscribe(
        (res: any) => {
          this.gradeId = res.body.id;
          this.grade = res.body.code;
          console.error(this.gradeId);
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

  getServicesByEtablissement(event: any): void {
    console.error(event);
    this.serviceService.findServicesByEtablissement(event.id).subscribe((resultat: any) => {
      this.services = resultat.body;
    });
  }

  selectEventEchelon(item: any): any {
    this.echelonId = item.id;
    this.getGrilleSoldeGlobalByEchelon(item.id);
  }

  onFocusOutEventEchelon(item: any): any {
    if (item.target.value !== null && item.target.value !== undefined && item.target.value !== '') {
      this.echelonService.findByCode(item.target.value).subscribe(
        (res: any) => {
          this.echelonId = res.body.id;
          this.getGrilleSoldeGlobalByEchelon(res.body.id);
        },
        err => {
          this.echelonId = null;
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: err.error.message,
          });
        }
      );
    }
  }

  selectEventCategorie(item: any): any {
    this.categorieId = item.id;
    this.getGrilleConventionbyCategorie(item.id);
    this.getGrilleConventionEntreprisebyCategorie(item.id);
  }

  selectEventEmploi(item: any): any {
    // do something with selected item
    this.codeEmplois = item.code;
    this.emploisId = item.id;
    this.libelleEmploi = item.libelle;
  }

  onFocusOutEventEmplois(item: any): any {
    if (item.target.value !== null && item.target.value !== undefined && item.target.value !== '') {
      this.emploisService.findByCode(item.target.value).subscribe(
        (res: any) => {
          this.codeEmplois = res.body.code;
          this.emploisId = res.body.id;
          this.libelleEmploi = res.body.libelle;
        },
        err => {
          this.emploisId = null;
          Swal.fire({
            icon: 'error',
            title: 'Erreur...',
            text: err.error.message,
          });
        }
      );
    }
  }

  selectEventService(item: any): any {
    this.codeService = item.code;
    this.servicesId = item.id;
    this.libelleService = item.libelle;
  }

  // onFocusOutEventService(item: any): any {
  //   console.error(this.etablissementChoisiId);
  //   if (item.target.value !== null && item.target.value !== undefined && item.target.value !== '') {
  //     if (this.etablissementChoisiId !== null && this.etablissementChoisiId !== undefined) {
  //       this.serviceService.findByCode(this.etablissementChoisiId, item.target.value).subscribe(
  //         (res: any) => {
  //           this.codeService = res.body.code;
  //           this.servicesId = res.body.id;
  //           this.libelleService = res.body.libelle;

  //         },
  //         err => {
  //           this.servicesId = null;
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Erreur...',
  //             text: err.error.message,
  //           });
  //         }
  //       );
  //     }
  //   }
  // }

  isChecked(event: any): void {
    if (event.target.checked === true) {
      // console.error('TESTETSTEST');
    }

    if (event.target.checked === false) {
      // console.error('testtttthdh');
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

  isLogementFonctionChecked(event: any): void {
    if (event.target.checked === true) {
      this.isLogementFonction = true;
    }

    if (event.target.checked === false) {
      this.isLogementFonction = false;
    }
  }

  isCDIChecked(event: any): void {
    if (event.target.checked === true) {
      this.isCDI = true;
    }

    if (event.target.checked === false) {
      this.isCDI = false;
    }
  }

  onFocused(e: any): any {
    // do something
  }

  onFocusedOut(e: any): any {
    // do something
    console.error('ttttt');
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

  onChangeSearchEtablissement(search: any, test: number): any {
    if (test === 1) {
      this.editForm.patchValue({
        gradeId: null,
        indiceId: null,
        hierarchieId: null,
        echelonId: null,
        soldeIndiciaire: null,
        etablissementId: null,
      });
    }
    this.editForm.patchValue({
      gradeId: null,
      indiceId: null,
      hierarchieId: null,
      echelonId: null,
      soldeIndiciaire: null,
    });
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onChangeSearchEmplois(search: string): any {
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
    // And reassign the 'data' which is binded to 'data' property.
  }

  onChangeSearchBilleteur(search: string): any {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  addMembre(): void {
    this.modalRef = this.modalService.open(FormEnfantComponent, { size: 'lg' });

    this.modalRef.componentInstance.clickEvent.subscribe((enfant: IEnfant) => {
      this.enfants?.push(enfant);
      console.error(" tableau d'enfants", this.enfants);
    });
  }
  addDocument(): void {
    this.modalRef = this.modalService.open(PieceAdministrativeComponent, { size: 'lg' });

    this.modalRef.componentInstance.clickEvent.subscribe((document: IDocumentAdministratif) => {
      this.documents?.push(document);
      console.error(' tableau documents ', this.documents);
    });
  }

  getSelectedGrade(gradeId: number | null | undefined): void {
    console.error('TESSST', this.gradeId);

    console.error('MES ENFANTS', this.enfants);
    if (gradeId !== null && gradeId !== undefined) {
      this.gradeId = gradeId;
    }
  }
  deleteMembre(enfant: IEnfant): void {
    if (this.enfants) {
      for (let i = 0; i < this.enfants.length; i++) {
        if (this.enfants[i].prenom === enfant.prenom && this.enfants[i].dateNaissance === enfant.dateNaissance) {
          this.enfants.splice(i, 1);
        }
      }
    }
  }

  getSelectedEtablissement(etablissementId: number | null | undefined): void {
    console.error(this.etablissementId);
    if (etablissementId !== null && etablissementId !== undefined) {
      this.etablissementId = etablissementId;
    }
    console.error(this.etablissementId);
  }

  getHierarchieEchelonByIndice(indice: number | null | undefined): void {
    console.error('Indice :', indice);
    if (indice !== null && indice !== undefined) {
      const priseEncompte = this.createFromForm();
      if (this.gradeId) {
        this.grilleIndiciaireService.findGradeAndIndices(this.gradeId, indice).subscribe((result: any) => {
          priseEncompte.grilleIndiciaire = result.body;
          console.error(priseEncompte.grilleIndiciaire);
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
                this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;

                this.editForm.patchValue({
                  hierarchieId: priseEncompte.hierarchie?.libelle,
                  soldeIndiciaire: priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire,
                });
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
                this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;

                this.editForm.patchValue({
                  echelonId: priseEncompte.echelon?.libelle,
                  soldeIndiciaire: priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire,
                });
              });
            }
          }
        });
      }
    }
  }

  getHierarchieEchelonByGrade(grade: number | null | undefined): void {
    console.error('Grade :', grade);
    if (this.isIndiciaire) {
      if (grade !== null && grade !== undefined) {
        const priseEncompte = this.createFromForm();
        console.error('Indice :', priseEncompte.indiceId);
        if (priseEncompte.indiceId !== undefined && priseEncompte.indiceId !== null) {
          this.grilleIndiciaireService.findGradeAndIndices(grade, priseEncompte.indiceId).subscribe((result: any) => {
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

                  this.editForm.patchValue({
                    hierarchieId: priseEncompte.hierarchie?.libelle,
                    soldeIndiciaire: priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire,
                  });
                });
              }
            }

            if (priseEncompte.grilleIndiciaire) {
              if (priseEncompte.grilleIndiciaire.echelonId) {
                this.echelonService.find(priseEncompte.grilleIndiciaire.echelonId).subscribe((resultechelon: any) => {
                  priseEncompte.echelon = resultechelon.body;
                  this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;

                  this.editForm.patchValue({
                    echelonId: priseEncompte.echelon?.libelle,
                    soldeIndiciaire: priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire,
                  });
                });
              }
            }
          });
        }
      } else {
        this.editForm.patchValue({
          hierarchieId: [],
          echelonId: [],
        });
      }
    }
  }

  getGrilleSoldeGlobalByEchelon(echelon: number | null | undefined): void {
    if (echelon !== null && echelon !== undefined) {
      const priseEncompte = this.createFromForm();
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
            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleSoldeGlobal?.soldeGlobal,
              classeId: priseEncompte.grilleSoldeGlobal?.classeId,
            });
          });
      }
    } else {
      this.editForm.patchValue({
        soldeGlobal: null,
      });
    }
  }

  getGrilleConventionbyGrade(grade: number | null | undefined): void {
    console.error('Grade :', grade);

    if (this.isConvention) {
      if (grade !== null && grade !== undefined) {
        const priseEncompte = this.createFromForm();
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

              this.editForm.patchValue({
                soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
                classeId: priseEncompte.grilleConvention?.classeId,
              });

              if (priseEncompte.grilleIndiciaire) {
                if (priseEncompte.grilleIndiciaire.echelonId) {
                  this.echelonService.find(priseEncompte.grilleIndiciaire.echelonId).subscribe((resultechelon: any) => {
                    priseEncompte.echelon = resultechelon.body;
                    this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;

                    this.editForm.patchValue({
                      echelonId: priseEncompte.echelon?.libelle,
                      soldeIndiciaire: priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire,
                    });
                  });
                }
              }
            });
        }
      } else {
        this.editForm.patchValue({
          soldeGlobal: null,
        });
      }
    }
  }

  getGrilleConventionEntreprisebyGrade(grade: number | null | undefined): void {
    console.error('Grade :', grade);

    if (this.isConvention) {
      if (grade !== null && grade !== undefined) {
        const priseEncompte = this.createFromForm();
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
              this.salairedeBase = this.editForm.value['soldeGlobal'];

              this.editForm.patchValue({
                soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
                classeId: priseEncompte.grilleConvention?.classeId,
              });

              if (priseEncompte.grilleIndiciaire) {
                if (priseEncompte.grilleIndiciaire.echelonId) {
                  this.echelonService.find(priseEncompte.grilleIndiciaire.echelonId).subscribe((resultechelon: any) => {
                    priseEncompte.echelon = resultechelon.body;
                    this.soldeIndiciaire = priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire;

                    this.editForm.patchValue({
                      echelonId: priseEncompte.echelon?.libelle,
                      soldeIndiciaire: priseEncompte.grilleIndiciaire?.indices?.soldeIndiciaire,
                    });
                  });
                }
              }
            });
        }
      } else {
        this.editForm.patchValue({
          soldeGlobal: null,
        });
      }
    }
  }

  getGrilleConventionbyClasse(classe: number | null | undefined): void {
    console.error('Classe :', classe);

    if (classe !== null && classe !== undefined) {
      const priseEncompte = this.createFromForm();

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
            this.salairedeBase = this.editForm.value['soldeGlobal'];
            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
              classeId: priseEncompte.grilleConvention?.classeId,
            });
          });
      }
    } else {
      this.editForm.patchValue({
        soldeGlobal: null,
      });
    }
  }

  // GET SALAIRE DE BASE BY GRADE ETABLISSEMENT CLASSE AND CATEGORIE (CONVENTION COLLECTIVE)
  getGrilleConventionbyCategorie(categorie: number | null | undefined): void {
    console.error('Categorie :', categorie);
    console.error('++++++++++++++++++++++++++');
    if (categorie !== null && categorie !== undefined) {
      const priseEncompte = this.createFromForm();
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
            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
              //   classeId: priseEncompte.grilleConvention?.classeId,
            });
            this.salairedeBase = this.editForm.value['soldeGlobal'];
            if (result.body === null || result.body === undefined) {
              this.editForm.patchValue({
                soldeGlobal: null,
              });
            }
          });
      }
    } else {
      this.editForm.patchValue({
        soldeGlobal: null,
      });
    }
  }

  getSelectedDateRecrutement(param: any): void {
    this.dateRecrutement = param;
    console.error(this.dateRecrutement);
  }

  getSelectedDatePriseDeRang(param: any): void {
    console.error(this.datePriseDeRang);
    this.datePriseDeRang = param;
  }

  getSelectedDatePosition(param: any): void {
    this.datePosition = param;
  }

  getSelectedDateAnnulation(param: any): void {
    this.dateAnnulation = param;
  }

  // GET SALAIRE DE BASE BY GRADE ETABLISSEMENT AND CATEGORIE (CONVENTION D'ENTREPRISE)
  getGrilleConventionEntreprisebyCategorie(categorie: number | null | undefined): void {
    console.error('Categorie :', categorie);
    console.error('************');

    if (categorie !== null && categorie !== undefined) {
      const priseEncompte = this.createFromForm();
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
            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
              //   classeId: priseEncompte.grilleConvention?.classeId,
            });

            this.salairedeBase = this.editForm.value['soldeGlobal'];
            if (result.body === null || result.body === undefined) {
              this.editForm.patchValue({
                soldeGlobal: null,
              });
            }
          });
      }
    } else {
      this.editForm.patchValue({
        soldeGlobal: null,
      });
    }
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

  getGrilleConventionbyEtablissement(etablissement: number | null | undefined): void {
    console.error('Etablissement :', etablissement);

    if (etablissement !== null && etablissement !== undefined) {
      const priseEncompte = this.createFromForm();

      if (
        priseEncompte.categorieId !== undefined &&
        priseEncompte.categorieId !== null &&
        priseEncompte.gradeId !== undefined &&
        priseEncompte.gradeId !== null &&
        priseEncompte.classeId !== undefined &&
        priseEncompte.classeId !== null
      ) {
        this.grilleConventionService
          .findGrilleConvention(priseEncompte.gradeId, priseEncompte.classeId, priseEncompte.categorieId, etablissement)
          .subscribe((result: any) => {
            priseEncompte.grilleConvention = result.body;
            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
              classeId: priseEncompte.grilleConvention?.classeId,
            });
            if (result.body === null || result.body === undefined) {
              this.editForm.patchValue({
                soldeGlobal: null,
              });
            }
          });
      }
    } else {
      this.editForm.patchValue({
        soldeGlobal: null,
      });
    }
  }

  getGrilleConventionEntrprisebyEtablissement(etablissement: number | null | undefined): void {
    console.error('Etablissement :', etablissement);

    if (etablissement !== null && etablissement !== undefined) {
      const priseEncompte = this.createFromForm();
      if (
        priseEncompte.categorieId !== undefined &&
        priseEncompte.categorieId !== null &&
        priseEncompte.gradeId !== undefined &&
        priseEncompte.gradeId !== null
      ) {
        this.grilleConventionService
          .findGrilleConventionEntreprise(priseEncompte.gradeId, priseEncompte.categorieId, etablissement)
          .subscribe((result: any) => {
            priseEncompte.grilleConvention = result.body;
            if (priseEncompte.grilleConvention === null) {
              Swal.fire({
                icon: 'error',
                title: 'Erreur...',
                text: ' Veuillez vérifier la correspondance dans grille Convention !',
              });
            }
            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
              classeId: priseEncompte.grilleConvention?.classeId,
            });
            if (result.body === null || result.body === undefined) {
              this.editForm.patchValue({
                soldeGlobal: null,
              });
            }
          });
      }
    } else {
      this.editForm.patchValue({
        soldeGlobal: null,
      });
    }
  }

  dateSaisie(date: any): void {
    if (date != null) {
      const a = dayjs(date);
      const annee1 = dayjs().year();
      const annee2 = a.toDate().getFullYear();
      this.age = annee1 - annee2;
      if (a.toDate().getMonth() > dayjs().month()) {
        this.age--;
      } else if (a.toDate().getMonth() === dayjs().month() && a.toDate().getDate() > dayjs().date()) {
        this.age--;
      }

      console.error('AGE : ', this.age);

      if (this.age < this.ageMinPEC) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'La personne doit avoir au moins 18 ans !',
        }).then(result => {
          if (result.isConfirmed) {
            this.editForm.patchValue({
              dateNaissance: null,
            });
          }
        });
      }
    }
  }

  verifNumeroCompte(numero: any): void {
    if (numero) {
      if (numero.trim().length < 15) {
        Swal.fire({
          toast: true,
          showConfirmButton: false,
          allowOutsideClick: true,
          html: ' <strong> Veuillez entrer un numéro sur 15 position </strong> ',
          timer: 3000,
          timerProgressBar: true,
          position: 'center-right',
          // didOpen: (toast) => {
          //   toast.addEventListener('mouseenter', Swal.stopTimer);
          //   toast.addEventListener('mouseleave', Swal.resumeTimer);
          // },
        });
      }
    }
  }
  numeroPieceUnique(numeroPiece: any): void {
    this.isUnique = false;
    if (this.typePieceChoisi) {
      this.priseEncompteService.numeroPieceUnique(this.typePieceChoisi.code!, numeroPiece.target.value).subscribe(
        (res: any) => {
          this.isUnique = res.body;
          console.error(this.isUnique);
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

  allerASituationAdmin(tab: NgbNav): void {
    const priseEncompte = this.createFromForm();
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
      priseEncompte.adresse === undefined ||
      this.isUnique !== true
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
    const priseEncompte = this.createFromForm();
    console.error(priseEncompte);
    priseEncompte.gradeId = this.gradeId;
    priseEncompte.indiceId = this.indiceId;
    // priseEncompte.servicesId = this.servicesId;
    // priseEncompte.emploisId = this.emploisId;
    if (
      priseEncompte.natureActe === null ||
      priseEncompte.natureActe === undefined ||
      priseEncompte.etablissementId === null ||
      priseEncompte.etablissementId === undefined ||
      priseEncompte.dateRecrutement === null ||
      priseEncompte.dateRecrutement === undefined ||
      // priseEncompte.servicesId === null ||
      // priseEncompte.servicesId === undefined ||
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

  onNavChange(changeEvent: NgbNavChangeEvent): void {
    if (changeEvent.nextId === 2) {
      const priseEncompte = this.createFromForm();
      priseEncompte.gradeId = this.gradeId;
      priseEncompte.indiceId = this.indiceId;
      // priseEncompte.servicesId = this.servicesId;
      // priseEncompte.emploisId = this.emploisId;

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
        priseEncompte.adresse === undefined ||
        this.isUnique !== true
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
      const priseEncompte = this.createFromForm();
      priseEncompte.gradeId = this.gradeId;
      priseEncompte.indiceId = this.indiceId;
      // priseEncompte.servicesId = this.servicesId;
      // priseEncompte.emploisId = this.emploisId;
      if (
        priseEncompte.natureActe === null ||
        priseEncompte.natureActe === undefined ||
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
        changeEvent.preventDefault();
      }
    }
  }

  delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
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
        numero: [],
        date: [],
        natureActes: [],
        typeActes: [],
      });
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
  getTauxByPoste(): void {
    this.posteCompoGradeService.findValeurByPostes('142', '110').subscribe((result: any) => {
      this.taux = result.body;
    });
  }
  calculEmolument(pec: IPriseEnCompte | null): void {
    // Saisie automatique de la table emolument
    const emoluments = new Emoluments();
    emoluments.codePoste = '142';
    emoluments.etablissementId = this.etablissementId;
    emoluments.matricule = pec?.matricule;
    emoluments.reference = 'complement special de solde';
    emoluments.dateEffet = pec?.dateRecrutement;
    emoluments.dateEcheance = pec?.dateRecrutement;
    this.posteCompoGradeService.findValeurByPostes('142', '110').subscribe((result: any) => {
      emoluments.taux = result.body.valeur;
      this.augmentationIndiceService.findMaxTotal().subscribe((result1: any) => {
        emoluments.montant = this.soldeIndiciaire * (1 + result1.body[0].total / 100) * (emoluments.taux! / 100);
        this.subscribeToSaveResponse2(this.emolumentsSerice.create(emoluments));
      });
    });

    // Saisie automatique de la table emolument
    const soldeMIA = new Emoluments();
    soldeMIA.codePoste = '142';
    soldeMIA.etablissementId = this.etablissementId;
    soldeMIA.matricule = pec?.matricule;
    soldeMIA.reference = 'solde mensuel indiciaire assimile';
    soldeMIA.dateEffet = pec?.dateRecrutement;
    soldeMIA.dateEcheance = pec?.dateRecrutement;
    this.augmentationIndiceService.findMaxTotal().subscribe((result1: any) => {
      soldeMIA.montant = this.soldeIndiciaire * (1 + result1.body[0].total / 100);
      this.subscribeToSaveResponse2(this.emolumentsSerice.create(soldeMIA));
    });

    // Saisie automatique de la table emolument

    const residence = new Emoluments();
    residence.codePoste = '142';
    residence.etablissementId = this.etablissementId;
    residence.matricule = pec?.matricule;
    residence.reference = 'Indemnité de résidence';
    residence.dateEffet = pec?.dateRecrutement;
    residence.dateEcheance = pec?.dateRecrutement;
    this.posteCompoGradeService.findValeurByPostes('151', '110').subscribe((result: any) => {
      residence.taux = result.body.valeur;
      this.augmentationIndiceService.findMaxTotal().subscribe((result1: any) => {
        residence.montant = this.soldeIndiciaire * (1 + result1.body[0].total / 100) * (residence.taux! / 100);
        this.subscribeToSaveResponse2(this.emolumentsSerice.create(residence));
      });
    });
    if (this.codeEmplois === '9814') {
      const enseignant = new Emoluments();
      enseignant.codePoste = '145';
      enseignant.etablissementId = this.etablissementId;
      enseignant.matricule = pec?.matricule;
      enseignant.reference = 'INDEMNITE ENSEIGNEMENT';
      enseignant.dateEffet = pec?.dateRecrutement;
      enseignant.dateEcheance = pec?.dateRecrutement;
      this.posteCompoGradeService.findValeurByPostes('145', '110').subscribe((result: any) => {
        enseignant.taux = result.body.valeur;
        this.augmentationIndiceService.findMaxTotal().subscribe((result1: any) => {
          enseignant.montant = this.soldeIndiciaire * (1 + result1.body[0].total / 100) * (enseignant.taux! / 100);
          this.subscribeToSaveResponse2(this.emolumentsSerice.create(enseignant));
        });
      });
    }
  }

  refresh(): void {
    window.location.reload();
  }

  beforeChange($event: NgbNavChangeEvent, tab: NgbNav, indice: number): void {
    if ($event.nextId === 2) {
      if (!this.validationPage1(tab, indice)) {
        $event.preventDefault();
      }
    }
    return;
  }

  getTaux(): number {
    this.augmentationIndiceService.findMaxTotal().subscribe((result: any) => {
      if (result.body[0]) {
        this.totalTaux = result.body[0].total;
      }
    });
    console.error('sssss', this.totalTaux);
    return 1;
  }

  validationPage1(tab: NgbNav, indice: number): boolean {
    const priseEncompte = this.createFromForm();
    if (priseEncompte.adresse === null || priseEncompte.adresse === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: " Veuillez renseigner l'adresse  !",
      });
      return false;
    } else {
      return true;
    }
  }

  save(): void {
    this.isPieceCorrect = true;
    this.canSave = true;

    const priseEncompte = this.createFromForm();

    priseEncompte.gradeId = this.gradeId;
    priseEncompte.indiceId = this.indiceId;
    // priseEncompte.servicesId = this.servicesId;
    priseEncompte.emploisId = this.emploisId;

    if (priseEncompte.indiceId) {
      this.indicesService.find(priseEncompte.indiceId).subscribe((result: any) => {
        priseEncompte.indice = result.body;
      });
    }
    if (priseEncompte.gradeId && priseEncompte.indiceId) {
      this.grilleIndiciaireService.findGradeAndIndices(priseEncompte.gradeId, priseEncompte.indiceId).subscribe((result: any) => {
        priseEncompte.grilleIndiciaire = result.body;
        priseEncompte.hierarchieId = priseEncompte.grilleIndiciaire?.hierarchieId;
        priseEncompte.echelonId = priseEncompte.grilleIndiciaire?.echelonId;
      });
    }
    if (priseEncompte.modeReglement === 'BANQUE') {
      priseEncompte.reglementId = priseEncompte.agenceId;
    }

    if (priseEncompte.modeReglement === 'BILLETAGE') {
      priseEncompte.reglementId = priseEncompte.billeteurId;
    }
    priseEncompte.loge = this.isLoge;
    priseEncompte.cdi = this.isCDI;
    priseEncompte.logementFonction = this.isLogementFonction;
    priseEncompte.userInsertId = this.userInsert;
    priseEncompte.enfant = this.enfants;
    priseEncompte.grade = this.grade;

    this.nombreEnfant = 0;
    this.nombreEpouse = 0;
    if (priseEncompte.enfant) {
      for (let i = 0; i < priseEncompte.enfant.length; i++) {
        if (priseEncompte.enfant[i].lienParente === 'ENFANT') {
          this.nombreEnfant++;
        } else {
          if (priseEncompte.enfant[i].lienParente === 'CONJOINT(E)') {
            this.nombreEpouse++;
          }
        }
      }
    }
    priseEncompte.nombreEnfant = this.nombreEnfant;
    priseEncompte.nombreEpouse = this.nombreEpouse;
    priseEncompte.situationMatrimoniale = 'Célibataire';
    priseEncompte.nombrePart = 1;
    priseEncompte.typePiece = this.typePieceChoisi.code;
    priseEncompte.sexe = this.genreChoisi.libelle;
    priseEncompte.natureActe = this.natureActeChoisi.code;
    priseEncompte.modeReglement = this.modeReglementChoisi.code;
    priseEncompte.typeRemuneration = this.typeRemunerationChoisi.libelle;
    priseEncompte.codeEmplois = this.codeEmplois;
    if (priseEncompte.typeRemuneration === 'SOLDE INDICIAIRE') {
      priseEncompte.codeRemuneration = 1;
      priseEncompte.codeGrille = 'A INDICE';
    } else {
      if (priseEncompte.typeRemuneration === 'SOLDE GLOBALE' || priseEncompte.typeRemuneration === 'CONVENTION') {
        priseEncompte.codeRemuneration = 4;
        priseEncompte.codeGrille = 'A SOLDE GLOBALE';
      } else {
        priseEncompte.codeRemuneration = 6;
        priseEncompte.codeGrille = 'CAS PARTICULIERS';
      }
    }

    if (this.salairedeBase !== null && this.salairedeBase !== undefined) {
      priseEncompte.soldeGlobal = this.salairedeBase;
    }

    if (priseEncompte.typeRemuneration === 'CAS PARTICULIERS') {
      priseEncompte.soldeGlobal = priseEncompte.soldeGlobalCP;
    }

    priseEncompte.emploisId = this.emploisId;
    // priseEncompte.servicesId = this.servicesId;
    priseEncompte.etat = 'SAISIE';
    priseEncompte.document = this.documentsAdministratif;
    priseEncompte.numeroRecrutement = priseEncompte.numeroPiece;

    priseEncompte.numeroRecrutement = priseEncompte.numeroPiece;

    if (
      priseEncompte.etablissementId === null ||
      priseEncompte.etablissementId === undefined ||
      priseEncompte.gradeId === null ||
      priseEncompte.gradeId === undefined ||
      priseEncompte.emploisId === null ||
      priseEncompte.emploisId === undefined
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Veuillez renseigner les champs grade ou emploi ou etablissement  !',
      });
    }

    if (this.codeBanque && priseEncompte.numeroCompte) {
      priseEncompte.numeroCompte = this.codeAgence.concat(this.codeBanque).concat(priseEncompte.numeroCompte);
    }

    if (priseEncompte.categorieAgent?.libelle?.toLocaleLowerCase() === 'fonctionnaire') {
      priseEncompte.prestafa = 1;
    }
    if (priseEncompte.categorieAgent?.libelle?.toLocaleLowerCase() === 'non fonctionnaire') {
      priseEncompte.prestafa = 4;
    }

    if (priseEncompte.document?.length === 0 || priseEncompte.document === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur...',
        text: 'Veuillez ajouter un document !',
      });
      this.canSave = false;
    } else {
      // console.error('this.cansave ', this.canSave);
      // console.error('this.isPieceCorrect ', this.isPieceCorrect);
      // if (this.canSave === true && this.isPieceCorrect === true) {
      this.subscribeToSaveResponse(this.priseEncompteService.create(priseEncompte));
      //  this.isSaving = true;
    }

    console.error(priseEncompte);
  }

  protected loadRelationshipsOptions(): void {
    this.etablissementService
      .findAll()
      .pipe(map((res: HttpResponse<IEtablissement[]>) => res.body ?? []))
      .pipe(
        map((etablissement: IEtablissement[]) =>
          this.etablissementService.addEtablissementToCollectionIfMissing(etablissement, this.editForm.get('etablissement')!.value)
        )
      )
      .subscribe((etablissement: IEtablissement[]) => (this.etablissementSharedCollection = etablissement));

    this.billeteurService
      .findAll()
      .pipe(map((res: HttpResponse<IBilleteur[]>) => res.body ?? []))
      .pipe(
        map((billeteur: IBilleteur[]) =>
          this.billeteurService.addBilleteurToCollectionIfMissing(billeteur, this.editForm.get('billeteur')!.value)
        )
      )
      .subscribe((billeteur: IBilleteur[]) => (this.billeteurSharedCollection = billeteur));

    this.agenceService
      .findAll()
      .pipe(map((res: HttpResponse<IAgence[]>) => res.body ?? []))
      .pipe(map((agence: IAgence[]) => this.agenceService.addAgenceToCollectionIfMissing(agence, this.editForm.get('agence')!.value)))
      .subscribe((agence: IAgence[]) => (this.agenceSharedCollection = agence));

    this.serviceService
      .query()
      .pipe(map((res: HttpResponse<IService[]>) => res.body ?? []))
      .pipe(map((service: IService[]) => this.serviceService.addServiceToCollectionIfMissing(service, this.editForm.get('service')!.value)))
      .subscribe((service: IService[]) => (this.serviceSharedCollection = service));

    this.emploisService
      .findAll()
      .pipe(map((res: HttpResponse<IEmplois[]>) => res.body ?? []))
      .pipe(map((emplois: IEmplois[]) => this.emploisService.addEmploisToCollectionIfMissing(emplois, this.editForm.get('emplois')!.value)))
      .subscribe((emplois: IEmplois[]) => (this.emploisSharedCollection = emplois));

    this.positionsService
      .findAll()
      .pipe(map((res: HttpResponse<IPositions[]>) => res.body ?? []))
      .pipe(
        map((position: IPositions[]) =>
          this.positionsService.addPositionsToCollectionIfMissing(position, this.editForm.get('position')!.value)
        )
      )
      .subscribe((position: IPositions[]) => (this.positionSharedCollection = position));

    this.categorieAgentService
      .query()
      .pipe(map((res: HttpResponse<ICategorieAgent[]>) => res.body ?? []))
      .pipe(
        map((categorieAgent: ICategorieAgent[]) =>
          this.categorieAgentService.addCategorieAgentToCollectionIfMissing(categorieAgent, this.editForm.get('categorieAgent')!.value)
        )
      )
      .subscribe((categorieAgent: ICategorieAgent[]) => (this.categorieAgentSharedCollection = categorieAgent));

    this.categorieService
      .findAll()
      .pipe(map((res: HttpResponse<ICategorie[]>) => res.body ?? []))
      .pipe(
        map((categorie: ICategorie[]) =>
          this.categorieService.addCategorieToCollectionIfMissing(categorie, this.editForm.get('categorie')!.value)
        )
      )
      .subscribe((categorie: ICategorie[]) => (this.categorieSharedCollection = categorie));

    this.nationaliteService
      .query()
      .pipe(map((res: HttpResponse<INationalite[]>) => res.body ?? []))
      .pipe(
        map((nationalite: INationalite[]) =>
          this.nationaliteService.addNationaliteToCollectionIfMissing(nationalite, this.editForm.get('nationalite')!.value)
        )
      )
      .subscribe((nationalite: INationalite[]) => (this.nationaliteSharedCollection = nationalite));

    this.echelonService
      .findAll()
      .pipe(map((res: HttpResponse<IEchelon[]>) => res.body ?? []))
      .pipe(map((echelon: IEchelon[]) => this.echelonService.addEchelonToCollectionIfMissing(echelon, this.editForm.get('echelon')!.value)))
      .subscribe((echelon: IEchelon[]) => (this.echelonSharedCollection = echelon));

    this.classeService
      .findAll()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(map((classe: IClasse[]) => this.classeService.addClasseToCollectionIfMissing(classe, this.editForm.get('classe')!.value)))
      .subscribe((classe: IClasse[]) => (this.classeSharedCollection = classe));

    this.gradeService
      .findAll()
      .pipe(map((res: HttpResponse<IGrade[]>) => res.body ?? []))
      .pipe(map((grade: IGrade[]) => this.gradeService.addGradeToCollectionIfMissing(grade, this.editForm.get('grade')!.value)))
      .subscribe((grade: IGrade[]) => (this.gradeSharedCollection = grade));

    this.indicesService
      .findAll()
      .pipe(map((res: HttpResponse<IIndices[]>) => res.body ?? []))
      .pipe(map((indices: IIndices[]) => this.indicesService.addIndicesToCollectionIfMissing(indices, this.editForm.get('indice')!.value)))
      .subscribe((indices: IIndices[]) => (this.indicesSharedCollection = indices));

    this.hierarchieService
      .findAll()
      .pipe(map((res: HttpResponse<IHierarchie[]>) => res.body ?? []))
      .pipe(
        map((hierarchie: IHierarchie[]) =>
          this.hierarchieService.addHierarchieToCollectionIfMissing(hierarchie, this.editForm.get('hierarchie')!.value)
        )
      )
      .subscribe((hierarchie: IHierarchie[]) => (this.hierarchieSharedCollection = hierarchie));

    // On charge les données venant de la table table_valeur : type de rémunération
    this.tableValeurService
      .findRemuneration()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((typeRemuneration: ITableValeur[]) => (this.typeRemuneration = typeRemuneration));

    // On charge les données venant de la table table_valeur : type de pièce, CNI ou passeport
    this.tableValeurService
      .findTypePiece()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((typePiece: ITableValeur[]) => (this.typePiece = typePiece));

    // On charge les données venant de la table table_valeur : statut Marital

    this.tableValeurService
      .findStatutMarital()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((statutMarital: ITableValeur[]) => (this.statutMarital = statutMarital));

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

    // On charge les données venant de la table table_valeur : MODE_REGLEMENT
    this.tableValeurService
      .findModeReglement()
      .pipe(
        filter((mayBeOk: HttpResponse<ITableValeur[]>) => mayBeOk.ok),
        map((res: HttpResponse<ITableValeur[]>) => res.body ?? [])
      )
      .subscribe((modeReglement: ITableValeur[]) => (this.modeReglement = modeReglement));

    // On charge l'ensemble des événements
    this.evenementService
      .query()
      .pipe(map((res: HttpResponse<IEvenement[]>) => res.body ?? []))
      .pipe(
        map((evenement: IEvenement[]) =>
          this.evenementService.addEvenementToCollectionIfMissing(evenement, this.editForm.get('evenement')!.value)
        )
      )
      .subscribe((evenement: IEvenement[]) => (this.evenementSharedCollection = evenement));

    // this.augmentationIndiceService.findMaxTotal().subscribe((result: any) => {
    //   if (result.body[0]) {
    //     this.totalTaux = result.body[0];
    //   }
    //   console.error('dans', this.totalTaux);
    // });
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPriseEnCompte>>): void {
    result.subscribe(
      (res: HttpResponse<IPriseEnCompte>) => this.onSaveSuccess(res.body),
      () => this.onSaveError()
    );
  }
  protected subscribeToSaveResponse1(result: Observable<HttpResponse<IParamMatricules>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess1(),
      error: () => this.onSaveError(),
    });
  }
  protected subscribeToSaveResponse2(result: Observable<HttpResponse<IEmoluments>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess1(),
      error: () => this.onSaveError(),
    });
  }
  protected onSaveSuccess(priseEncompte: IPriseEnCompte | null): void {
    if (priseEncompte !== null) {
      this.priseEnCompte = priseEncompte;
      // this.calculEmolument(priseEncompte);
      console.error('code Emplois ', priseEncompte?.codeEmplois);

      this.isSaving = false;
      (async () => {
        // Do something before delay
        console.error('before delay');
        this.afficheMessage('Opération effectuée avec succés.', 'success');

        await this.delay(15000);

        // this.refresh();

        // Do something after
        console.error('after delay');
      })();

      if (this.priseEnCompte.id !== undefined) {
        Swal.fire(
          `<h3 style="font-family: arial">Prise en compte de ${priseEncompte?.prenom ?? ''} ${
            priseEncompte?.nom ?? ''
          } <br> effectuée avec succès</h3>`,
          `Le matricule generé est: <br><br> <h2 style="text-shadow: 1px 1px 1px black, 2px 2px 1px black"> ${
            priseEncompte?.matricule ?? ''
          } </h2>`,
          'success'
        ).then(result => {
          if (result.isConfirmed) {
            this.refresh();
          }
        });
      }
    }
  }
  protected onSaveSuccess1(): void {
    this.router.navigate(['/prise-en-compte/new']);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(priseEncompte: IPriseEnCompte): void {
    this.editForm.patchValue({
      id: priseEncompte.id,
      code: priseEncompte.code,
      libelle: priseEncompte.libelle,
      userInsertId: priseEncompte.userInsertId,
      userUpdateId: priseEncompte.userUpdateId,
      dateInsert: priseEncompte.dateInsert ? priseEncompte.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: priseEncompte.dateUpdate ? priseEncompte.dateUpdate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IPriseEnCompte {
    return {
      ...new PriseEnCompte(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      libelle: this.editForm.get(['libelle'])!.value,

      // Informations Agent

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
      nationalite: this.editForm.get(['nationalite'])!.value,
      userInsertId: this.editForm.get(['userInsertId'])!.value,
      userUpdateId: this.editForm.get(['userUpdateId'])!.value,
      dateInsert: this.editForm.get(['dateInsert'])!.value ? dayjs(this.editForm.get(['dateInsert'])!.value, DATE_TIME_FORMAT) : undefined,
      dateUpdate: this.editForm.get(['dateUpdate'])!.value ? dayjs(this.editForm.get(['dateUpdate'])!.value, DATE_TIME_FORMAT) : undefined,

      // Informations Situation Familiale :
      situationMatrimoniale: this.editForm.get(['situationMatrimoniale'])!.value,
      nombreEpouse: this.editForm.get(['nombreEpouse'])!.value,
      conjointSalarie: this.editForm.get(['conjointSalarie'])!.value,
      nombreEnfant: this.editForm.get(['nombreEnfant'])!.value,
      nombrePart: this.editForm.get(['nombrePart'])!.value,
      nombreEnfantImposable: this.editForm.get(['nombreEnfantImposable'])!.value,
      nombreEnfantMajeur: this.editForm.get(['nombreEnfantMajeur'])!.value,
      nombreMinimumFiscal: this.editForm.get(['nombreMinimumFiscal'])!.value,
      nombreEnfantDecede: this.editForm.get(['nombreEnfantDecede'])!.value,

      // Informations Situation Administrative :

      dateRecrutement: this.editForm.get(['dateRecrutement'])!.value,
      // numeroRecrutement: this.editForm.get(['numeroRecrutement'])!.value,
      datePriseRang: this.editForm.get(['datePriseRang'])!.value,
      numeroOrdreService: this.editForm.get(['numeroOrdreService'])!.value,
      dateOrdreService: this.editForm.get(['dateOrdreService'])!.value,
      loge: this.editForm.get(['loge'])!.value,
      logementFonction: this.editForm.get(['logementFonction'])!.value,
      datedebut: this.editForm.get(['datedebut'])!.value,
      datefin: this.add(this.editForm.get(['dateNaissance'])!.value),
      numeroCompte: this.editForm.get(['numeroCompte'])!.value,
      corpsId: this.editForm.get(['corpsId'])!.value?.id,
      hierarchieId: this.editForm.get(['hierarchieId'])!.value?.id,
      cadreId: this.editForm.get(['cadreId'])!.value?.id,
      categorieId: this.editForm.get(['categorieId'])!.value?.id,
      categorieAgent: this.editForm.get(['categorieAgent'])!.value,
      gradeId: this.editForm.get(['gradeId'])!.value?.id,
      indiceId: this.editForm.get(['indiceId'])!.value?.id,
      echelonId: this.editForm.get(['echelonId'])!.value?.id,
      classeId: this.editForm.get(['classeId'])!.value?.id,
      modeReglement: this.editForm.get(['modeReglement'])!.value,
      position: this.editForm.get(['position'])!.value?.id,
      agence: this.editForm.get(['agence'])!.value?.id,
      agenceId: this.editForm.get(['agenceId'])!.value?.id,
      etablissementId: this.editForm.get(['etablissementId'])!.value?.id,
      reglementId: this.editForm.get(['reglementId'])!.value?.id,
      billeteurId: this.editForm.get(['billeteurId'])!.value?.id,
      emploisId: this.editForm.get(['emploisId'])!.value?.id,
      servicesId: this.editForm.get(['servicesId'])!.value?.id,
      codeEmplois: this.editForm.get(['codeEmplois'])!.value?.code,
      natureActe: this.editForm.get(['natureActe'])!.value,
      cdi: this.editForm.get(['cdi'])!.value,
      cleRib: this.editForm.get(['cleRib'])!.value,
      codeAgence: this.editForm.get(['codeAgence'])!.value,
      soldeGlobalCP: this.editForm.get(['soldeGlobalCP'])!.value,
    };
  }

  protected createFromFormDocument(): IDocumentAdministratif {
    return {
      ...new DocumentAdministratif(),
      typeActes: this.editForm.get(['typeActes'])!.value,
      fichier: this.editForm.get(['fichier'])!.value,
      fichierContentType: this.editForm.get(['fichierContentType'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      date: this.editForm.get(['date'])!.value,
      natureActe: this.editForm.get(['natureActes'])!.value,
    };
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

  protected onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }

  protected onErrorLoad(errorMessage: string): void {
    this.afficheMessage(errorMessage, 'danger');
  }
}
