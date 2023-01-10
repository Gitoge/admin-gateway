import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserExtended, getUserExtendedIdentifier } from '../user-extended.model';

export type EntityResponseType = HttpResponse<IUserExtended>;
export type EntityArrayResponseType = HttpResponse<IUserExtended[]>;

@Injectable({ providedIn: 'root' })
export class UserExtendedService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-extendeds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userExtended: IUserExtended): Observable<EntityResponseType> {
    return this.http.post<IUserExtended>(this.resourceUrl, userExtended, { observe: 'response' });
  }

  update(userExtended: IUserExtended): Observable<EntityResponseType> {
    return this.http.put<IUserExtended>(`${this.resourceUrl}/${getUserExtendedIdentifier(userExtended) as number}`, userExtended, {
      observe: 'response',
    });
  }

  partialUpdate(userExtended: IUserExtended): Observable<EntityResponseType> {
    return this.http.patch<IUserExtended>(`${this.resourceUrl}/${getUserExtendedIdentifier(userExtended) as number}`, userExtended, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserExtended>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserExtended[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUserExtendedToCollectionIfMissing(
    userExtendedCollection: IUserExtended[],
    ...userExtendedsToCheck: (IUserExtended | null | undefined)[]
  ): IUserExtended[] {
    const userExtendeds: IUserExtended[] = userExtendedsToCheck.filter(isPresent);
    if (userExtendeds.length > 0) {
      const userExtendedCollectionIdentifiers = userExtendedCollection.map(
        userExtendedItem => getUserExtendedIdentifier(userExtendedItem)!
      );
      const userExtendedsToAdd = userExtendeds.filter(userExtendedItem => {
        const userExtendedIdentifier = getUserExtendedIdentifier(userExtendedItem);
        if (userExtendedIdentifier == null || userExtendedCollectionIdentifiers.includes(userExtendedIdentifier)) {
          return false;
        }
        userExtendedCollectionIdentifiers.push(userExtendedIdentifier);
        return true;
      });
      return [...userExtendedsToAdd, ...userExtendedCollection];
    }
    return userExtendedCollection;
  }
}
