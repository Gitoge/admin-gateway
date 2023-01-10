import { ITypeDestinataires } from 'app/entities/type-destinataires/type-destinataires.model';

export interface IDestinataires {
  id?: number;
  code?: string;
  libelle?: string | null;
  prenom?: string | null;
  nom?: string | null;
  adresse?: string | null;
  comptebancaire?: string | null;
  typedestinataires?: ITypeDestinataires | null;
}

export class Destinataires implements IDestinataires {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string | null,
    public prenom?: string | null,
    public nom?: string | null,
    public adresse?: string | null,
    public comptebancaire?: string | null,
    public typedestinataires?: ITypeDestinataires | null
  ) {}
}

export function getDestinatairesIdentifier(destinataires: IDestinataires): number | undefined {
  return destinataires.id;
}
