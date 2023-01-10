import { IActions } from 'app/entities/actions/actions.model';
import { IPages } from 'app/entities/pages/pages.model';

export interface IPagesActions {
  id?: number;
  actions?: IActions;
  pages?: IPages;
  isChecked?: boolean;
}

export class PagesActions implements IPagesActions {
  constructor(public id?: number, public actions?: IActions, public pages?: IPages, public isChecked?: boolean) {}
}

export function getPagesActionsIdentifier(pagesActions: IPagesActions): number | undefined {
  return pagesActions.id;
}
