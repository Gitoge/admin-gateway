import { IPeriodePaye } from 'app/entities/paie/periode-paye/periode-paye.model';
import { IPostes } from 'app/entities/postes/postes.model';

export interface ISaisieElementsVariables {
  id?: number;
  codePoste?: string;
  matricule?: string;
  numero?: string;
  reference?: string;
  montant?: number;
  taux?: number;
  dateEffet?: any;
  dateEcheance?: any;
  date?: any;
  periode?: string;
  statut?: boolean;
  agentId?: number;
  etablissementId?: number;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: any | null;
  dateUpdate?: any | null;
  periodePaye?: IPeriodePaye | null;
  postes?: IPostes | null;
  posteId?: number;
  libellePoste?: string;
  destinataire?: string;
  sens?: number;
}

export class SaisieElementsVariables implements ISaisieElementsVariables {
  constructor(
    public id?: number,
    public codePoste?: string,
    public matricule?: string,
    public numero?: string,
    public reference?: string,
    public montant?: number,
    public taux?: number,
    public dateEffet?: any,
    public dateEcheance?: any,
    public date?: any,
    public periode?: string,
    public statut?: boolean,
    public agentId?: number,
    public etablissementId?: number,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: any | null,
    public dateUpdate?: any | null,
    public periodePaye?: IPeriodePaye | null,
    public postes?: IPostes | null,
    public posteId?: number,
    public libellePoste?: string,
    public destinataire?: string,
    public sens?: number
  ) {
    this.statut = this.statut ?? false;
  }
}

export function getSaisieElementsVariablesIdentifier(saisieElementsVariables: ISaisieElementsVariables): number | undefined {
  return saisieElementsVariables.id;
}
