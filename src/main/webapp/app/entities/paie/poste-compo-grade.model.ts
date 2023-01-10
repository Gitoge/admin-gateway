import dayjs from 'dayjs/esm';

export interface IPosteCompoGrade {
  id?: number;
  dateInsert?: dayjs.Dayjs | null;
  operateur?: string | null;
  posteComposant?: string | null;
  posteCompose?: string | null;
  userInsertId?: number | null;
  valeur?: number | null;
}

export class PosteCompoGrade implements IPosteCompoGrade {
  constructor(
    public id?: number,
    public dateInsert?: dayjs.Dayjs | null,
    public operateur?: string | null,
    public posteComposant?: string | null,
    public posteCompose?: string | null,
    public userInsertId?: number | null,
    public valeur?: number | null
  ) {}
}

export function getPosteCompoGradeIdentifier(posteCompoGrade: IPosteCompoGrade): number | undefined {
  return posteCompoGrade.id;
}
