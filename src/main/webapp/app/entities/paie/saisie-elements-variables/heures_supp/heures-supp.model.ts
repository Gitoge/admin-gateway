import { IPostes } from 'app/entities/postes/postes.model';
import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';

export interface IHeuresSupp {
  id?: number;
  codePoste?: string;
  libellePoste?: string;
  heuresOrdinaires?: number;
  dimanchesJoursFeries?: number;
  heuresNuit?: number;
}

export class HeuresSupp implements IHeuresSupp {
  constructor(
    public id?: number,
    public codePoste?: string,
    public libellePoste?: string,
    public heuresOrdinaires?: number,
    public dimanchesJoursFeries?: number,
    public heuresNuit?: number
  ) {}
}

export function getHeuresSuppIdentifier(heuresSupp: IHeuresSupp): number | undefined {
  return heuresSupp.id;
}
