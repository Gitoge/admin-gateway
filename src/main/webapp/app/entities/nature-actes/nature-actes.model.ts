import dayjs from 'dayjs/esm';

export interface INatureActes {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
}

export class NatureActes implements INatureActes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null
  ) {}
}

export function getNatureActesIdentifier(natureActes: INatureActes): number | undefined {
  return natureActes.id;
}
