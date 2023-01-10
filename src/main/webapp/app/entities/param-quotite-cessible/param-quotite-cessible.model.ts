import dayjs from 'dayjs/esm';

export interface IParamQuotiteCessible {
  id?: number;
  code?: string;
  libelle?: string;
  salaireDebut?: number;
  salaireFin?: number;
  tauxTranche?: number;
  dateImpact?: dayjs.Dayjs;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
}

export class ParamQuotiteCessible implements IParamQuotiteCessible {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public salaireDebut?: number,
    public salaireFin?: number,
    public tauxTranche?: number,
    public dateImpact?: dayjs.Dayjs,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null
  ) {}
}

export function getParamQuotiteCessibleIdentifier(paramQuotiteCessible: IParamQuotiteCessible): number | undefined {
  return paramQuotiteCessible.id;
}
