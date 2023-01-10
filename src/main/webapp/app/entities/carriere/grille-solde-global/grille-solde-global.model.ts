export interface IGrilleSoldeGlobal {
  id?: number;
  soldeGlobal?: number | null;
  anciennete?: number | null;
  corpsId?: number | null;
  hierarchieId?: number | null;
  cadreId?: number | null;
  gradeId?: number | null;
  echelonId?: number | null;
  classeId?: number | null;
  libelleHierarchie?: string | null;
  codeGrade?: string | null;
  libelleClasse?: string | null;
  libelleEchelon?: string | null;
}

export class GrilleSoldeGlobal implements IGrilleSoldeGlobal {
  constructor(
    public id?: number,
    public soldeGlobal?: number | null,
    public anciennete?: number | null,
    public corpsId?: number | null,
    public hierarchieId?: number | null,
    public cadreId?: number | null,
    public gradeId?: number | null,
    public echelonId?: number | null,
    public classeId?: number | null,
    public libelleHierarchie?: string | null,
    public codeGrade?: string | null,
    public libelleClasse?: string | null,
    public libelleEchelon?: string | null
  ) {}
}

export function getGrilleSoldeGlobalIdentifier(grilleSoldeGlobal: IGrilleSoldeGlobal): number | undefined {
  return grilleSoldeGlobal.id;
}
