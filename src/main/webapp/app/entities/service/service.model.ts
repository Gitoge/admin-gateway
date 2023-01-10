import { IDirection } from 'app/entities/direction/direction.model';

export interface IService {
  id?: number;
  code?: string;
  libelle?: string;
  adresse?: string | null;
  numTelephone?: string | null;
  fax?: string | null;
  email?: string | null;
  contact?: string | null;
  direction?: IDirection | null;
}

export class Service implements IService {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public adresse?: string | null,
    public numTelephone?: string | null,
    public fax?: string | null,
    public email?: string | null,
    public contact?: string | null,
    public direction?: IDirection | null
  ) {}
}

export function getServiceIdentifier(service: IService): number | undefined {
  return service.id;
}
