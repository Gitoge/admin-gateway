import { IEtablissement } from '../etablissement/etablissement.model';

export interface IBilleteur {
  id?: number;
  etablissement?: IEtablissement | null;
  code?: string;
  prenom?: string | null;
  nom?: string | null;
  matricule?: string | null;
  telephone?: string | null;
}

export class Billeteur implements IBilleteur {
  constructor(
    public id?: number,
    public etablissement?: IEtablissement | null,
    public code?: string,
    public prenom?: string | null,
    public nom?: string | null,
    public matricule?: string | null,
    public telephone?: string | null
  ) {}
}

export function getBilleteurIdentifier(billeteur: IBilleteur): number | undefined {
  return billeteur.id;
}
