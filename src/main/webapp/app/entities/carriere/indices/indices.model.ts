import { IGrilleIndiciaire } from 'app/entities/carriere/grille-indiciaire/grille-indiciaire.model';

export interface IIndices {
  id?: number;
  code?: string;
  libelle?: string;
  soldeIndiciaire?: number | null;
  mntSFTenf01?: number | null;
  mntSFTenf02?: number | null;
  // grilleIndiciaires?: IGrilleIndiciaire[] | null;
}

export class Indices implements IIndices {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public mntSFTenf01?: number | null,
    public mntSFTenf02?: number | null,
    public soldeIndiciaire?: number | null //  public grilleIndiciaires?: IGrilleIndiciaire[] | null
  ) {}
}

export function getIndicesIdentifier(indices: IIndices): number | undefined {
  return indices.id;
}
