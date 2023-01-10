import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { IPostes } from '../postes/postes.model';

export interface IExclusionTaux {
  id?: number;
  etablissementId?: number | null;
  posteId?: number | null;
  codePoste?: string | null;
  libellePoste?: string | null;
  valeur?: number;
  etablissement?: IEtablissement;
  libelleEtablissement?: string | null;
  postes?: IPostes;
}

export class ExclusionTaux implements IExclusionTaux {
  constructor(
    public id?: number,
    public etablissementId?: number | null,
    public posteId?: number | null,
    public codePoste?: string | null,
    public libellePoste?: string | null,
    public valeur?: number,
    public etablissement?: IEtablissement,
    public libelleEtablissement?: string | null,
    public postes?: IPostes
  ) {}
}

export function getExclusionTauxIdentifier(exclusionTaux: IExclusionTaux): number | undefined {
  return exclusionTaux.id;
}
