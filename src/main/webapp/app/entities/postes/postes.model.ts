import dayjs from 'dayjs/esm';

export interface IPostes {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  sens?: number;
  dateEffet?: any | null;
  dateEcheance?: any | null;
  formule?: any | null;
  dansAssiette?: boolean;
  montant?: number | null;
  capital?: number | null;
  cumuleRetenue?: number | null;
  typePosteId?: number;
  typePosteLibelle?: string;
  frequenceId?: number;
  frequenceLibelle?: string;
  categoriePosteId?: number;
  categoriePosteLibelle?: string;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  isChecked?: boolean;
}

export class Postes implements IPostes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public sens?: number,
    public dateEffet?: any | null,
    public dateEcheance?: any | null,
    public formule?: any | null,
    public dansAssiette?: boolean,
    public montant?: number | null,
    public capital?: number | null,
    public cumuleRetenue?: number | null,
    public typePosteId?: number,
    public typePosteLibelle?: string,
    public frequenceId?: number,
    public frequenceLibelle?: string,
    public categoriePosteId?: number,
    public categoriePosteLibelle?: string,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public isChecked?: boolean
  ) {
    // this.sens = this.sens ?? false;
    this.dansAssiette = this.dansAssiette ?? false;
  }
}

export function getPostesIdentifier(postes: IPostes): number | undefined {
  return postes.id;
}
