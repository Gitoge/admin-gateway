import { IProfils } from 'app/entities/profils/profils.model';
import { IRoles } from 'app/entities/roles/roles.model';

export interface IProfilsRoles {
  id?: number;
  profils?: IProfils;
  roles?: IRoles;
  isChecked?: boolean;
}

export class ProfilsRoles implements IProfilsRoles {
  constructor(public id?: number, public profils?: IProfils, public roles?: IRoles, public isChecked?: boolean) {}
}

export function getProfilsRolesIdentifier(profilsRoles: IProfilsRoles): number | undefined {
  return profilsRoles.id;
}
