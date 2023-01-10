import { IPagesActions } from 'app/shared/model/pagesActions';

export interface IRoles {
  id?: number;
  code?: string | null;
  libelle?: string | null;
  description?: string | null;
  pagesActions?: IPagesActions[] | null;
}

export class Roles implements IRoles {
  constructor(
    public id?: number,
    public code?: string | null,
    public libelle?: string | null,
    public description?: string | null,
    public pagesActions?: IPagesActions[] | null
  ) {}
}

export function getRolesIdentifier(roles: IRoles): number | undefined {
  return roles.id;
}
