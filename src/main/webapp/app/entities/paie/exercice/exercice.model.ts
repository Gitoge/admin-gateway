import dayjs from 'dayjs/esm';
import { IPeriodePaye } from 'app/entities/paie/periode-paye/periode-paye.model';

export interface IExercice {
  id?: number;
  libelle?: string;
  dateDebut?: dayjs.Dayjs;
  dateFin?: dayjs.Dayjs;
  dateOuverture?: dayjs.Dayjs;
  dateFermeture?: dayjs.Dayjs;
  statut?: string;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  periodePayes?: IPeriodePaye[] | null;
}

export class Exercice implements IExercice {
  constructor(
    public id?: number,
    public libelle?: string,
    public dateDebut?: dayjs.Dayjs,
    public dateFin?: dayjs.Dayjs,
    public dateOuverture?: dayjs.Dayjs,
    public dateFermeture?: dayjs.Dayjs,
    public statut?: string,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public periodePayes?: IPeriodePaye[] | null
  ) {}
}

export function getExerciceIdentifier(exercice: IExercice): number | undefined {
  return exercice.id;
}
