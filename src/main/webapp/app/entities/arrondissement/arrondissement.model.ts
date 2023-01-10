import { IDepartement } from 'app/entities/departement/departement.model';

export interface IArrondissement {
  id?: number;
  code?: string;
  libelle?: string;
  departement?: IDepartement | null;
}

export class Arrondissement implements IArrondissement {
  constructor(public id?: number, public code?: string, public libelle?: string, public departement?: IDepartement | null) {}
}

export function getArrondissementIdentifier(arrondissement: IArrondissement): number | undefined {
  return arrondissement.id;
}
