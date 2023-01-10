export interface ICadre {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  typeSalaire?: string | null;
}

export class Cadre implements ICadre {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public typeSalaire?: string | null
  ) {}
}

export function getCadreIdentifier(cadre: ICadre): number | undefined {
  return cadre.id;
}
