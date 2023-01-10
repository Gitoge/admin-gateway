import { IDirection } from 'app/entities/direction/direction.model';
import { ITypeEtablissement } from 'app/entities/type-etablissement/type-etablissement.model';
import { ILocalite } from 'app/entities/localite/localite.model';

export interface IEtablissement {
  id?: number;
  code?: string;
  sigle?: string;
  libelleCourt?: string;
  libelleLong?: string;
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
  conventionId?: number | null;
  libelleConvention?: string | null;
  convention?: string | null;
}

export class Etablissement implements IEtablissement {
  constructor(
    public id?: number,
    public code?: string,
    public sigle?: string,
    public libelleCourt?: string,
    public libelleLong?: string,
    public adresse?: string | null,
    public numTelephone?: string | null,
    public fax?: string | null,
    public email?: string | null,
    public bp?: string | null,
    public directions?: IDirection[] | null,
    public typeEtab?: ITypeEtablissement | null,
    public localite?: ILocalite | null,
    public conventionId?: number | null,
    public libelleConvention?: string | null,
    public convention?: string | null
  ) {}
}

export function getEtablissementIdentifier(etablissement: IEtablissement): number | undefined {
  return etablissement.id;
}
