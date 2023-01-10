import { ITypeReglement } from 'app/entities/type-reglement/type-reglement.model';

export interface IReglement {
  id?: number;
  code?: string;
  libelle?: string | null;
  complementinfos?: string | null;
  commentaire?: string | null;
  typereglement?: ITypeReglement | null;
}

export class Reglement implements IReglement {
  constructor(
    public id?: number,
    public code?: string,
    public libelle?: string | null,
    public complementinfos?: string | null,
    public commentaire?: string | null,
    public typereglement?: ITypeReglement | null
  ) {}
}

export function getReglementIdentifier(reglement: IReglement): number | undefined {
  return reglement.id;
}
