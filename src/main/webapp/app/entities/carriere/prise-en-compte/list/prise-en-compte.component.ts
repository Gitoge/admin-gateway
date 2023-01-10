import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
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
import { IAgence } from 'app/entities/agence/agence.model';
import { EtablissementBancaireService } from 'app/entities/etablissement-bancaire/service/etablissement-bancaire.service';
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
import { IDocumentAdministratif } from '../../document-administratif/document-administratif.model';
import { DocumentAdministratifDeleteDialogComponent } from '../../document-administratif/delete/document-administratif-delete-dialog.component';
import { DataUtils } from '../../../../core/util/data-util.service';
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
import { IAgent } from '../../agent/agent.model';
import { ISituationAdministrative, SituationAdministrative } from '../../situation-administrative/situation-administrative.model';

@Component({
  selector: 'jhi-prise-en-compte',
  templateUrl: './prise-en-compte.component.html',
  styleUrls: ['./recherche.scss'],
})
export class PriseEnCompteComponent implements OnInit {
  isSaving = false;

  userInsert: any;

  matricule = '';

  priseEnCompteId: any;

  soldeIndiciaire: any;

  title!: string;

  agents!: IAgent[];

  agent!: IAgent;

  situationAdministrative!: ISituationAdministrative[];

  modalRef?: NgbModalRef;

  priseEncompte!: IPriseEnCompte;
  documentsAdministratif?: IDocumentAdministratif[];
  priseEnCompte!: IPriseEnCompte;
  categorieAgentSharedCollection: ICategorieAgent[] = [];
  categorieSharedCollection: ICategorieAgent[] = [];
  serviceSharedCollection: IService[] = [];
  emploisSharedCollection: IEmplois[] = [];
  positionSharedCollection: IPositions[] = [];
  etablissementSharedCollection: IEtablissement[] = [];
  nationaliteSharedCollection: INationalite[] = [];
  echelonSharedCollection: IEchelon[] = [];
  hierarchieSharedCollection: IHierarchie[] = [];
  classeSharedCollection: IClasse[] = [];
  gradeSharedCollection: IGrade[] = [];
  indicesSharedCollection: IIndices[] = [];

  keyword = 'libelleLong';

  keywordBanque = 'libelle';

  keywordGrade = 'libelle';

  keywordEmploi = 'libelle';

  keywordClasse = 'libelle';

  keywordEchelon = 'libelle';

  keywordIndice = 'libelle';

  keywordHierarchie = 'libelle';

  keywordCategorie = 'libelle';

  keywordBilleteur = 'prenom';

  billeteurSharedCollection: IBilleteur[] = [];

  agenceSharedCollection: IAgence[] = [];

  // ----------------------------------------

  success: any;

  typeMessage?: string;
  _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage = '';

  active: any;

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
  echelonId!: number;

  gradeId!: number;

  classeId!: number;

  categorieId!: number;

  etablissementId!: number;
  emploisId!: number;
  servicesId!: number;

  codeEmplois!: string;

  indiceId!: number;

  isLoge!: boolean;

  matriculeA: any;

  matriculeAgen: any;

  isLogementFonction!: boolean;

  isCDI!: boolean;

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

  modeReglement!: ITableValeur[];

  modeReglementChoisi!: ITableValeur;

  today: any;

  @ViewChild('staticAlert', { static: false }) staticAlert?: NgbAlert;
  @ViewChild('selfClosingAlert', { static: false }) selfClosingAlert?: NgbAlert;

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

    categorieAgent: [],
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
    numeroPiece: [null, [Validators.minLength(13), Validators.maxLength(14), Validators.pattern('^[a-zA-Z0-9]*$')]],
    prenom: [null, [Validators.minLength(2), Validators.maxLength(50)]],
    nom: [null, [Validators.minLength(2), Validators.maxLength(32)]],
    dateNaissance: [],
    lieuNaissance: [null, [Validators.minLength(3), Validators.maxLength(10), Validators.pattern('^[a-zA-Z0-9]*$')]],
    sexe: [null],
    nomMari: [],
    telephone: [null, [Validators.pattern('^[Z0-9]*$')]],
    email: [null],
    adresse: [],
    femmeMariee: [],
    datePriseEnCharge: [],
    dateSortie: [],
    status: [],
    titre: [],
    nationalite: [],

