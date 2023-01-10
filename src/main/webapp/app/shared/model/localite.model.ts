import dayjs from 'dayjs/esm';
import { IEtablissement } from 'app/entities/etablissement/etablissement.model';
import { ITypeLocalite } from 'app/entities/type-localite/type-localite.model';
import { ITableValeur } from '../../entities/table-valeur/table-valeur.model';

export interface ILocalite {
  id?: number;
  code?: string | null;
  estParDefaut?: true | null;
  libelle?: string | null;
  niveau?: string | null;
  ordre?: string | null;
  version?: string | null;
  pays?: ITableValeur | null;
  insertUserId?: number | null;
  insertDate?: dayjs.Dayjs | null;
  localite?: ILocalite | null;
  etabs?: IEtablissement[] | null;
  rattachementId?: ILocalite | null;
  typeLocalite?: ITypeLocalite | null;
}

export class Localite implements ILocalite {
  constructor(
    public id?: number,
    public code?: string | null,
    public estParDefaut?: true | null,
    public libelle?: string | null,
    public niveau?: string | null,
    public ordre?: string | null,
    public version?: string | null,
    public pays?: ITableValeur | null,
    public insertUserId?: number | null,
    public insertDate?: dayjs.Dayjs | null,
    public localite?: ILocalite | null,
    public etabs?: IEtablissement[] | null,
    public rattachementId?: ILocalite | null,
    public typeLocalite?: ITypeLocalite | null
  ) {}
}

export function getLocaliteIdentifier(localite: ILocalite): number | undefined {
  return localite.id;
}
