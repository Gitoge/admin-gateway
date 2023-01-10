import { IDestinataires } from 'app/entities/destinataires/destinataires.model';

export interface ITypeDestinataires {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  destinataires?: IDestinataires[] | null;
}

export class TypeDestinataires implements ITypeDestinataires {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public destinataires?: IDestinataires[] | null
  ) {}
}

export function getTypeDestinatairesIdentifier(typeDestinataires: ITypeDestinataires): number | undefined {
  return typeDestinataires.id;
}