    // Situation Familiale :
    situationMatrimoniale: [null],
    nombreEpouse: [],
    nombreEnfant: [],
    nombrePart: [],
    nombreEnfantImposable: [],
    nombreEnfantMajeur: [],
    nombreMinimumFiscal: [],
    nombreEnfantDecede: [],
    enfants: [],

    // Situation Administrative :

    dateRecrutement: [null, [Validators.required]],
    numeroRecrutement: [null, [Validators.required]],
    datePriseRang: [],
    numeroOrdreService: [],
    dateOrdreService: [],
    loge: [],
    logementFonction: [],
    datedebut: [],
    datefin: [],
    numeroCompte: [null, [Validators.minLength(24), Validators.maxLength(24), Validators.pattern('^[0-9]*$')]],
    corpsId: [],
    hierarchieId: [],
    cadreId: [],
    categorieId: [],
    gradeId: [],
    indiceId: [],
    echelonId: [],
    classeId: [],
    position: [],
    agenceId: [],
    reglementId: [],
    billeteurId: [],
    modeReglement: [null, [Validators.required]],
    emploisId: [],
    servicesId: [],
    grilleIndiciaire: [],
    grilleConvention: [],
    soldeGlobal: [],
    soldeIndiciaire: [],
    typeRemuneration: [],
    codeEmplois: [],
    natureActe: [],
    cdi: [],
    cleRib: [],
    codeAgence: [],
  });

  nombreEnfant: any;
  nombreEpouse: any;
  natureActe: any;
  isContrat = false;

  nationaliteAgent!: INationalite;

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
    private agenceService: EtablissementBancaireService,
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
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected router: Router,
    protected tableValeurService: TableValeurService,
    protected conventionService: ConventionService,
    private datePipe: DatePipe
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
    this.title = "Prise en compte d'un ancien agent ";
    this.activatedRoute.data.subscribe(({ priseEncompte }) => {
      this.priseEncompte = priseEncompte;
      this.nombreEnfant = 0;
      this.nombreEpouse = 0;

      if (priseEncompte.id === undefined) {
        const today = dayjs().startOf('day');
        priseEncompte.dateInsert = today;
        priseEncompte.dateUpdate = today;
      }
      this.updateForm(priseEncompte);
    });
    this.loadRelationshipsOptions();

    this.sauvegardeAgent = false;

    this.isLoge = false;

    this.isLogementFonction = false;

    this.isCDI = false;

    this.today = dayjs().startOf('day');

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
    //this.isSaving = true;
    const pec = this.createFromFormPriseEnCompte();
    this.isSaving = false;
    this.modalRef = this.modalService.open(PieceAdministrativeComponent, {
      size: 'lg',
    });

    const contentComponentInstance = this.modalRef.componentInstance;
    contentComponentInstance.idProprietaire = pec.id;
    contentComponentInstance.typeEntite = 'PRISE-EN-COMPTE';
    contentComponentInstance.matricule = pec.matricule;
    this.modalRef.componentInstance.clickEvent.subscribe((document: IDocumentAdministratif) => {
      this.documents?.push(document);
      console.error(' tableau documentss', this.documents);
    });

    /*    this.modalRef.componentInstance.clickevent.subscribe((emit: string) => {
          if (emit === 'success ajout') {
            this.afficheMessage('Ajout document administratif effectué avec succés', 'success');
            this.documentsAdministratif?.push(this.modalRef?.componentInstance.piece);
            this.isSaving = false;
          } else if (emit === 'echec ajout') {
            this.afficheMessage('Echec ajout document administratif.', 'danger');
            this.isSaving = false;
          }
          this.isSaving = false;
        });*/
    //    return this.modalRef;
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
      case 'Solde Indiciaire':
        this.isIndiciaire = true;
        this.isCasParticulier = false;
        this.isSoldeGlobal = false;
        this.isConvention = false;
        break;
      case 'Solde Global':
        this.isIndiciaire = false;
        this.isCasParticulier = false;
        this.isSoldeGlobal = true;
        this.isConvention = false;
        break;
      case 'Cas particuliers':
        this.isIndiciaire = false;
        this.isCasParticulier = true;
        this.isSoldeGlobal = false;
        this.isConvention = false;
        break;
      case 'Convention':
        this.isIndiciaire = false;
        this.isCasParticulier = false;
        this.isSoldeGlobal = false;
        this.isConvention = true;
        break;
      default:
        break;
    }
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

    if (param.code === 'BILLETAGE') {
      this.isBilleteur = true;
    }
  }

  onChoixSexe(param: string): void {
    this.isMasculin = false;
    if (param === 'Masculin') {
      this.isMasculin = true;
    }

    if (param === 'Féminin') {
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
    console.error(param);

    this.conventionService.find(param.conventionId).subscribe((result: any) => {
      this.convention = result.body;
      console.error(this.convention);

      if (this.convention.code === 'CONVENTION_ENTREPRISE') {
        this.isConventionEntreprise = true;
      } else {
        this.isConventionEntreprise = false;
      }
    });
  }

  getSelectedTypePiece(typePiece: any): void {
    this.typePieceChoisi = typePiece;
  }

  getSelectedNatureActe(natureActe: any): void {
    this.natureActeChoisi = natureActe;
    if (natureActe.code === 'CONTRAT') {
      this.isContrat = true;
    } else {
      this.isContrat = false;
    }
  }
  getSelectedRemuneration(typeRemuneration: any): void {
    this.typeRemunerationChoisi = typeRemuneration;
  }

  getSelectedGenre(genre: any): void {
    this.genreChoisi = genre;
  }

  getSelectedStatutMarital(statutMariral: any): void {
    this.statutMaritalChoisi = statutMariral;
  }
  selectEventEtablissement(item: any): any {
    this.editForm.patchValue({
      gradeId: [],
      indiceId: [],
      hierarchieId: null,
      echelonId: null,
      soldeIndiciaire: null,
    });
  }

  selectEventBanque(item: any): any {
    this.editForm.patchValue({
      codeAgence: item.code,
    }); // do something with selected item
  }

  selectEventHierarchie(item: any): any {
    // do something with selected item
  }

  selectEventGrade(item: any): any {
    this.gradeId = item;
    this.getHierarchieEchelonByGrade(item);
  }

  selectEventGrade2(item: any): any {
    this.gradeId = item.id;
    this.getGrilleConventionbyGrade(item.id);
    this.getGrilleConventionEntreprisebyGrade(item.id);
  }

  selectEventIndice(item: any): any {
    this.indiceId = item;
    this.getHierarchieEchelonByIndice(item);
  }

  selectEventClasse(item: any): any {
    this.classeId = item.id;
    this.getGrilleConventionbyClasse(item.id);
  }

  selectEventEchelon(item: any): any {
    this.echelonId = item.id;
    this.getGrilleSoldeGlobalByEchelon(item.id);
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
  }

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

  onFocusedEmploi(e: any): any {
    // do something
  }

  onFocusedBanque(e: any): any {
    // do something
  }

  onFocusedBilleteur(e: any): any {
    // do something
  }

  onChangeSearch(search: string): any {
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
      const priseEncompte = this.createFromFormPriseEnCompte();
      if (this.gradeId) {
        this.grilleIndiciaireService.findGradeAndIndices(this.gradeId, indice).subscribe((result: any) => {
          priseEncompte.grilleIndiciaire = result.body;
          console.error(priseEncompte.grilleIndiciaire);
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
        const priseEncompte = this.createFromFormPriseEnCompte();
        console.error('Indice :', priseEncompte.indiceId);
        if (priseEncompte.indiceId !== undefined && priseEncompte.indiceId !== null) {
          this.grilleIndiciaireService.findGradeAndIndices(grade, priseEncompte.indiceId).subscribe((result: any) => {
            priseEncompte.grilleIndiciaire = result.body;

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
      const priseEncompte = this.createFromFormPriseEnCompte();
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
        const priseEncompte = this.createFromFormPriseEnCompte();
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

              this.editForm.patchValue({
                soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
              });

              // if (priseEncompte.grilleConvention !== null && priseEncompte.grilleConvention !== undefined ) {
              //   if (priseEncompte.grilleConvention.salaireDeBase) {
              //     this.editForm.patchValue({
              //       soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
              //     });
              //   }
              // }

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
        const priseEncompte = this.createFromFormPriseEnCompte();
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

              this.editForm.patchValue({
                soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
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
      const priseEncompte = this.createFromFormPriseEnCompte();
      console.error('Etablissement :', priseEncompte.etablissementId);
      console.error('Grade :', priseEncompte.gradeId);
      console.error('Categorie :', priseEncompte.categorieId);

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

            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
            });
          });
      }
    } else {
      this.editForm.patchValue({
        soldeGlobal: null,
      });
    }
  }

  getGrilleConventionbyCategorie(categorie: number | null | undefined): void {
    console.error('Categorie :', categorie);

    if (categorie !== null && categorie !== undefined) {
      const priseEncompte = this.createFromFormPriseEnCompte();
      console.error('Etablissement :', priseEncompte.etablissementId);
      console.error('Grade :', priseEncompte.gradeId);
      console.error('Classe :', priseEncompte.classeId);

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
            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
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

  getGrilleConventionEntreprisebyCategorie(categorie: number | null | undefined): void {
    console.error('Categorie :', categorie);

    if (categorie !== null && categorie !== undefined) {
      const priseEncompte = this.createFromFormPriseEnCompte();
      console.error('Etablissement :', priseEncompte.etablissementId);
      console.error('Grade :', priseEncompte.gradeId);

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
            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
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

  getGrilleConventionbyEtablissement(etablissement: number | null | undefined): void {
    console.error('Etablissement :', etablissement);

    if (etablissement !== null && etablissement !== undefined) {
      const priseEncompte = this.createFromFormPriseEnCompte();
      console.error('Categorie :', priseEncompte.categorieId);
      console.error('Grade :', priseEncompte.gradeId);
      console.error('Classe :', priseEncompte.classeId);

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
      const priseEncompte = this.createFromFormPriseEnCompte();
      console.error('Categorie :', priseEncompte.categorieId);
      console.error('Grade :', priseEncompte.gradeId);

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
            this.editForm.patchValue({
              soldeGlobal: priseEncompte.grilleConvention?.salaireDeBase,
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

  changePageSuivante(tab: NgbNav): void {
    tab.select('infos-forfait');
  }

  onNavChange(changeEvent: NgbNavChangeEvent): void {
    if (changeEvent.nextId === 3) {
      changeEvent.preventDefault();
    }
  }

  delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  calculEmolument(pec: IPriseEnCompte | null): void {
    // Saisie automatique de la table emolument
    const emoluments = new Emoluments();
    // Emolument pour le complement special
    emoluments.codePoste = '142';
    emoluments.etablissementId = this.etablissementId;
    emoluments.taux = 20;
    emoluments.matricule = pec?.matricule;
    //emoluments.agentId = pec.agent!.id!;
    emoluments.montant = this.soldeIndiciaire * 1.29 * 0.2;
    emoluments.reference = 'complement special de solde';

    // Saisie automatique de la table emolument
    const soldeMIA = new Emoluments();
    // solde mensuel indiciaire assimilé
    soldeMIA.codePoste = '111';
    soldeMIA.etablissementId = this.etablissementId;
    soldeMIA.taux = 29;
    soldeMIA.matricule = pec?.matricule;
    soldeMIA.matricule = pec?.matricule;
    // soldeMIA.agentId = pec.agent!.id!;
    soldeMIA.montant = this.soldeIndiciaire * 1.29;
    soldeMIA.dateEffet = pec?.dateRecrutement;
    soldeMIA.dateEcheance = pec?.dateRecrutement;
    soldeMIA.reference = 'solde mensuel indiciaire assimile';

    // Indemnité de residence
    const residence = new Emoluments();
    // Indemnité de residence
    residence.codePoste = '151';
    residence.etablissementId = this.etablissementId;
    residence.taux = 14;
    residence.matricule = pec?.matricule;
    residence.montant = this.soldeIndiciaire * 1.29 * 0.14;
    residence.reference = 'Indemnité de résidence';
    this.subscribeToSaveResponse2(this.emolumentsSerice.create(emoluments));

    this.subscribeToSaveResponse2(this.emolumentsSerice.create(soldeMIA));

    this.subscribeToSaveResponse2(this.emolumentsSerice.create(residence));

    if (this.codeEmplois === '9814') {
      // Indemnité d'enseignement
      const enseignant = new Emoluments();
      enseignant.codePoste = '145';
      enseignant.etablissementId = this.etablissementId;
      enseignant.taux = 50;
      enseignant.matricule = pec?.matricule;
      enseignant.montant = this.soldeIndiciaire * 1.29 * 0.5;
      enseignant.reference = 'INDEMNITE ENSEIGNEMENT';
      this.subscribeToSaveResponse2(this.emolumentsSerice.create(enseignant));
    }
  }

  refresh(): void {
    window.location.reload();
  }

  getAgentByMatricule(matricule: any): void {
    this.isIndiciaire = false;
    this.isSoldeGlobal = false;
    this.isCasParticulier = false;
    this.isConvention = false;
    this.isModeBanque = false;
    this.isBilleteur = false;
    // this.editForm.patchValue({
    //   categorieAgent: [],
    //   categorie: [],
    //   service: [],
    //   emplois: [],
    //   etablissement: [],
    //   etablissementId: [],
    //   billeteur: [],
    //   agence: [],
    //   echelon: [],
    //   hierarchie: [],
    //   classe: [],
    //   grade: [],
    //   indice: [],

    //   // Situation Administrative :

    //   dateRecrutement: [null],
    //   datePriseRang: [],
    //   numeroOrdreService: [],
    //   dateOrdreService: [],
    //   loge: [],
    //   logementFonction: [],
    //   datedebut: [],
    //   datefin: [],
    //   numeroCompte: [],
    //   corpsId: [],
    //   hierarchieId: [],
    //   cadreId: [],
    //   categorieId: [],
    //   gradeId: [],
    //   indiceId: [],
    //   echelonId: [],
    //   classeId: [],
    //   position: [],
    //   agenceId: [],
    //   reglementId: [],
    //   billeteurId: [],
    //   modeReglement: [],
    //   emploisId: [],
    //   servicesId: [],
    //   grilleIndiciaire: [],
    //   grilleConvention: [],
    //   soldeGlobal: [],
    //   soldeIndiciaire: [],
    //   typeRemuneration: [],
    //   codeEmplois: [],
    //   natureActe: [],
    //   cdi: [],
    //   cleRib: [],
    //   codeAgence: [],
    // });

    this.agentService.findAgentByMatricule(matricule).subscribe((result: any) => {
      this.agents = result.body;
      console.error(this.agents);

      if (this.agents.length === 0) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur...',
          text: 'Matricule introuvable !',
        });
      } else {
        this.agent = this.agents[0];

        if (this.agent?.nationalite?.id) {
          this.nationaliteService.find(this.agent.nationalite.id).subscribe((resultat: any) => {
            this.nationaliteAgent = resultat.body;
          });
        }

        this.editForm.patchValue({
          matricule: this.agent.matricule,
          typePiece: this.agent.typePiece,
          numeroPiece: this.agent.numeroPiece,
          prenom: this.agent.prenom,
          nom: this.agent.nom,
          dateNaissance: this.datePipe.transform(this.agent.dateNaissance, 'dd-MM-yyyy'),
          lieuNaissance: this.agent.lieuNaissance,
          sexe: this.agent.sexe,
          telephone: this.agent.telephone,
          email: this.agent.email,
          adresse: this.agent.adresse,
        });
      }
    });
  }

  save(): void {
    this.isSaving = true;
    const priseEncompte = this.createFromFormPriseEnCompte();
    priseEncompte.dateNaissance = this.agent.dateNaissance;
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
    priseEncompte.nombreEnfantImposable = 0;
    priseEncompte.situationMatrimoniale = 'Célibataire';
    priseEncompte.nombrePart = 1;

    priseEncompte.natureActe = this.natureActeChoisi.code;
    priseEncompte.modeReglement = this.modeReglementChoisi.code;
    priseEncompte.typeRemuneration = this.typeRemunerationChoisi.libelle;
    if (priseEncompte.typeRemuneration === 'Solde Indiciaire') {
      priseEncompte.codeRemuneration = 1;
    } else {
      if (priseEncompte.typeRemuneration === 'Solde Global') {
        priseEncompte.codeRemuneration = 4;
      } else {
        priseEncompte.codeRemuneration = 6;
      }
    }
    priseEncompte.emploisId = this.emploisId;
    priseEncompte.etat = 'SAISIE';
    priseEncompte.agent = this.agent;
    console.error(priseEncompte);
    this.subscribeToSaveResponse(this.priseEncompteService.createSituations(priseEncompte));
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
      .pipe(
        map((agence: IAgence[]) =>
          this.agenceService.addEtablissementBancaireToCollectionIfMissing(agence, this.editForm.get('agence')!.value)
        )
      )
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
      this.calculEmolument(priseEncompte);
      console.error('code Emplois ', priseEncompte?.codeEmplois);

      this.isSaving = false;
      (async () => {
        // Do something before delay
        console.error('before delay');
        this.afficheMessage('Opération effectuée avec succés.', 'success');

        await this.delay(5000);

        this.refresh();

        // Do something after
        console.error('after delay');
      })();

      if (this.priseEnCompte.id !== undefined) {
        /* this.modalRef = this.modalService.open(MatriculeAgentViewComponent, {
          size: 'md',
        });
        const contentComponentInstance = this.modalRef.componentInstance;
        contentComponentInstance.priseEnCompte = this.priseEnCompte;*/
        Swal.fire(
          `<h3 style="font-family: arial">Prise en compte de ${priseEncompte?.prenom ?? ''} ${
            priseEncompte?.nom ?? ''
          } <br> effectuée avec succés</h3>`,
          `Le matricule generé est: <br><br> <h2 style="text-shadow: 1px 1px 1px black, 2px 2px 1px black"> ${
            priseEncompte?.matricule ?? ''
          } </h2>`,
          'success'
        );
      }
    }
  }
  protected onSaveSuccess1(): void {
    this.router.navigate(['/prise-en-compte']);
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
      //   libelle: priseEncompte.libelle,
      userInsertId: priseEncompte.userInsertId,
      userUpdateId: priseEncompte.userUpdateId,
      dateInsert: priseEncompte.dateInsert ? priseEncompte.dateInsert.format(DATE_TIME_FORMAT) : null,
      dateUpdate: priseEncompte.dateUpdate ? priseEncompte.dateUpdate.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromFormPriseEnCompte(): IPriseEnCompte {
    return {
      ...new PriseEnCompte(),
      id: this.editForm.get(['id'])!.value,
      code: this.editForm.get(['code'])!.value,
      // libelle: this.editForm.get(['libelle'])!.value,

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
      nombreEnfant: this.editForm.get(['nombreEnfant'])!.value,
      nombrePart: this.editForm.get(['nombrePart'])!.value,
      nombreEnfantImposable: this.editForm.get(['nombreEnfantImposable'])!.value,
      nombreEnfantMajeur: this.editForm.get(['nombreEnfantMajeur'])!.value,
      nombreMinimumFiscal: this.editForm.get(['nombreMinimumFiscal'])!.value,
      nombreEnfantDecede: this.editForm.get(['nombreEnfantDecede'])!.value,

      // Informations Situation Administrative :

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
    };
  }

  protected createFromFormSituationAdministrative(): ISituationAdministrative {
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
