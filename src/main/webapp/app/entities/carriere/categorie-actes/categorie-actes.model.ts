import dayjs from 'dayjs/esm';
import { ITypeActes } from 'app/entities/carriere/type-actes/type-actes.model';

export interface ICategorieActes {
  id?: number;
  code?: string;
  libelle?: string;
  userInsertId?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
  typeActes?: ITypeActes[] | null;
}

export class CategorieActes implements ICategorieActes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public userInsertId?: number | null,
    public userdateInsert?: dayjs.Dayjs | null,
    public typeActes?: ITypeActes[] | null
  ) {}
}

export function getCategorieActesIdentifier(categorieActes: ICategorieActes): number | undefined {
  return categorieActes.id;
}
