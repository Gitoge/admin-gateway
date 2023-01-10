import { IPostes } from '../postes/postes.model';

export interface IPostesReferenceActes {
  id?: number;
  postes?: IPostes;
}

export class PostesReferenceActes implements IPostesReferenceActes {
  constructor(public id?: number, public postes?: IPostes) {}
}

export function getPostesReferenceActesIdentifier(postesReferenceActes: IPostesReferenceActes): number | undefined {
  return postesReferenceActes.id;
}
