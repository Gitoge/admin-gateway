import dayjs from 'dayjs/esm';
//import { IPostes } from 'app/entities/paie/postes/postes.model';
import { IPostes } from 'app/entities/postes/postes.model';

export interface IElementsVariables {
  id?: number;
  codePoste?: string;
  matricule?: string;
  reference?: string;
  montant?: number;
  taux?: number;
  dateDebut?: dayjs.Dayjs;
  dateEcheance?: dayjs.Dayjs;
  periode?: string;
  statut?: boolean;
  agentId?: number;
  etablissementId?: number;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  postes?: IPostes | null;
}

export class ElementsVariables implements IElementsVariables {
  constructor(
    public id?: number,
    public codePoste?: string,
    public matricule?: string,
    public reference?: string,
    public montant?: number,
    public taux?: number,
    public dateDebut?: dayjs.Dayjs,
    public dateEcheance?: dayjs.Dayjs,
    public periode?: string,
    public statut?: boolean,
    public agentId?: number,
    public etablissementId?: number,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public postes?: IPostes | null
  ) {
    this.statut = this.statut ?? false;
  }
}

export function getElementsVariablesIdentifier(elementsVariables: IElementsVariables): number | undefined {
  return elementsVariables.id;
}
