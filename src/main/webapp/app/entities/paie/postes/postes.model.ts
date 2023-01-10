import dayjs from 'dayjs/esm';
import { ISaisieEmoluments } from 'app/entities/paie/saisie-emoluments/saisie-emoluments.model';
import { ISaisieElementsVariables } from 'app/entities/paie/saisie-elements-variables/saisie-elements-variables.model';
import { IEmoluments } from 'app/entities/paie/emoluments/emoluments.model';
import { IElementsVariables } from 'app/entities/paie/elements-variables/elements-variables.model';

export interface IPostes {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  sens?: number;
  dateEffet?: dayjs.Dayjs | null;
  dateEcheance?: dayjs.Dayjs | null;
  formule?: dayjs.Dayjs | null;
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
  saisieEmoluments?: ISaisieEmoluments[] | null;
  saisieElementsVariables?: ISaisieElementsVariables[] | null;
  emoluments?: IEmoluments[] | null;
  elementsVariables?: IElementsVariables[] | null;
}

export class Postes implements IPostes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public sens?: number,
    public dateEffet?: dayjs.Dayjs | null,
    public dateEcheance?: dayjs.Dayjs | null,
    public formule?: dayjs.Dayjs | null,
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
    public saisieEmoluments?: ISaisieEmoluments[] | null,
    public saisieElementsVariables?: ISaisieElementsVariables[] | null,
    public emoluments?: IEmoluments[] | null,
    public elementsVariables?: IElementsVariables[] | null
  ) {
    //  this.sens = this.sens ?? false;
    this.dansAssiette = this.dansAssiette ?? false;
  }
}

export function getPostesIdentifier(postes: IPostes): number | undefined {
  return postes.id;
}
