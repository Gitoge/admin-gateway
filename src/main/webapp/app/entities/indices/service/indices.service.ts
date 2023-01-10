import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IIndices, getIndicesIdentifier } from '../indices.model';

export type EntityResponseType = HttpResponse<IIndices>;
export type EntityArrayResponseType = HttpResponse<IIndices[]>;

@Injectable({ providedIn: 'root' })
export class IndicesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/indices');

  protected resourceUrlIndicesRecherche = this.applicationConfigService.getEndpointForBackend('api/indices/recherche');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(indices: IIndices): Observable<EntityResponseType> {
    return this.http.post<IIndices>(this.resourceUrl, indices, { observe: 'response' });
  }

  update(indices: IIndices): Observable<EntityResponseType> {
    return this.http.put<IIndices>(`${this.resourceUrl}/${getIndicesIdentifier(indices) as number}`, indices, { observe: 'response' });
  }

  partialUpdate(indices: IIndices): Observable<EntityResponseType> {
    return this.http.patch<IIndices>(`${this.resourceUrl}/${getIndicesIdentifier(indices) as number}`, indices, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IIndices>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIndices[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findIndicesByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IIndices[]>(`${this.resourceUrlIndicesRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  addIndicesToCollectionIfMissing(indicesCollection: IIndices[], ...indicesToCheck: (IIndices | null | undefined)[]): IIndices[] {
    const indices: IIndices[] = indicesToCheck.filter(isPresent);
    if (indices.length > 0) {
      const indicesCollectionIdentifiers = indicesCollection.map(indicesItem => getIndicesIdentifier(indicesItem)!);
      const indicesToAdd = indices.filter(indicesItem => {
        const indicesIdentifier = getIndicesIdentifier(indicesItem);
        if (indicesIdentifier == null || indicesCollectionIdentifiers.includes(indicesIdentifier)) {
          return false;
        }
        indicesCollectionIdentifiers.push(indicesIdentifier);
        return true;
      });
      return [...indicesToAdd, ...indicesCollection];
    }
    return indicesCollection;
  }
}
