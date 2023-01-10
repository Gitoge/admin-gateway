import { IRegion } from 'app/entities/region/region.model';
import { IArrondissement } from 'app/entities/arrondissement/arrondissement.model';

export interface IDepartement {
  id?: number;
  code?: string;
  libelle?: string;
  region?: IRegion | null;
  arrondissements?: IArrondissement[] | null;
}

export class Departement implements IDepartement {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public region?: IRegion | null,
    public arrondissements?: IArrondissement[] | null
  ) {}
}

export function getDepartementIdentifier(departement: IDepartement): number | undefined {
  return departement.id;
}
