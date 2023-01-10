import dayjs from 'dayjs/esm';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { ICategorieAgent } from '../categorie-agent/categorie-agent.model';
import { IService } from '../../service/service.model';
import { IEmplois } from '../../emplois/emplois.model';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { IEtablissementBancaire } from 'app/entities/etablissement-bancaire/etablissement-bancaire.model';
import { IBilleteur } from 'app/entities/billeteur/billeteur.model';
import { INationalite } from '../nationalite/nationalite.model';
import { IGrilleIndiciaire } from '../grille-indiciaire/grille-indiciaire.model';
import { IHierarchie } from 'app/entities/hierarchie/hierarchie.model';
import { IEchelon } from 'app/entities/echelon/echelon.model';
import { IIndices } from '../indices/indices.model';
import { IEnfant } from '../enfant/enfant.model';
import { IGrilleConvention } from '../grille-convention/grille-convention.model';
import { IParamMatricules } from '../param-matricules/param-matricules.model';
import { IGrilleSoldeGlobal } from '../grille-solde-global/grille-solde-global.model';
import { IDocumentAdministratif } from '../document-administratif/document-administratif.model';
import { IAgence } from 'app/entities/agence/agence.model';

export interface IPriseEnCompte {
  // **************** Informations en commun entre les différentes entités *********
  id?: number;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  status?: string | null;
  // **************** Informations en commun entre les différentes entités *********

  code?: string | null;
  libelle?: string;
  agent?: IAgent | null;
  categorieAgent?: ICategorieAgent;
  service?: IService;
  emplois?: IEmplois;
  etablissement?: IEtablissement;
  agence?: IAgence;
  billeteur?: IBilleteur;

  // ********** Informations Agent : ***************
  matricule?: string;
  typePiece?: string;
  numeroPiece?: string;
  numeroPasseport?: string;
  prenom?: string;
  nom?: string;
  sexe?: string;
  dateNaissance?: dayjs.Dayjs;
  lieuNaissance?: string;
  nationalite?: INationalite | null;
  telephone?: string | null;
  adresse?: string | null;
  email?: string | null;
  nomMari?: string | null;
  femmeMariee?: boolean | null;
  datePriseEnCharge?: dayjs.Dayjs | null;
  dateSortie?: dayjs.Dayjs | null;
  nationaliteId?: number | null;
  // ********** Informations Agent : ***************

  // ******* Informations Situation Familiale :  *******
  situationMatrimoniale?: string;
  nombreEpouse?: number | null;
  conjointSalarie?: string | null;
  nombreEnfant?: number | null;
  nombrePart?: number | null;
  nombreEnfantImposable?: number | null;
  nombreEnfantMajeur?: number | null;
  nombreMinimumFiscal?: number | null;
  nombreEnfantDecede?: number | null;
  enfant?: IEnfant[] | null;
  paramMatricule?: IParamMatricules | null;
  // ******* Informations Situation Familiale :  *******

  // ******* Informations Situation Administrative :  *******
  dateRecrutement?: any;
  numeroRecrutement?: string;
  datePriseRang?: dayjs.Dayjs | null;
  numeroOrdreService?: string | null;
  dateOrdreService?: dayjs.Dayjs | null;
  loge?: boolean | null;
  logementFonction?: boolean | null;
  datedebut?: any;
  datefin?: any;
  numeroCompte?: string | null;
  grilleIndiciaire?: IGrilleIndiciaire;
  grilleConvention?: IGrilleConvention;
  grilleSoldeGlobal?: IGrilleSoldeGlobal;
  hierarchie?: IHierarchie;
  echelon?: IEchelon;
  corpsId?: number | null;
  hierarchieId?: number | null;
  etablissementId?: number | null;
  cadreId?: number | null;
  categorieId?: number | null;
  gradeId?: number | null;
  grade?: string | null;
  indice?: IIndices | null;
  indiceId?: number | null;
  echelonId?: number | null;
  classeId?: number | null;
  agenceId?: number | null;
  reglementId?: number | null;
  billeteurId?: number | null;
  modeReglement?: string;
  position?: number | null;
  soldeGlobal?: number | null;
  soldeIndiciaire?: number | null;
  typeRemuneration?: string | null;
  codeRemuneration?: number | null;
  cdi?: boolean | null;
  cleRib?: number | null;
  codeAgence?: number | null;
  document?: IDocumentAdministratif[] | null;

