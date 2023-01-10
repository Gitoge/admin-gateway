import { IPages } from 'app/entities/pages/pages.model';

export interface IActions {
  id?: number;
  code?: string | null;
  libelle?: string | null;
  description?: string | null;
  actionLink?: string | null;
  // pages?: IPages[] | null;
}

export class Actions implements IActions {
  constructor(
    public id?: number,
    public code?: string | null,
    public libelle?: string | null,
    public description?: string | null,
    public actionLink?: string | null
  ) // public pages?: IPages[] | null
  {}
}

export function getActionsIdentifier(actions: IActions): number | undefined {
  return actions.id;
}
