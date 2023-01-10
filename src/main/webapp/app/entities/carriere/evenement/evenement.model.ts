import { ITypeActes } from '../type-actes/type-actes.model';

export interface IEvenement {
  id?: number;
  code?: string;
  libelle?: string | null;
  description?: string | null;
  typeActes?: ITypeActes[] | null;
}

export class Evenement implements IEvenement {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string | null,
    public description?: string | null,
    public typeActes?: ITypeActes[] | null
  ) {}
}

export function getEvenementIdentifier(evenement: IEvenement): number | undefined {
  return evenement.id;
}
