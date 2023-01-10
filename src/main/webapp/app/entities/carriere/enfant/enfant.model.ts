import dayjs from 'dayjs/esm';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { IDocumentAdministratif } from '../document-administratif/document-administratif.model';

export interface IEnfant {
  id?: number;
  matriculeParent?: string;
  nom?: string;
  prenom?: string;
  sexe?: string;
  lienParente?: string;
  nin?: number | null;
  dateNaissance?: any;
  lieuNaissance?: string;
  numeroActeNaissance?: string | null;
  dateActeNaissance?: dayjs.Dayjs | null;
  rangEnfant?: number | null;
  // codeAge?: number | null;
  enfantEnVie?: boolean | null;
  salarie?: boolean | null;
  enfantImposable?: boolean | null;
  userInsertId?: number | null;
  agent?: IAgent | null;
  documents?: IDocumentAdministratif[] | null;
}

export class Enfant implements IEnfant {
  constructor(
    public id?: number,
    public matriculeParent?: string,
    public nom?: string,
    public prenom?: string,
    public sexe?: string,
    public lienParente?: string,
    public nin?: number | null,
    public dateNaissance?: any,
    public lieuNaissance?: string,
    public numeroActeNaissance?: string | null,
    public dateActeNaissance?: dayjs.Dayjs | null,
    public rangEnfant?: number | null,
    // public codeAge?: number | null,
    public enfantEnVie?: boolean | null,
    public salarie?: boolean | null,
    public enfantImposable?: boolean | null,
    public userInsertId?: number | null,
    public agent?: IAgent | null,
    public documents?: IDocumentAdministratif[] | null
  ) {
    this.enfantEnVie = this.enfantEnVie ?? false;
    this.enfantImposable = this.enfantImposable ?? false;
  }
}

export function getEnfantIdentifier(enfant: IEnfant): number | undefined {
  return enfant.id;
}
