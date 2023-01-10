import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExclusionTaux, getExclusionTauxIdentifier } from '../exclusion-taux.model';

export type EntityResponseType = HttpResponse<IExclusionTaux>;
export type EntityArrayResponseType = HttpResponse<IExclusionTaux[]>;

@Injectable({ providedIn: 'root' })
export class ExclusionTauxService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/exclusion-tauxes');
  protected resourceUrlEtabId = this.applicationConfigService.getEndpointForPaie('api/exclusion-etablissementId');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(exclusionTaux: IExclusionTaux): Observable<EntityResponseType> {
    return this.http.post<IExclusionTaux>(this.resourceUrl, exclusionTaux, { observe: 'response' });
  }

  update(exclusionTaux: IExclusionTaux): Observable<EntityResponseType> {
    return this.http.put<IExclusionTaux>(`${this.resourceUrl}/${getExclusionTauxIdentifier(exclusionTaux) as number}`, exclusionTaux, {
      observe: 'response',
    });
  }

  partialUpdate(exclusionTaux: IExclusionTaux): Observable<EntityResponseType> {
    return this.http.patch<IExclusionTaux>(`${this.resourceUrl}/${getExclusionTauxIdentifier(exclusionTaux) as number}`, exclusionTaux, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExclusionTaux>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExclusionTaux[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
  queryEtabId(etablissementId: number): Observable<EntityArrayResponseType> {
    return this.http.get<IExclusionTaux[]>(`${this.resourceUrlEtabId}?etablissementId=${etablissementId}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExclusionTauxToCollectionIfMissing(
    exclusionTauxCollection: IExclusionTaux[],
    ...exclusionTauxesToCheck: (IExclusionTaux | null | undefined)[]
  ): IExclusionTaux[] {
    const exclusionTauxes: IExclusionTaux[] = exclusionTauxesToCheck.filter(isPresent);
    if (exclusionTauxes.length > 0) {
      const exclusionTauxCollectionIdentifiers = exclusionTauxCollection.map(
        exclusionTauxItem => getExclusionTauxIdentifier(exclusionTauxItem)!
      );
      const exclusionTauxesToAdd = exclusionTauxes.filter(exclusionTauxItem => {
        const exclusionTauxIdentifier = getExclusionTauxIdentifier(exclusionTauxItem);
        if (exclusionTauxIdentifier == null || exclusionTauxCollectionIdentifiers.includes(exclusionTauxIdentifier)) {
          return false;
        }
        exclusionTauxCollectionIdentifiers.push(exclusionTauxIdentifier);
        return true;
      });
      return [...exclusionTauxesToAdd, ...exclusionTauxCollection];
    }
    return exclusionTauxCollection;
  }
}
