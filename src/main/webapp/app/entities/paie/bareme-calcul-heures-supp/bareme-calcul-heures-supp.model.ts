import dayjs from 'dayjs/esm';

export interface IBaremeCalculHeuresSupp {
  id?: number;
  indiceDebut?: number;
  indiceFin?: number;
  soldeGlobalDebut?: number;
  soldeGlobalFin?: number;
  heuresOrdinaires?: number;
  dimanchesJoursFeries?: number;
  heuresNuit?: number;
  observation?: string | null;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
}

export class BaremeCalculHeuresSupp implements IBaremeCalculHeuresSupp {
  constructor(
    public id?: number,
    public indiceDebut?: number,
    public indiceFin?: number,
    public soldeGlobalDebut?: number,
    public soldeGlobalFin?: number,
    public heuresOrdinaires?: number,
    public dimanchesJoursFeries?: number,
    public heuresNuit?: number,
    public observation?: string | null,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null
  ) {}
}

export function getBaremeCalculHeuresSuppIdentifier(baremeCalculHeuresSupp: IBaremeCalculHeuresSupp): number | undefined {
  return baremeCalculHeuresSupp.id;
}
