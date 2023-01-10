import { IReglement } from 'app/entities/reglement/reglement.model';

export interface ITypeReglement {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  reglements?: IReglement[] | null;
}

export class TypeReglement implements ITypeReglement {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public reglements?: IReglement[] | null
  ) {}
}

export function getTypeReglementIdentifier(typeReglement: ITypeReglement): number | undefined {
  return typeReglement.id;
}
