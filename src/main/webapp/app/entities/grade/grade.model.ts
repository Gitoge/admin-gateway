import { IPostes } from 'app/entities/postes/postes.model';

export interface IGrade {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  ancEchClasse?: string;
  nbreEchelon?: number;
  postes?: IPostes[] | null;
}

export class Grade implements IGrade {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public ancEchClasse?: string,
    public nbreEchelon?: number,
    public postes?: IPostes[] | null
  ) {}
}

export function getGradeIdentifier(grade: IGrade): number | undefined {
  return grade.id;
}
