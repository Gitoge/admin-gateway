import { ITypePosition } from 'app/entities/type-position/type-position.model';

export interface IPositions {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  typeAgent?: string | null;
  impactSolde?: number | null;
  statutPosition?: boolean | null;
  typeposition?: ITypePosition | null;
}

export class Positions implements IPositions {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public typeAgent?: string | null,
    public impactSolde?: number | null,
    public statutPosition?: boolean | null,
    public typeposition?: ITypePosition | null
  ) {
    this.statutPosition = this.statutPosition ?? false;
  }
}

export function getPositionsIdentifier(positions: IPositions): number | undefined {
  return positions.id;
}
