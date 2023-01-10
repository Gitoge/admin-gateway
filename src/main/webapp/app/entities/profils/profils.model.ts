import { IRoles } from '../roles/roles.model';

export interface IProfils {
  id?: number;
  code?: string | null;
  libelle?: string | null;
  description?: string | null;
  roles?: IRoles[] | null;
}

export class Profils implements IProfils {
  constructor(
    public id?: number,
    public code?: string | null,
    public libelle?: string | null,
    public description?: string | null,
    public roles?: IRoles[] | null
  ) {}
}

export function getProfilsIdentifier(profils: IProfils): number | undefined {
  return profils.id;
}
