export interface ICategorie {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
}

export class Categorie implements ICategorie {
  constructor(public id?: number, public code?: string, public libelle?: string, public description?: string | null) {}
}

export function getCategorieIdentifier(categorie: ICategorie): number | undefined {
  return categorie.id;
}
