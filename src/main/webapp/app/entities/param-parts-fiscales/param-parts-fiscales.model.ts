import dayjs from 'dayjs/esm';

export interface IParamPartsFiscales {
  id?: number;
  code?: string;
  libelle?: string;
  composition?: string;
  nombreParts?: number;
  description?: string | null;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
}

export class ParamPartsFiscales implements IParamPartsFiscales {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public composition?: string,
    public nombreParts?: number,
    public description?: string | null,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null
  ) {}
}

export function getParamPartsFiscalesIdentifier(paramPartsFiscales: IParamPartsFiscales): number | undefined {
  return paramPartsFiscales.id;
}
