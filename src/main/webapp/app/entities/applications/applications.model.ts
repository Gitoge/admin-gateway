import { IModules } from 'app/entities/modules/modules.model';

export interface IApplications {
  id?: number;
  code?: string | null;
  nom?: string | null;
  description?: string | null;
  modules?: IModules[] | null;
}

export class Applications implements IApplications {
  constructor(
    public id?: number,
    public code?: string | null,
    public nom?: string | null,
    public description?: string | null,
    public modules?: IModules[] | null
  ) {}
}

export function getApplicationsIdentifier(applications: IApplications): number | undefined {
  return applications.id;
}
