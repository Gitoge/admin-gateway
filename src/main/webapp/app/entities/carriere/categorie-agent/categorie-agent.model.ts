import dayjs from 'dayjs/esm';
import { ISituationAdministrative } from 'app/entities/carriere/situation-administrative/situation-administrative.model';
import { IPositionsAgent } from 'app/entities/carriere/positions-agent/positions-agent.model';

export interface ICategorieAgent {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  situationAdministratives?: ISituationAdministrative[] | null;
  positionsAgents?: IPositionsAgent[] | null;
}

export class CategorieAgent implements ICategorieAgent {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public situationAdministratives?: ISituationAdministrative[] | null,
    public positionsAgents?: IPositionsAgent[] | null
  ) {}
}

export function getCategorieAgentIdentifier(categorieAgent: ICategorieAgent): number | undefined {
  return categorieAgent.id;
}
