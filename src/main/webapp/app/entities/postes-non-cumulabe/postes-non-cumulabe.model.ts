export interface IPostesNonCumulabe {
  id?: number;
  codePoste1?: string | null;
  codePoste2?: string | null;
}

export class PostesNonCumulabe implements IPostesNonCumulabe {
  constructor(public id?: number, public codePoste1?: string | null, public codePoste2?: string | null) {}
}

export function getPostesNonCumulabeIdentifier(postesNonCumulabe: IPostesNonCumulabe): number | undefined {
  return postesNonCumulabe.id;
}
