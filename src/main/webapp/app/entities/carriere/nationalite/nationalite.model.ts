import dayjs from 'dayjs/esm';
import { IAgent } from 'app/entities/carriere/agent/agent.model';

export interface INationalite {
  id?: number;
  code?: string | null;
  libelle?: string;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  agents?: IAgent[] | null;
}

export class Nationalite implements INationalite {
  constructor(
    public id?: number,
    public code?: string | null,
    public libelle?: string,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public agents?: IAgent[] | null
  ) {}
}

export function getNationaliteIdentifier(nationalite: INationalite): number | undefined {
  return nationalite.id;
}
