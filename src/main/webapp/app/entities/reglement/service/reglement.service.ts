import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReglement, getReglementIdentifier } from '../reglement.model';

export type EntityResponseType = HttpResponse<IReglement>;
export type EntityArrayResponseType = HttpResponse<IReglement[]>;

@Injectable({ providedIn: 'root' })
export class ReglementService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/reglements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(reglement: IReglement): Observable<EntityResponseType> {
    return this.http.post<IReglement>(this.resourceUrl, reglement, { observe: 'response' });
  }

  update(reglement: IReglement): Observable<EntityResponseType> {
    return this.http.put<IReglement>(`${this.resourceUrl}/${getReglementIdentifier(reglement) as number}`, reglement, {
      observe: 'response',
    });
  }

  partialUpdate(reglement: IReglement): Observable<EntityResponseType> {
    return this.http.patch<IReglement>(`${this.resourceUrl}/${getReglementIdentifier(reglement) as number}`, reglement, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IReglement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReglement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReglementToCollectionIfMissing(
    reglementCollection: IReglement[],
    ...reglementsToCheck: (IReglement | null | undefined)[]
  ): IReglement[] {
    const reglements: IReglement[] = reglementsToCheck.filter(isPresent);
    if (reglements.length > 0) {
      const reglementCollectionIdentifiers = reglementCollection.map(reglementItem => getReglementIdentifier(reglementItem)!);
      const reglementsToAdd = reglements.filter(reglementItem => {
        const reglementIdentifier = getReglementIdentifier(reglementItem);
        if (reglementIdentifier == null || reglementCollectionIdentifiers.includes(reglementIdentifier)) {
          return false;
        }
        reglementCollectionIdentifiers.push(reglementIdentifier);
        return true;
      });
      return [...reglementsToAdd, ...reglementCollection];
    }
    return reglementCollection;
  }
}
