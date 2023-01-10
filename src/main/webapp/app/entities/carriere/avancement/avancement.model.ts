import { IIndices } from '../indices/indices.model';

export interface IAvancement {
  id?: number;
  gradeId?: number;
  matricule?: string;
  echelonId?: number;
  hierarchieId?: number;
  ancienGradeCode?: string;
  actuelGradeCode?: string;
  ancienEchelonCode?: string;
  actuelEchelonCode?: string;
  ancienHierarchieLibelle?: string;
  ancienHierarchieCode?: string;
  actuelHierarchieCode?: string;
  ancienIndice?: IIndices;
  indice?: IIndices;
}

export class Avancement implements IAvancement {
  constructor(
    public id?: number,
    public gradeId?: number,
    public matricule?: string,
    public echelonId?: number,
    public hierarchieId?: number,
    public ancienGradeCode?: string,
    public actuelGradeCode?: string,
    public actuelEchelonCode?: string,
    public actuelHierarchieCode?: string,
    public ancienEchelonCode?: string,
    public ancienHierarchieLibelle?: string,
    public ancienHierarchieCode?: string,
    public ancienIndice?: IIndices,
    public indice?: IIndices
  ) {}
}

export function getAvancementIdentifier(avancement: IAvancement): number | undefined {
  return avancement.id;
}
