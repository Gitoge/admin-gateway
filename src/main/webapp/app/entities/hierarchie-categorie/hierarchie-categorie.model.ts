import { ICategorie } from '../categorie/categorie.model';
import { IHierarchie } from '../hierarchie/hierarchie.model';

export interface IHierarchieCategorie {
  id?: number;
  hierarchie?: IHierarchie;
  categories?: ICategorie;
}

export class HierarchieCategorie implements IHierarchieCategorie {
  constructor(public id?: number, public hierarchie?: IHierarchie, public categories?: ICategorie) {}
}

export function getHierarchieCategorieIdentifier(hierarchieCategorie: IHierarchieCategorie): number | undefined {
  return hierarchieCategorie.id;
}
