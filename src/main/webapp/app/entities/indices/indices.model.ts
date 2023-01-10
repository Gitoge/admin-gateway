export interface IIndices {
  id?: number;
  code?: string;
  description?: string | null;
  mntSFTenf01?: number | null;
  mntSFTenf02?: number | null;
  soldeIndiciaire?: number | null;
}

export class Indices implements IIndices {
  constructor(
    public id?: number,
    public code?: string,
    public description?: string | null,
    public mntSFTenf01?: number | null,
    public mntSFTenf02?: number | null,
    public soldeIndiciaire?: number | null
  ) {}
}

export function getIndicesIdentifier(indices: IIndices): number | undefined {
  return indices.id;
}
