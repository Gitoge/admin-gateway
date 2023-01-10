import dayjs from 'dayjs/esm';
import { ISituationFamiliale } from 'app/entities/carriere/situation-familiale/situation-familiale.model';
import { ISituationAdministrative } from 'app/entities/carriere/situation-administrative/situation-administrative.model';
import { IAffectation } from 'app/entities/carriere/affectation/affectation.model';
import { IPositionsAgent } from 'app/entities/carriere/positions-agent/positions-agent.model';
import { IEnfant } from 'app/entities/carriere/enfant/enfant.model';
import { INationalite } from 'app/entities/carriere/nationalite/nationalite.model';

export interface IAgent {
  id?: number;
  matricule?: string;
  typePiece?: string;
  numeroPiece?: string;
  prenom?: string;
  nom?: string;
  dateNaissance?: any;
  lieuNaissance?: string;
  sexe?: string;
  nomMari?: string | null;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  femmeMariee?: boolean | null;
  datePriseEnCharge?: dayjs.Dayjs | null;
  dateSortie?: dayjs.Dayjs | null;
  status?: string | null;
  titre?: string | null;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  situationFamiliales?: ISituationFamiliale[] | null;
  situationAdministratives?: ISituationAdministrative[] | null;
  affectations?: IAffectation[] | null;
  positionsAgents?: IPositionsAgent[] | null;
  enfants?: IEnfant[] | null;
  nationalite?: INationalite | null;
}

export class Agent implements IAgent {
  constructor(
    public id?: number,
    public matricule?: string,
    public typePiece?: string,
    public numeroPiece?: string,
    public prenom?: string,
    public nom?: string,
    public dateNaissance?: any,
    public lieuNaissance?: string,
    public sexe?: string,
    public nomMari?: string | null,
    public telephone?: string | null,
    public email?: string | null,
    public adresse?: string | null,
    public femmeMariee?: boolean | null,
    public datePriseEnCharge?: dayjs.Dayjs | null,
    public dateSortie?: dayjs.Dayjs | null,
    public status?: string | null,
    public titre?: string | null,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public situationFamiliales?: ISituationFamiliale[] | null,
    public situationAdministratives?: ISituationAdministrative[] | null,
    public affectations?: IAffectation[] | null,
    public positionsAgents?: IPositionsAgent[] | null,
    public enfants?: IEnfant[] | null,
    public nationalite?: INationalite | null
  ) {
    this.femmeMariee = this.femmeMariee ?? false;
  }
}

export function getAgentIdentifier(agent: IAgent): number | undefined {
  return agent.id;
}
