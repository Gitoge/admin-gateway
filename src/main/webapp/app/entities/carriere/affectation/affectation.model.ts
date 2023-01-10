import dayjs from 'dayjs/esm';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { IAgent } from 'app/entities/carriere/agent/agent.model';

export interface IAffectation {
  id?: number;
  motif?: string | null;
  dateAffectation?: dayjs.Dayjs | null;
  dateEffet?: dayjs.Dayjs | null;
  datefin?: dayjs.Dayjs | null;
  status?: string | null;
  servicesId?: number | null;
  emploisId?: number | null;
  userInsertId?: number | null;
  actes?: IActes | null;
  agent?: IAgent | null;
}

export class Affectation implements IAffectation {
  constructor(
    public id?: number,
    public motif?: string | null,
    public dateAffectation?: dayjs.Dayjs | null,
    public dateEffet?: dayjs.Dayjs | null,
    public datefin?: dayjs.Dayjs | null,
    public status?: string | null,
    public servicesId?: number | null,
    public emploisId?: number | null,
    public userInsertId?: number | null,
    public actes?: IActes | null,
    public agent?: IAgent | null
  ) {}
}

export function getAffectationIdentifier(affectation: IAffectation): number | undefined {
  return affectation.id;
}
