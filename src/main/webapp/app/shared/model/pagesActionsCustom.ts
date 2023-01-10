import { IActions } from 'app/entities/actions/actions.model';
import { IPages } from 'app/entities/pages/pages.model';

export interface IPagesActionsCustom {
  id?: number;
  actionId?: number;
  pageId?: number;
  libellePage?: string;
  libelleAction?: string;
  isChecked?: boolean;
}

export class PagesActions implements IPagesActionsCustom {
  constructor(
    public id?: number,
    public actionId?: number,
    public pageId?: number,
    public libellePage?: string,
    public libelleAction?: string,
    public isChecked?: boolean
  ) {}
}

export function getPagesActionsIdentifier(pagesActions: IPagesActionsCustom): number | undefined {
  return pagesActions.id;
}
