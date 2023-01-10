import dayjs from 'dayjs/esm';

export interface IFichePaie {
  id?: number;
  codePoste?: string;
  libellePoste?: string;
  matricule?: string;
  montantGain?: number;
  montantRetenue?: number;
  partContributive?: number;
  dateCalcul?: dayjs.Dayjs;
  dateAnnulationCalcul?: dayjs.Dayjs | null;
  annulationCalcul?: boolean | null;
  agentId?: number;
  posteId?: number;
  etablissementId?: number;
  sommeGain?: number;
  sommeRetenue?: number;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
}

export class FichePaie implements IFichePaie {
  constructor(
    public id?: number,
    public codePoste?: string,
    public libellePoste?: string,
    public matricule?: string,
    public montantGain?: number,
    public montantRetenue?: number,
    public partContributive?: number,
    public dateCalcul?: dayjs.Dayjs,
    public dateAnnulationCalcul?: dayjs.Dayjs | null,
    public annulationCalcul?: boolean | null,
    public agentId?: number,
    public posteId?: number,
    public etablissementId?: number,
    public sommeGain?: number,
    public sommeRetenue?: number,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null
  ) {
    this.annulationCalcul = this.annulationCalcul ?? false;
  }
}

export function getFichePaieIdentifier(fichePaie: IFichePaie): number | undefined {
  return fichePaie.id;
}
