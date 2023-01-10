import { IActions } from 'app/entities/actions/actions.model';
import { IModules } from 'app/entities/modules/modules.model';
import { IPages } from 'app/entities/pages/pages.model';
import { IPersonne } from 'app/entities/personne/personne.model';
import { IRoles } from 'app/entities/roles/roles.model';

export interface IInfosUser {
  personne?: IPersonne;
  roles?: IRoles[];
  pages?: IPages[];
  modules?: IModules[];
  actions?: IActions[];
}

export class InfosUser implements IInfosUser {
  constructor(
    public personne?: IPersonne,
    public roles?: IRoles[],
    public pages?: IPages[],
    public modules?: IModules[],
    public actions?: IActions[]
  ) {}
}
