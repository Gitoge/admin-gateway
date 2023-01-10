import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IArrondissement, getArrondissementIdentifier } from '../arrondissement.model';

export type EntityResponseType = HttpResponse<IArrondissement>;
export type EntityArrayResponseType = HttpResponse<IArrondissement[]>;

@Injectable({ providedIn: 'root' })
export class ArrondissementService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/arrondissements');
  protected resourceUrlALL = this.applicationConfigService.getEndpointForBackend('api/allArrondissement');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(arrondissement: IArrondissement): Observable<EntityResponseType> {
    return this.http.post<IArrondissement>(this.resourceUrl, arrondissement, { observe: 'response' });
  }

  update(arrondissement: IArrondissement): Observable<EntityResponseType> {
    return this.http.put<IArrondissement>(`${this.resourceUrl}/${getArrondissementIdentifier(arrondissement) as number}`, arrondissement, {
      observe: 'response',
    });
  }

  partialUpdate(arrondissement: IArrondissement): Observable<EntityResponseType> {
    return this.http.patch<IArrondissement>(
      `${this.resourceUrl}/${getArrondissementIdentifier(arrondissement) as number}`,
      arrondissement,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IArrondissement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArrondissement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
  queryAll(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IArrondissement[]>(this.resourceUrlALL, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addArrondissementToCollectionIfMissing(
    arrondissementCollection: IArrondissement[],
    ...arrondissementsToCheck: (IArrondissement | null | undefined)[]
  ): IArrondissement[] {
    const arrondissements: IArrondissement[] = arrondissementsToCheck.filter(isPresent);
    if (arrondissements.length > 0) {
      const arrondissementCollectionIdentifiers = arrondissementCollection.map(
        arrondissementItem => getArrondissementIdentifier(arrondissementItem)!
      );
      const arrondissementsToAdd = arrondissements.filter(arrondissementItem => {
        const arrondissementIdentifier = getArrondissementIdentifier(arrondissementItem);
        if (arrondissementIdentifier == null || arrondissementCollectionIdentifiers.includes(arrondissementIdentifier)) {
          return false;
        }
        arrondissementCollectionIdentifiers.push(arrondissementIdentifier);
        return true;
      });
      return [...arrondissementsToAdd, ...arrondissementCollection];
    }
    return arrondissementCollection;
  }
}
