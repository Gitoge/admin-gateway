import dayjs from 'dayjs/esm';
import { IEnfant } from 'app/entities/carriere/enfant/enfant.model';
import { INationalite } from 'app/entities/carriere/nationalite/nationalite.model';

export interface IInfosAgentPdf {
  matricule?: string;
  typePiece?: string;
  numeroPiece?: string;
  prenom?: string;
  nom?: string;
  dateNaissance?: dayjs.Dayjs;
  lieuNaissance?: string;
  sexe?: string;
  nomMari?: string | null;
  telephone?: string | null;
  email?: string | null;
  adresse?: string | null;
  femmeMariee?: boolean | null;
  datePriseEnCharge?: dayjs.Dayjs | null;
  dateSortie?: dayjs.Dayjs | null;
  titre?: string | null;
  nationalite?: INationalite | null;
}

export class InfosAgentPdf implements IInfosAgentPdf {
  constructor(
    public matricule?: string,
    public typePiece?: string,
    public numeroPiece?: string,
    public prenom?: string,
    public nom?: string,
    public dateNaissance?: dayjs.Dayjs,
    public lieuNaissance?: string,
    public sexe?: string,
    public nomMari?: string | null,
    public telephone?: string | null,
    public email?: string | null,
    public adresse?: string | null,
    public femmeMariee?: boolean | null,
    public datePriseEnCharge?: dayjs.Dayjs | null,
    public dateSortie?: dayjs.Dayjs | null,
    public titre?: string | null,
    public enfants?: IEnfant[] | null,
    public nationalite?: INationalite | null
  ) {
    this.femmeMariee = this.femmeMariee ?? false;
  }
}
