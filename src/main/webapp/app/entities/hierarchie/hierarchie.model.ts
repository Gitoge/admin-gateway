import { IPostes } from 'app/entities/postes/postes.model';

export interface IHierarchie {
  id?: number;
  code?: string;
  libelle?: string;
  borneInferieure?: string;
  borneSuperieure?: string;
  codEchelonIndiciare?: string | null;
  hcadre?: string | null;
  postes?: IPostes[] | null;
}

export class Hierarchie implements IHierarchie {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public borneInferieure?: string,
    public borneSuperieure?: string,
    public codEchelonIndiciare?: string | null,
    public hcadre?: string | null,
    public postes?: IPostes[] | null
  ) {}
}

export function getHierarchieIdentifier(hierarchie: IHierarchie): number | undefined {
  return hierarchie.id;
}
