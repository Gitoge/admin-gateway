import dayjs from 'dayjs/esm';

export interface IHistoAugmentation {
  id?: number;
  codePoste?: string;
  libelle?: string;
  type?: string;
  date?: dayjs.Dayjs;
  categorie?: string;
  hierarchie?: string;
  plafond?: number | null;
  montant?: number | null;
  taux?: number | null;
  valeur?: number | null;
}
export class HistoAugmentation implements IHistoAugmentation {
  constructor(
    public id?: number,
    public codePoste?: string,
    public libelle?: string,
    public type?: string,
    public date?: dayjs.Dayjs,
    public categorie?: string,
    public hierarchie?: string,
    public plafond?: number | null,
    public montant?: number | null,
    public taux?: number | null,
    public valeur?: number | null
  ) {}
}

export function getHistoAugmentationIdentifier(histoAugmentation: IHistoAugmentation): number | undefined {
  return histoAugmentation.id;
}
