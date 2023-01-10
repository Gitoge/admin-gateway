export interface IGrilleConvention {
  id?: number;
  salaireDeBase?: number | null;
  tauxPrimeDeTechnicite?: number | null;
  gradeId?: number | null;
  classeId?: number | null;
  etablissementId?: number | null;
  categorieId?: number | null;
  libelleCategorie?: string | null;
  libelleEtablissement?: string | null;
  libelleClasse?: string | null;
  codeGrade?: string | null;
}

export class GrilleConvention implements IGrilleConvention {
  constructor(
    public id?: number,
    public salaireDeBase?: number | null,
    public tauxPrimeDeTechnicite?: number | null,
    public gradeId?: number | null,
    public classeId?: number | null,
    public etablissementId?: number | null,
    public categorieId?: number | null,
    public libelleCategorie?: string | null,
    public libelleEtablissement?: string | null,
    public libelleClasse?: string | null,
    public codeGrade?: string | null
  ) {}
}

export function getGrilleConventionIdentifier(grilleConvention: IGrilleConvention): number | undefined {
  return grilleConvention.id;
}
