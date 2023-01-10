import dayjs from 'dayjs/esm';
import { IPeriodePaye } from 'app/entities/paie/periode-paye/periode-paye.model';
import { IPostes } from 'app/entities/postes/postes.model';

export interface ISaisieEmoluments {
  id?: number;
  codePoste?: string;
  matricule?: string;
  reference?: string;
  montant?: number;
  taux?: number;
  dateEffet?: any;
  dateEcheance?: any;
  statut?: boolean;
  agentId?: number;
  etablissementId?: number;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  periodePaye?: IPeriodePaye | null;
  posteId?: number | null;
  postes?: IPostes | null;
}

export class SaisieEmoluments implements ISaisieEmoluments {
  constructor(
    public id?: number,
    public codePoste?: string,
    public matricule?: string,
    public reference?: string,
    public montant?: number,
    public taux?: number,
    public dateEffet?: any,
    public dateEcheance?: any,
    public statut?: boolean,
    public agentId?: number,
    public etablissementId?: number,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public periodePaye?: IPeriodePaye | null,
    public posteId?: number | null,
    public postes?: IPostes | null
  ) {
    this.statut = this.statut ?? false;
  }
}

export function getSaisieEmolumentsIdentifier(saisieEmoluments: ISaisieEmoluments): number | undefined {
  return saisieEmoluments.id;
}
