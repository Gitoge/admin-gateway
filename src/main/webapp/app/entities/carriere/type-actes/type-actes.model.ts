import dayjs from 'dayjs/esm';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { ICategorieActes } from 'app/entities/carriere/categorie-actes/categorie-actes.model';

export interface ITypeActes {
  id?: number;
  code?: string;
  libelle?: string;
  userInsertId?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
  actes?: IActes[] | null;
  categorieActes?: ICategorieActes | null;
  isChecked?: boolean;
}

export class TypeActes implements ITypeActes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public userInsertId?: number | null,
    public userdateInsert?: dayjs.Dayjs | null,
    public actes?: IActes[] | null,
    public categorieActes?: ICategorieActes | null,
    public isChecked?: boolean
  ) {}
}

export function getTypeActesIdentifier(typeActes: ITypeActes): number | undefined {
  return typeActes.id;
}
