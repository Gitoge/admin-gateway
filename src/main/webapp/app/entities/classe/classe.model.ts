export interface IClasse {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
}

export class Classe implements IClasse {
  constructor(public id?: number, public code?: string, public libelle?: string, public description?: string | null) {}
}

export function getClasseIdentifier(classe: IClasse): number | undefined {
  return classe.id;
}
