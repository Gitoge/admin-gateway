import dayjs from 'dayjs/esm';
import { IPostes } from 'app/entities/postes/postes.model';

export interface IAssiettes {
  id?: number;
  code?: string;
  libelle?: string;
  operateur?: string;
  description?: string | null;
  userIdInsert?: number | null;
  userdateInsert?: dayjs.Dayjs | null;
  postes?: IPostes[] | null;
}

export class Assiettes implements IAssiettes {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public operateur?: string,
    public description?: string | null,
    public userIdInsert?: number | null,
    public userdateInsert?: dayjs.Dayjs | null,
    public postes?: IPostes[] | null
  ) {}
}

export function getAssiettesIdentifier(assiettes: IAssiettes): number | undefined {
  return assiettes.id;
}
