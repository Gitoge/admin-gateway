export interface IConventionEtablissements {
  id?: number;
  etablissementId?: number | null;
  conventionId?: number | null;
}

export class ConventionEtablissements implements IConventionEtablissements {
  constructor(public id?: number, public etablissementId?: number | null, public conventionId?: number | null) {}
}

export function getConventionEtablissementsIdentifier(conventionEtablissements: IConventionEtablissements): number | undefined {
  return conventionEtablissements.id;
}
