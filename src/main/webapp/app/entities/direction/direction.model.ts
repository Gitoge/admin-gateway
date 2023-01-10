import { IService } from 'app/entities/service/service.model';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';

export interface IDirection {
  id?: number;
  code?: string;
  libelle?: string;
  adresse?: string | null;
  numTelephone?: string | null;
  fax?: string | null;
  email?: string | null;
  contact?: string | null;
  services?: IService[] | null;
  etab?: IEtablissement | null;
}

export class Direction implements IDirection {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public adresse?: string | null,
    public numTelephone?: string | null,
    public fax?: string | null,
    public email?: string | null,
    public contact?: string | null,
    public services?: IService[] | null,
    public etab?: IEtablissement | null
  ) {}
}

export function getDirectionIdentifier(direction: IDirection): number | undefined {
  return direction.id;
}
