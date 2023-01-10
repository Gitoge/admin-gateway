export interface IStructureAdmin {
  id?: number;
  code?: string | null;
  libelle?: string | null;
  description?: string | null;
  direction?: string | null;
  services?: string | null;
  adresse?: string | null;
}

export class StructureAdmin implements IStructureAdmin {
  constructor(
    public id?: number,
    public code?: string | null,
    public libelle?: string | null,
    public description?: string | null,
    public direction?: string | null,
    public services?: string | null,
    public adresse?: string | null
  ) {}
}

export function getStructureAdminIdentifier(structureAdmin: IStructureAdmin): number | undefined {
  return structureAdmin.id;
}
