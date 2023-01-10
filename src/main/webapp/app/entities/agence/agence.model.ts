import { IEtablissementBancaire } from '../etablissement-bancaire/etablissement-bancaire.model';

export interface IAgence {
  id?: number;
  code?: string;
  libelle?: string | null;
  telephone?: string | null;
  adresse?: string | null;
  etablissementBancaire?: IEtablissementBancaire | null;
}

export class Agence implements IAgence {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string | null,
    public telephone?: string | null,
    public adresse?: string | null,
    public etablissementBancaire?: IEtablissementBancaire | null
  ) {}
}

export function getAgenceIdentifier(agence: IAgence): number | undefined {
  return agence.id;
}
