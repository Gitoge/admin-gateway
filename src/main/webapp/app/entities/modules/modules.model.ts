import { IProfils } from 'app/entities/profils/profils.model';
import { IApplications } from 'app/entities/applications/applications.model';
import { IPages } from '../pages/pages.model';
import { ITableValeur } from '../table-valeur/table-valeur.model';

export interface IModules {
  id?: number;
  code?: string | null;
  libelle?: string | null;
  description?: string | null;
  icon?: ITableValeur | null;
  ordre?: number | null;
  routerLink?: ITableValeur | null;
  type?: string | null;
  active?: boolean | null;
  pages?: IPages[] | null;
  applications?: IApplications | null;
}

export class Modules implements IModules {
  constructor(
    public id?: number,
    public code?: string | null,
    public libelle?: string | null,
    public description?: string | null,
    public icon?: ITableValeur | null,
    public ordre?: number | null,
    public routerLink?: ITableValeur | null,
    public type?: string | null,
    public active?: boolean | null,
    public pages?: IPages[] | null,
    public applications?: IApplications | null
  ) {
    this.active = this.active ?? false;
  }
}

export function getModulesIdentifier(modules: IModules): number | undefined {
  return modules.id;
}
