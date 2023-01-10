import dayjs from 'dayjs/esm';

export interface IParamBaremeMinimumFiscal {
  id?: number;
  code?: string;
  libelle?: string;
  montantPlafond?: number;
  montantAPrelever?: number;
  dateImpact?: dayjs.Dayjs;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
}

export class ParamBaremeMinimumFiscal implements IParamBaremeMinimumFiscal {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public montantPlafond?: number,
    public montantAPrelever?: number,
    public dateImpact?: dayjs.Dayjs,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null
  ) {}
}

export function getParamBaremeMinimumFiscalIdentifier(paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal): number | undefined {
  return paramBaremeMinimumFiscal.id;
}
