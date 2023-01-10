export interface IPermissions {
  codePage?: string;
  actionAjout?: Boolean;
  actionModifier?: Boolean;
  actionSupprimer?: Boolean;
  actionDetails?: Boolean;
  actionPages?: Boolean;
  acces?: Boolean;
}

export class Permissions implements IPermissions {
  constructor(
    public codePage?: string,
    public actionAjout?: Boolean,
    public actionModifier?: Boolean,
    public actionSupprimer?: Boolean,
    public actionDetails?: Boolean,
    public actionPages?: Boolean,
    public acces?: Boolean
  ) {}
}
