import { IProfils } from 'app/entities/profils/profils.model';
import { IRoles } from 'app/entities/roles/roles.model';

export interface IProfilsRolesCustom {
  id?: number;
  profils?: string;
  roles?: string;
  libelleProfil?: string;
  libelleRole?: string;
  isChecked?: boolean;
}

export class ProfilsRoles implements IProfilsRolesCustom {
  constructor(
    public id?: number,
    public profils?: string,
    public roles?: string,
    public libelleProfil?: string,
    public libelleRole?: string,
    public isChecked?: boolean
  ) {}
}

export function getProfilsRolesIdentifier(roles: IProfilsRolesCustom): number | undefined {
  return roles.id;
}
