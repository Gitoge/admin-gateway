import dayjs from 'dayjs/esm';
//import { IPostes } from 'app/entities/paie/postes/postes.model';
import { IPostes } from 'app/entities/postes/postes.model';

export interface IEmoluments {
  id?: number;
  codePoste?: string;
  matricule?: string;
  reference?: string;
  montant?: number;
  taux?: number;
  dateEffet?: any;
  dateEcheance?: any;
  agentId?: number;
  etablissementId?: number;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  postes?: IPostes | null;
}

export class Emoluments implements IEmoluments {
  constructor(
    public id?: number,
    public codePoste?: string,
    public matricule?: string,
    public reference?: string,
    public montant?: number,
    public taux?: number,
    public dateEffet?: any,
    public dateEcheance?: any,
    public agentId?: number,
    public etablissementId?: number,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public postes?: IPostes | null
  ) {}
}

export function getEmolumentsIdentifier(emoluments: IEmoluments): number | undefined {
  return emoluments.id;
}
