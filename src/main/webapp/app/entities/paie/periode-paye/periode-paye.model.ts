import { ISaisieEmoluments } from 'app/entities/paie/saisie-emoluments/saisie-emoluments.model';
import { ISaisieElementsVariables } from 'app/entities/paie/saisie-elements-variables/saisie-elements-variables.model';
import { IExercice } from 'app/entities/paie/exercice/exercice.model';

export interface IPeriodePaye {
  id?: number;
  libelle?: string;
  dateDebut?: any;
  dateFin?: any;
  dateDebutSaisie?: any;
  dateFinSaisie?: any;
  dateDebutCalculSal?: any;
  dateFinCalculSal?: any;
  statut?: string | null;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: any | null;
  dateUpdate?: any | null;
  saisieEmoluments?: ISaisieEmoluments[] | null;
  saisieElementsVariables?: ISaisieElementsVariables[] | null;
  exercice?: IExercice | null;
}

export class PeriodePaye implements IPeriodePaye {
  constructor(
    public id?: number,
    public libelle?: string,
    public dateDebut?: any,
    public dateFin?: any,
    public dateDebutSaisie?: any,
    public dateFinSaisie?: any,
    public dateDebutCalculSal?: any,
    public dateFinCalculSal?: any,
    public statut?: string | null,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: any | null,
    public dateUpdate?: any | null,
    public saisieEmoluments?: ISaisieEmoluments[] | null,
    public saisieElementsVariables?: ISaisieElementsVariables[] | null,
    public exercice?: IExercice | null
  ) {}
}

export function getPeriodePayeIdentifier(periodePaye: IPeriodePaye): number | undefined {
  return periodePaye.id;
}
