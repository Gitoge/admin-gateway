import dayjs from 'dayjs/esm';
import { IPositionsAgent } from 'app/entities/carriere/positions-agent/positions-agent.model';
import { ISituationAdministrative } from 'app/entities/carriere/situation-administrative/situation-administrative.model';
import { ISituationFamiliale } from 'app/entities/carriere/situation-familiale/situation-familiale.model';
import { IAffectation } from 'app/entities/carriere/affectation/affectation.model';
import { INatureActes } from 'app/entities/carriere/nature-actes/nature-actes.model';
import { ITypeActes } from 'app/entities/carriere/type-actes/type-actes.model';

export interface IActes {
  id?: number;
  numeroActe?: number;
  dateActe?: dayjs.Dayjs | null;
  dateEffet?: dayjs.Dayjs | null;
  origineId?: number | null;
  userInsertId?: number | null;
  positionsAgent?: IPositionsAgent | null;
  situationAdministrative?: ISituationAdministrative | null;
  situationFamiliale?: ISituationFamiliale | null;
  affectation?: IAffectation | null;
  natureActes?: INatureActes | null;
  typeActes?: ITypeActes | null;
}

export class Actes implements IActes {
  constructor(
    public id?: number,
    public numeroActe?: number,
    public dateActe?: dayjs.Dayjs | null,
    public dateEffet?: dayjs.Dayjs | null,
    public origineId?: number | null,
    public userInsertId?: number | null,
    public positionsAgent?: IPositionsAgent | null,
    public situationAdministrative?: ISituationAdministrative | null,
    public situationFamiliale?: ISituationFamiliale | null,
    public affectation?: IAffectation | null,
    public natureActes?: INatureActes | null,
    public typeActes?: ITypeActes | null
  ) {}
}

export function getActesIdentifier(actes: IActes): number | undefined {
  return actes.id;
}
