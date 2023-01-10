export interface ICorps {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  codHierarchie?: string | null;
  ageRetraite?: number;
  classification?: string | null;
}

export class Corps implements ICorps {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public codHierarchie?: string | null,
    public ageRetraite?: number,
    public classification?: string | null
  ) {}
}

export function getCorpsIdentifier(corps: ICorps): number | undefined {
  return corps.id;
}
