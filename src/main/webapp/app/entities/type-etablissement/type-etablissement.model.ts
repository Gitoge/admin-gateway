import { IEtablissement } from 'app/entities/etablissement/etablissement.model';

export interface ITypeEtablissement {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  etabs?: IEtablissement[] | null;
}

export class TypeEtablissement implements ITypeEtablissement {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public etabs?: IEtablissement[] | null
  ) {}
}

export function getTypeEtablissementIdentifier(typeEtablissement: ITypeEtablissement): number | undefined {
  return typeEtablissement.id;
}
