import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRoles, getRolesIdentifier } from '../roles.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { IPagesActions } from 'app/shared/model/pagesActions';
import { getPagesActionsIdentifier, IPagesActionsCustom } from 'app/shared/model/pagesActionsCustom';

export type EntityResponseType = HttpResponse<IRoles>;
export type EntityArrayResponseType = HttpResponse<IRoles[]>;

export type EntityArrayResponseTypePagesActions = HttpResponse<IPagesActionsCustom[]>;

@Injectable({ providedIn: 'root' })
export class RolesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/roles');

  protected resourceUrlPagesActions = this.applicationConfigService.getEndpointForBackend('api/page-actions/all');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(roles: IRoles): Observable<EntityResponseType> {
    return this.http.post<IRoles>(this.resourceUrl, roles, { observe: 'response' });
  }

  update(roles: IRoles): Observable<EntityResponseType> {
    return this.http.put<IRoles>(`${this.resourceUrl}/${getRolesIdentifier(roles) as number}`, roles, { observe: 'response' });
  }

  partialUpdate(roles: IRoles): Observable<EntityResponseType> {
    return this.http.patch<IRoles>(`${this.resourceUrl}/${getRolesIdentifier(roles) as number}`, roles, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRoles>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRoles[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryPagesActions(req?: any): Observable<EntityArrayResponseTypePagesActions> {
    const options = createRequestOption(req);
    return this.http.get<IPagesActionsCustom[]>(this.resourceUrlPagesActions, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRolesToCollectionIfMissing(rolesCollection: IRoles[], ...rolesToCheck: (IRoles | null | undefined)[]): IRoles[] {
    const roles: IRoles[] = rolesToCheck.filter(isPresent);
    if (roles.length > 0) {
      const rolesCollectionIdentifiers = rolesCollection.map(rolesItem => getRolesIdentifier(rolesItem)!);
      const rolesToAdd = roles.filter(rolesItem => {
        const rolesIdentifier = getRolesIdentifier(rolesItem);
        if (rolesIdentifier == null || rolesCollectionIdentifiers.includes(rolesIdentifier)) {
          return false;
        }
        rolesCollectionIdentifiers.push(rolesIdentifier);
        return true;
      });
      return [...rolesToAdd, ...rolesCollection];
    }
    return rolesCollection;
  }

  addPagesActionsToCollectionIfMissing(
    pagesActionsCollection: IPagesActionsCustom[],
    ...pagesActionsToCheck: (IPagesActionsCustom | null | undefined)[]
  ): IPagesActionsCustom[] {
    const pagesActions: IPagesActionsCustom[] = pagesActionsToCheck.filter(isPresent);
    if (pagesActions.length > 0) {
      const pagesActionsCollectionIdentifiers = pagesActionsCollection.map(
        pagesActionsItem => getPagesActionsIdentifier(pagesActionsItem)!
      );
      const pagesActionsToAdd = pagesActions.filter(pagesActionsItem => {
        const pagesActionsIdentifier = getPagesActionsIdentifier(pagesActionsItem);
        if (pagesActionsIdentifier == null || pagesActionsCollectionIdentifiers.includes(pagesActionsIdentifier)) {
          return false;
        }
        pagesActionsCollectionIdentifiers.push(pagesActionsIdentifier);
        return true;
      });
      return [...pagesActionsToAdd, ...pagesActionsCollection];
    }
    return pagesActionsCollection;
  }
}
