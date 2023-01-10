export interface IInfosConventionEtablissements {
  id?: number;
  code?: string;
  libelle?: string;
  etablissementId?: number | null;
  conventionId?: number | null;
  isChecked?: Boolean;
}

export class InfosConventionEtablissements implements IInfosConventionEtablissements {
  constructor(
    public id?: number,
    public etablissementId?: number | null,
    public code?: string,
    public libelle?: string,
    public conventionId?: number | null,
    public isChecked?: Boolean
  ) {}
}

//   export function getConventionEtablissementsIdentifier(conventionEtablissements: IConventionEtablissements): number | undefined {
//     return conventionEtablissements.id;
//   }
