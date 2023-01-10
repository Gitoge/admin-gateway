import { IGrade } from '../../grade/grade.model';
import { IPostes } from '../../postes/postes.model';

export interface IPosteGrade {
  id?: number;
  codeGrade?: string;
  codePoste?: string;
  grade?: IGrade;
  postes?: IPostes;
}

export class PosteGrade implements IPosteGrade {
  constructor(public id?: number, public codeGrade?: string, public codePoste?: string, public postes?: IPostes, public grade?: IGrade) {}
}

export function getPosteGradeIdentifier(posteGrade: IPosteGrade): number | undefined {
  return posteGrade.id;
}
