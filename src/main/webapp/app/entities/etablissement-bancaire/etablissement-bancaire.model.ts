import { ILocalite } from '../localite/localite.model';

export interface IEtablissementBancaire {
  id?: number;
  code?: string;
  libelle?: string | null;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  fax?: string | null;
  sigle?: string | null;
  swift?: string | null;
}

export class EtablissementBancaire implements IEtablissementBancaire {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string | null,
    public telephone?: string | null,
    public email?: string | null,
    public adresse?: string | null,
    public fax?: string | null,
    public sigle?: string | null,
    public swift?: string | null
  ) {}
}

export function getEtablissementBancaireIdentifier(etablissementBancaire: IEtablissementBancaire): number | undefined {
  return etablissementBancaire.id;
}
