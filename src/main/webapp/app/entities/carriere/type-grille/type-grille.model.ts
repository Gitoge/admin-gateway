import { ISituationAdministrative } from 'app/entities/carriere/situation-administrative/situation-administrative.model';

export interface ITypeGrille {
  id?: number;
  code?: string | null;
  libelle?: string | null;
  description?: string | null;
  situationAdministratives?: ISituationAdministrative[] | null;
}

export class TypeGrille implements ITypeGrille {
  constructor(
    public id?: number,
    public code?: string | null,
    public libelle?: string | null,
    public description?: string | null,
    public situationAdministratives?: ISituationAdministrative[] | null
  ) {}
}

export function getTypeGrilleIdentifier(typeGrille: ITypeGrille): number | undefined {
  return typeGrille.id;
}
