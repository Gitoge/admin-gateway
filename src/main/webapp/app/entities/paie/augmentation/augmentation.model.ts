import dayjs from 'dayjs/esm';
import { IPostes } from '../postes/postes.model';
import { IHistoAugmentation } from '../histo-augmentation/histo-augmentation.model';

export interface IAugmentation {
  id?: number;
  codePoste?: string;
  libellePoste?: string;
  montant?: number;
  reference?: string | null;
  posteId?: number;
  postes?: IPostes;
  userInsertId?: number | null;
  userUpdateId?: number | null;
  dateInsertId?: dayjs.Dayjs | null;
  dateUpdateId?: dayjs.Dayjs | null;
  histoAugmentation?: IHistoAugmentation;
}

export class Augmentation implements IAugmentation {
  constructor(
    public id?: number,
    public codePoste?: string,
    public libellePoste?: string,
    public montant?: number,
    public reference?: string | null,
    public posteId?: number,
    public postes?: IPostes,
    public userInsertId?: number | null,
    public userUpdateId?: number | null,
    public dateInsertId?: dayjs.Dayjs | null,
    public dateUpdateId?: dayjs.Dayjs | null,
    public histoAugmentation?: IHistoAugmentation
  ) {}
}

export function getAugmentationIdentifier(augmentation: IAugmentation): number | undefined {
  return augmentation.id;
}
