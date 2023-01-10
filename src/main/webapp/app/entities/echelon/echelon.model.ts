export interface IEchelon {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
}

export class Echelon implements IEchelon {
  constructor(public id?: number, public code?: string, public libelle?: string, public description?: string | null) {}
}

export function getEchelonIdentifier(echelon: IEchelon): number | undefined {
  return echelon.id;
}
