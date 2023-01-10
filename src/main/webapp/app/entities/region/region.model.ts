import { IDepartement } from 'app/entities/departement/departement.model';

export interface IRegion {
  id?: number;
  code?: string;
  libelle?: string;
  departements?: IDepartement[] | null;
}

export class Region implements IRegion {
  constructor(public id?: number, public code?: string, public libelle?: string, public departements?: IDepartement[] | null) {}
}

export function getRegionIdentifier(region: IRegion): number | undefined {
  return region.id;
}
