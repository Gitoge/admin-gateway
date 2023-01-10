import dayjs from 'dayjs/esm';
import { Sexe } from '../enumerations/sexe.model';
import { IProfils } from '../profils/profils.model';
import { TypeLocalite } from '../type-localite/type-localite.model';
import { ILocalite } from '../localite/localite.model';
import { IEtablissement } from '../etablissement/etablissement.model';
import { IRoles } from '../roles/roles.model';
import { IPages } from '../pages/pages.model';
import { IModules } from '../modules/modules.model';
import { IActions } from '../actions/actions.model';
import { IPagesActions } from 'app/shared/model/pagesActions';

export interface IPersonne {
  id?: number;
  login?: string | null;
  password?: string | null;
  prenom?: string | null;
  nom?: string | null;
  dateNaissance?: dayjs.Dayjs | null;
  lieuNaissance?: string | null;
  telephone?: string | null;
  typePiece?: string | null;
  numeroPiece?: string | null;
  email?: string | null;
  sexe?: Sexe | null;
  profils?: IProfils | null;
  champIntervention?: TypeLocalite;
  etablissement?: IEtablissement;
  region?: ILocalite;
  departement?: ILocalite;
  commune?: ILocalite;
  roles?: IRoles;
  jhiUserId?: number;
  userInsertId?: number;
  datePremiereConnexion?: any | null;
  dateDerniereConnexion?: any | null;
  siege?: string | null;
  pages?: IPages[];
  modules?: IModules[];
  actions?: IActions[];
  pagesActions?: IPagesActions[];
}

export class Personne implements IPersonne {
  constructor(
    public id?: number,
    public login?: string | null,
    public password?: string | null,
    public prenom?: string | null,
    public nom?: string | null,
    public dateNaissance?: dayjs.Dayjs | null,
    public lieuNaissance?: string | null,
    public telephone?: string | null,
    public typePiece?: string | null,
    public numeroPiece?: string | null,
    public email?: string | null,
    public sexe?: Sexe | null,
    public profils?: IProfils | null,
    public champIntervention?: TypeLocalite,
    public etablissement?: IEtablissement,
    public region?: ILocalite,
    public departement?: ILocalite,
    public commune?: ILocalite,
    public roles?: IRoles,
    public jhiUserId?: number,
    public userInsertId?: number,
    public datePremiereConnexion?: any | null,
    public dateDerniereConnexion?: any | null,
    public siege?: string | null,
    public pages?: IPages[],
    public modules?: IModules[],
    public actions?: IActions[],
    public pagesActions?: IPagesActions[]
  ) {}
}

export function getPersonneIdentifier(personne: IPersonne): number | undefined {
  return personne.id;
}
