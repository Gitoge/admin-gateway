import { ITableTypeValeur } from 'app/entities/table-type-valeur/table-type-valeur.model';

export interface ITableValeur {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  tabletypevaleur?: ITableTypeValeur | null;
}

export class TableValeur implements ITableValeur {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public tabletypevaleur?: ITableTypeValeur | null
  ) {}
}

export function getTableValeurIdentifier(tableValeur: ITableValeur): number | undefined {
  return tableValeur.id;
}
