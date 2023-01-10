import dayjs from 'dayjs/esm';
import { IActes } from 'app/entities/carriere/actes/actes.model';

export interface INatureActes {
  id?: number;
  code?: string;
  libelle?: string;
  userInsertId?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
  actes?: IActes[] | null;
}

export class NatureActes implements INatureActes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public userInsertId?: number | null,
    public userdateInsert?: dayjs.Dayjs | null,
    public actes?: IActes[] | null
  ) {}
}

export function getNatureActesIdentifier(natureActes: INatureActes): number | undefined {
  return natureActes.id;
}
