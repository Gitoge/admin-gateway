import dayjs from 'dayjs/esm';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { IAgent } from 'app/entities/carriere/agent/agent.model';

export interface ISituationFamiliale {
  id?: number;
  situationMatrimoniale?: string;
  nombreEpouse?: number | null;
  codeTravailConjoint?: number | null;
  nombreEnfant?: number | null;
  nombrePart?: number | null;
  nombreEnfantImposable?: number | null;
  nombreEnfantMajeur?: number | null;
  nombreMinimumFiscal?: number | null;
  nombreEnfantDecede?: number | null;
  dateModification?: dayjs.Dayjs | null;
  conjointSalarie?: boolean | null;
  status?: string | null;
  userInsertId?: number | null;
  actes?: IActes | null;
  agent?: IAgent | null;
}

export class SituationFamiliale implements ISituationFamiliale {
  constructor(
    public id?: number,
    public situationMatrimoniale?: string,
    public nombreEpouse?: number | null,
    public codeTravailConjoint?: number | null,
    public nombreEnfant?: number | null,
    public nombrePart?: number | null,
    public nombreEnfantImposable?: number | null,
    public nombreEnfantMajeur?: number | null,
    public nombreMinimumFiscal?: number | null,
    public nombreEnfantDecede?: number | null,
    public dateModification?: dayjs.Dayjs | null,
    public status?: string | null,
    public userInsertId?: number | null,
    public actes?: IActes | null,
    public agent?: IAgent | null,
    public conjointSalarie?: true | null
  ) {}
}

export function getSituationFamilialeIdentifier(situationFamiliale: ISituationFamiliale): number | undefined {
  return situationFamiliale.id;
}
