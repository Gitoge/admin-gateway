import { IIndices } from 'app/entities/carriere/indices/indices.model';

export interface IGrilleIndiciaire {
  id?: number;
  salaireDeBase?: number | null;
  borneInferieure?: number | null;
  borneSuperieure?: number | null;
  anciennete?: number | null;
  corpsId?: number | null;
  hierarchieId?: number | null;
  cadreId?: number | null;
  gradeId?: number | null;
  echelonId?: number | null;
  classeId?: number | null;
  libelleHierarchie?: string | null;
  libelleEchelon?: string | null;
  codeGrade?: string | null;
  indices?: IIndices | null;
}

export class GrilleIndiciaire implements IGrilleIndiciaire {
  constructor(
    public id?: number,
    public salaireBase?: number | null,
    public borneInferieure?: number | null,
    public borneSuperieure?: number | null,
    public anciennete?: number | null,
    public corpsId?: number | null,
    public hierarchieId?: number | null,
    public cadreId?: number | null,
    public gradeId?: number | null,
    public echelonId?: number | null,
    public classeId?: number | null,
    public libelleHierarchie?: string | null,
    public libelleEchelon?: string | null,
    public codeGrade?: string | null,
    public indices?: IIndices | null
  ) {}
}

export function getGrilleIndiciaireIdentifier(grilleIndiciaire: IGrilleIndiciaire): number | undefined {
  return grilleIndiciaire.id;
}