  // Affectation

  dateAffectation?: dayjs.Dayjs | null;
  dateEffet?: dayjs.Dayjs | null;

  servicesId?: number | null;
  emploisId?: number | null;
  codeEmplois?: string | null;
  natureActe?: string | null;
  etat?: string | null;

  // Les éléments de plus
  prestafa?: number | null;
  codeGrille?: string | null;
  soldeGlobalCP?: number | null;
}

export class PriseEnCompte implements IPriseEnCompte {
  constructor(
    // **************** Informations en commun entre les différentes entités *********
    public id?: number,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public typeRemuneration?: string | null,
    // **************** Informations en commun entre les différentes entités *********

    public code?: string | null,
    public libelle?: string,
    public agent?: IAgent | null,
    public categorieAgent?: ICategorieAgent,
    public service?: IService,
    public emplois?: IEmplois,
    public etablissement?: IEtablissement,
    public agence?: IAgence,
    public billeteur?: IBilleteur,

    // ********** Informations Agent : ***************
    public matricule?: string,
    public typePiece?: string,
    public numeroPiece?: string,
    public numeroPasseport?: string,
    public prenom?: string,
    public nom?: string,
    public sexe?: string,
    public dateNaissance?: dayjs.Dayjs,
    public lieuNaissance?: string,
    public nationalite?: INationalite | null,
    public telephone?: string | null,
    public adresse?: string | null,
    public email?: string | null,
    public nomMari?: string | null,
    public femmeMariee?: boolean | null,
    public datePriseEnCharge?: dayjs.Dayjs | null,
    public dateSortie?: dayjs.Dayjs | null,
    public status?: string | null,
    public nationaliteId?: number | null,
    // ********** Informations Agent : ***************

    // ******* Informations Situation Familiale :  *******
    public situationMatrimoniale?: string,
    public nombreEpouse?: number | null,
    public conjointSalarie?: string | null,
    public nombreEnfant?: number | null,
    public nombrePart?: number | null,
    public nombreEnfantImposable?: number | null,
    public nombreEnfantMajeur?: number | null,
    public nombreMinimumFiscal?: number | null,
    public nombreEnfantDecede?: number | null,
    public enfant?: IEnfant[] | null,
    // ******* Informations Situation Familiale :  *******

    // ******* Informations Situation Administrative :  *******
    public dateRecrutement?: any,
    public numeroRecrutement?: string,
    public datePriseRang?: dayjs.Dayjs | null,
    public numeroOrdreService?: string | null,
    public dateOrdreService?: dayjs.Dayjs | null,
    public loge?: boolean | null,
    public logementFonction?: boolean | null,
    public datedebut?: any,
    public datefin?: any,
    public numeroCompte?: string | null,
    public grilleIndiciaire?: IGrilleIndiciaire,
    public grilleConvention?: IGrilleConvention,
    public grilleSoldeGlobal?: IGrilleSoldeGlobal,
    public corpsId?: number | null,
    public etablissementId?: number | null,
    public hierarchieId?: number | null,
    public cadreId?: number | null,
    public categorieId?: number | null,
    public gradeId?: number | null,
    public grade?: string | null,
    public indice?: IIndices | null,
    public indiceId?: number | null,
    public echelonId?: number | null,
    public classeId?: number | null,
    public agenceId?: number | null,
    public billeteurId?: number | null,
    public modeReglement?: string,
    public reglementId?: number | null,
    public position?: number | null,
    public dateAffectation?: dayjs.Dayjs | null,
    public dateEffet?: dayjs.Dayjs | null,
    public servicesId?: number | null,
    public codeEmplois?: string | null,
    public emploisId?: number | null,
    public soldeGlobal?: number | null,
    public soldeIndiciaire?: number | null,
    public codeRemuneration?: number | null,
    public cdi?: boolean | null,
    public cleRib?: number | null,
    public codeAgence?: number | null,
    public etat?: string | null,
    public document?: IDocumentAdministratif[] | null,
    // Les éléments de plus

    public prestafa?: number | null,
    public codeGrille?: string | null,
    public soldeGlobalCP?: number | null
  ) {}
}

export function getPriseEnCompteIdentifier(priseEncompte: IPriseEnCompte): number | undefined {
  return priseEncompte.id;
}
