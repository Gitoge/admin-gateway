import { IPostes } from '../postes/postes.model';

export interface IEmplois {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  tauxAt?: number | null;
  primeLieEmploi?: string | null;
  postes?: IPostes[] | null;
}
export class Emplois implements IEmplois {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public tauxAt?: number | null,
    public primeLieEmploi?: string | null,
    public postes?: IPostes[] | null
  ) {}
}
export function getEmploisIdentifier(emplois: IEmplois): number | undefined {
  return emplois.id;
}
