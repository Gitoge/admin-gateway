import dayjs from 'dayjs/esm';

export interface IParamBulletins {
  id?: number;
  code?: string;
  libelle?: string;
  entete?: string | null;
  signature?: string | null;
  arrierePlan?: string | null;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
}

export class ParamBulletins implements IParamBulletins {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public entete?: string | null,
    public signature?: string | null,
    public arrierePlan?: string | null,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null
  ) {}
}

export function getParamBulletinsIdentifier(paramBulletins: IParamBulletins): number | undefined {
  return paramBulletins.id;
}
