import dayjs from 'dayjs/esm';
import { IPositions } from 'app/entities/positions/positions.model';

export interface ITypePosition {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
  positions?: IPositions[] | null;
}

export class TypePosition implements ITypePosition {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null,
    public positions?: IPositions[] | null
  ) {}
}

export function getTypePositionIdentifier(typePosition: ITypePosition): number | undefined {
  return typePosition.id;
}
