import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IStructureAdmin, getStructureAdminIdentifier } from '../structure-admin.model';

export type EntityResponseType = HttpResponse<IStructureAdmin>;
export type EntityArrayResponseType = HttpResponse<IStructureAdmin[]>;

@Injectable({ providedIn: 'root' })
export class StructureAdminService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/structure-admins');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(structureAdmin: IStructureAdmin): Observable<EntityResponseType> {
    return this.http.post<IStructureAdmin>(this.resourceUrl, structureAdmin, { observe: 'response' });
  }

  update(structureAdmin: IStructureAdmin): Observable<EntityResponseType> {
    return this.http.put<IStructureAdmin>(`${this.resourceUrl}/${getStructureAdminIdentifier(structureAdmin) as number}`, structureAdmin, {
      observe: 'response',
    });
  }

  partialUpdate(structureAdmin: IStructureAdmin): Observable<EntityResponseType> {
    return this.http.patch<IStructureAdmin>(
      `${this.resourceUrl}/${getStructureAdminIdentifier(structureAdmin) as number}`,
      structureAdmin,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStructureAdmin>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStructureAdmin[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addStructureAdminToCollectionIfMissing(
    structureAdminCollection: IStructureAdmin[],
    ...structureAdminsToCheck: (IStructureAdmin | null | undefined)[]
  ): IStructureAdmin[] {
    const structureAdmins: IStructureAdmin[] = structureAdminsToCheck.filter(isPresent);
    if (structureAdmins.length > 0) {
      const structureAdminCollectionIdentifiers = structureAdminCollection.map(
        structureAdminItem => getStructureAdminIdentifier(structureAdminItem)!
      );
      const structureAdminsToAdd = structureAdmins.filter(structureAdminItem => {
        const structureAdminIdentifier = getStructureAdminIdentifier(structureAdminItem);
        if (structureAdminIdentifier == null || structureAdminCollectionIdentifiers.includes(structureAdminIdentifier)) {
          return false;
        }
        structureAdminCollectionIdentifiers.push(structureAdminIdentifier);
        return true;
      });
      return [...structureAdminsToAdd, ...structureAdminCollection];
    }
    return structureAdminCollection;
  }
}
