export interface IParametre {
  id?: number;
  code?: string;
  libelle?: string;
  valeur?: string;
}

export class Parametre implements IParametre {
  constructor(public id?: number, public code?: string, public libelle?: string, public valeur?: string) {}
}

export function getParametreIdentifier(parametre: IParametre): number | undefined {
  return parametre.id;
}
