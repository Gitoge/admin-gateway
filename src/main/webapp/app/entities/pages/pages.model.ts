import { Actions, IActions } from 'app/entities/actions/actions.model';
import { IModules } from '../modules/modules.model';
import { ITableValeur } from '../table-valeur/table-valeur.model';

export interface IPages {
  id?: number;
  code?: string | null;
  libelle?: string | null;
  description?: string | null;
  routerLink?: ITableValeur | null;
  ordre?: number | null;
  modules?: IModules | null;
  actions?: IActions[];
  active?: boolean | null;
}

export class Pages implements IPages {
  constructor(
    public id?: number,
    public code?: string | null,
    public libelle?: string | null,
    public description?: string | null,
    public routerLink?: ITableValeur | null,
    public ordre?: number | null,
    public modules?: IModules | null,
    public actions?: IActions[],
    public active?: boolean | null
  ) {}
}

export function getPagesIdentifier(pages: IPages): number | undefined {
  return pages.id;
}
