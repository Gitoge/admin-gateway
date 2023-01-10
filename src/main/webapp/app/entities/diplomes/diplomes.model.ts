import dayjs from 'dayjs/esm';

export interface IDiplomes {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
}

export class Diplomes implements IDiplomes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null
  ) {}
}

export function getDiplomesIdentifier(diplomes: IDiplomes): number | undefined {
  return diplomes.id;
}
