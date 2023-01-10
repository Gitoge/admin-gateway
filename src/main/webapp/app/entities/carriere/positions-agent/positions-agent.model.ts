import dayjs from 'dayjs/esm';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { ICategorieAgent } from 'app/entities/carriere/categorie-agent/categorie-agent.model';

export interface IPositionsAgent {
  id?: number;
  motif?: string | null;
  datePosition?: dayjs.Dayjs | null;
  dateAnnulation?: dayjs.Dayjs | null;
  dateFinAbsence?: dayjs.Dayjs | null;
  status?: string | null;
  posistionsId?: number | null;
  userInsertId?: number | null;
  actes?: IActes | null;
  agent?: IAgent | null;
  categorieAgent?: ICategorieAgent | null;
}

export class PositionsAgent implements IPositionsAgent {
  constructor(
    public id?: number,
    public motif?: string | null,
    public datePosition?: dayjs.Dayjs | null,
    public dateAnnulation?: dayjs.Dayjs | null,
    public dateFinAbsence?: dayjs.Dayjs | null,
    public status?: string | null,
    public posistionsId?: number | null,
    public userInsertId?: number | null,
    public actes?: IActes | null,
    public agent?: IAgent | null,
    public categorieAgent?: ICategorieAgent | null
  ) {}
}

export function getPositionsAgentIdentifier(positionsAgent: IPositionsAgent): number | undefined {
  return positionsAgent.id;
}
