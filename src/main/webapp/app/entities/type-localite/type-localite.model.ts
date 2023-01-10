import { ILocalite } from 'app/entities/localite/localite.model';

export interface ITypeLocalite {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  localites?: ILocalite[] | null;
}

export class TypeLocalite implements ITypeLocalite {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public localites?: ILocalite[] | null
  ) {}
}

export function getTypeLocaliteIdentifier(typeLocalite: ITypeLocalite): number | undefined {
  return typeLocalite.id;
}
