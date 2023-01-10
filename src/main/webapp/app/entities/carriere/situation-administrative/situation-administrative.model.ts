import dayjs from 'dayjs/esm';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { ICategorieAgent } from 'app/entities/carriere/categorie-agent/categorie-agent.model';
import { IIndices } from '../indices/indices.model';

export interface ISituationAdministrative {
  id?: number;
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
  status?: string | null;
  corpsId?: number | null;
  hierarchieId?: number | null;
  cadreId?: number | null;
  gradeId?: number | null;
  echelonId?: number | null;
  classeId?: number | null;
  reglementId?: number | null;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  actes?: IActes | null;
  agent?: IAgent | null;
  categorieAgent?: ICategorieAgent | null;
  position?: number | null;
  soldeGlobal?: number | null;
  natureActe?: number | null;
  indice?: IIndices | null;
  modeReglement?: string;
  etablissementId?: number | null;
  etablissement?: number | null;
  servicesId?: number | null;
  emploisId?: number | null;
  codeRemuneration?: number | null;
  prestafa?: number | null;
  codeGrille?: string | null;
  typePec?: string | null;
}

export class SituationAdministrative implements ISituationAdministrative {
  constructor(
    public id?: number,
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
    public status?: string | null,
    public corpsId?: number | null,
    public hierarchieId?: number | null,
    public cadreId?: number | null,
    public gradeId?: number | null,
    public echelonId?: number | null,
    public classeId?: number | null,
    public reglementId?: number | null,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public actes?: IActes | null,
    public agent?: IAgent | null,
    public categorieAgent?: ICategorieAgent | null,
    public position?: number | null,
    public indice?: IIndices | null,
    public modeReglement?: string,
    public servicesId?: number | null,
    public emploisId?: number | null,
    public etablissementId?: number | null,
    public etablissement?: number | null,
    public codeRemuneration?: number | null,
    public prestafa?: number | null,
    public codeGrille?: string | null,
    public typePec?: string | null
  ) {
    this.loge = this.loge ?? false;
    this.logementFonction = this.logementFonction ?? false;
  }
}

export function getSituationAdministrativeIdentifier(situationAdministrative: ISituationAdministrative): number | undefined {
  return situationAdministrative.id;
}
