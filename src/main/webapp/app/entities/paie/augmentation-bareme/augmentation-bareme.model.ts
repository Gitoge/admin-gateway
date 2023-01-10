import dayjs from 'dayjs/esm';
import { IPostes } from '../postes/postes.model';

export interface IAugmentationBareme {
  id?: number;
  codePoste?: string;
  libelle?: string;
  montant?: number;
  borneInf?: number;
  borneSup?: number;
  posteId?: number;
  postes?: IPostes;
  dateInsert?: dayjs.Dayjs | null;
  dateUpdate?: dayjs.Dayjs | null;
  userInsertId?: number | null;
  userUpdateId?: number | null;
}

export class AugmentationBareme implements IAugmentationBareme {
  constructor(
    public id?: number,
    public codePoste?: string,
    public libelle?: string,
    public montant?: number,
    public borneInf?: number,
    public borneSup?: number,
    public posteId?: number,
    public postes?: IPostes,
    public dateInsert?: dayjs.Dayjs | null,
    public dateUpdate?: dayjs.Dayjs | null,
    public userInsertId?: number | null,
    public userUpdateId?: number | null
  ) {}
}

export function getAugmentationBaremeIdentifier(augmentationBareme: IAugmentationBareme): number | undefined {
  return augmentationBareme.id;
}
