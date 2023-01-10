import dayjs from 'dayjs/esm';
import { ITypeActes } from 'app/entities/type-actes/type-actes.model';

export interface ICategorieActes {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
  typeactes?: ITypeActes[] | null;
}

export class CategorieActes implements ICategorieActes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null,
    public typeactes?: ITypeActes[] | null
  ) {}
}

export function getCategorieActesIdentifier(categorieActes: ICategorieActes): number | undefined {
  return categorieActes.id;
}
