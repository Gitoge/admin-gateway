import dayjs from 'dayjs/esm';

export interface IConvention {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  isChecked?: boolean;
}

export class Convention implements IConvention {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public isChecked?: boolean
  ) {}
}

export function getConventionIdentifier(convention: IConvention): number | undefined {
  return convention.id;
}
