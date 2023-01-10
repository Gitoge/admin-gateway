import dayjs from 'dayjs/esm';

export interface IParamBaremeImposable {
  id?: number;
  code?: string;
  libelle?: string;
  salaireDebut?: number;
  salaireFin?: number;
  tauxTranche?: number | null;
  tauxCumule?: number | null;
  montant?: number | null;
  dateImpact?: dayjs.Dayjs;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
}

export class ParamBaremeImposable implements IParamBaremeImposable {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public salaireDebut?: number,
    public salaireFin?: number,
    public tauxTranche?: number | null,
    public tauxCumule?: number | null,
    public montant?: number | null,
    public dateImpact?: dayjs.Dayjs,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null
  ) {}
}

export function getParamBaremeImposableIdentifier(paramBaremeImposable: IParamBaremeImposable): number | undefined {
  return paramBaremeImposable.id;
}
