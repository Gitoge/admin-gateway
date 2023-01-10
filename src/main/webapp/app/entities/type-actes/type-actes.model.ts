import dayjs from 'dayjs/esm';
import { ICategorieActes } from 'app/entities/categorie-actes/categorie-actes.model';

export interface ITypeActes {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
  categorieactes?: ICategorieActes | null;
}

export class TypeActes implements ITypeActes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null,
    public categorieactes?: ICategorieActes | null
  ) {}
}

export function getTypeActesIdentifier(typeActes: ITypeActes): number | undefined {
  return typeActes.id;
}
