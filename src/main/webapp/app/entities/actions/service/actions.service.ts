import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IActions, getActionsIdentifier } from '../actions.model';

import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IActions>;
export type EntityArrayResponseType = HttpResponse<IActions[]>;

@Injectable({ providedIn: 'root' })
export class ActionsService {
  public resourceUrl = this.applicationConfigService.getEndpointForBackend('api/actions');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private authServerProvider: AuthServerProvider
  ) {}

  create(actions: IActions): Observable<EntityResponseType> {
    return this.http.post<IActions>(this.resourceUrl, actions, { observe: 'response' });
  }

  update(actions: IActions): Observable<EntityResponseType> {
    return this.http.put<IActions>(`${this.resourceUrl}/${getActionsIdentifier(actions) as number}`, actions, { observe: 'response' });
  }

  partialUpdate(actions: IActions): Observable<EntityResponseType> {
    return this.http.patch<IActions>(`${this.resourceUrl}/${getActionsIdentifier(actions) as number}`, actions, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActions>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActions[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addActionsToCollectionIfMissing(actionsCollection: IActions[], ...actionsToCheck: (IActions | null | undefined)[]): IActions[] {
    const actions: IActions[] = actionsToCheck.filter(isPresent);
    if (actions.length > 0) {
      const actionsCollectionIdentifiers = actionsCollection.map(actionsItem => getActionsIdentifier(actionsItem)!);
      const actionsToAdd = actions.filter(actionsItem => {
        const actionsIdentifier = getActionsIdentifier(actionsItem);
        if (actionsIdentifier == null || actionsCollectionIdentifiers.includes(actionsIdentifier)) {
          return false;
        }
        actionsCollectionIdentifiers.push(actionsIdentifier);
        return true;
      });
      return [...actionsToAdd, ...actionsCollection];
    }
    return actionsCollection;
  }
}
