import dayjs from 'dayjs/esm';

export interface IParamMatricules {
  id?: number;
  numeroMatricule?: string;
  datePriseEnCompte?: dayjs.Dayjs;
  etat?: string | null;
  pecId?: number | null;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
}

export class ParamMatricules implements IParamMatricules {
  constructor(
    public id?: number,
    public numeroMatricule?: string,
    public datePriseEnCompte?: dayjs.Dayjs,
    public etat?: string | null,
    public pecId?: number | null,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null
  ) {}
}

export function getParamMatriculesIdentifier(paramMatricules: IParamMatricules): number | undefined {
  return paramMatricules.id;
}
