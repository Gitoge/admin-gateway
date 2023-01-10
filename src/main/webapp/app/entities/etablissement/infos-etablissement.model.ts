import { IDirection } from 'app/entities/direction/direction.model';
import { ITypeEtablissement } from 'app/entities/type-etablissement/type-etablissement.model';
import { ILocalite } from 'app/entities/localite/localite.model';
import { IConvention } from '../carriere/convention/convention.model';
import { IInfosConventionEtablissements } from './infos-convention-etablissement.model';
import { IConventionEtablissements } from '../carriere/convention-etablissements/convention-etablissements.model';

export interface IInfosEtablissement {
  id?: number;
  code?: string;
  sigle?: string;
  libelle?: string;
  adresse?: string | null;
  numTelephone?: string | null;
  fax?: string | null;
  email?: string | null;
  bp?: string | null;
  directions?: IDirection[] | null;
  typeEtab?: ITypeEtablissement | null;
  localite?: ILocalite | null;
  region?: ILocalite;
  departement?: ILocalite;
  commune?: ILocalite;
  conventionsChoisies?: IConventionEtablissements[];
  infosConventionsEtablissement?: IInfosConventionEtablissements[];
}

export class InfosEtablissement implements IInfosEtablissement {
  constructor(
    public id?: number,
    public code?: string,
    public sigle?: string,
    public libelle?: string,
    public adresse?: string | null,
    public numTelephone?: string | null,
    public fax?: string | null,
    public email?: string | null,
    public bp?: string | null,
    public directions?: IDirection[] | null,
    public typeEtab?: ITypeEtablissement | null,
    public localite?: ILocalite | null,
    public conventionsChoisies?: IConvention[]
  ) {}
}
