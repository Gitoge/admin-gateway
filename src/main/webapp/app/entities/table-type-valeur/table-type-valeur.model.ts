import { ITableValeur } from 'app/entities/table-valeur/table-valeur.model';

export interface ITableTypeValeur {
  id?: number;
  code?: string;
  libelle?: string;
  description?: string | null;
  tablevaleurs?: ITableValeur[] | null;
}

export class TableTypeValeur implements ITableTypeValeur {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string,
    public description?: string | null,
    public tablevaleurs?: ITableValeur[] | null
  ) {}
}

export function getTableTypeValeurIdentifier(tableTypeValeur: ITableTypeValeur): number | undefined {
  return tableTypeValeur.id;
}
