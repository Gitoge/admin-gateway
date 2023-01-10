import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAugmentationIndice, getAugmentationIndiceIdentifier } from '../augmentation-indice.model';
import { IGrade } from '../../../grade/grade.model';

export type EntityResponseType = HttpResponse<IAugmentationIndice>;
export type EntityArrayResponseType = HttpResponse<IAugmentationIndice[]>;

@Injectable({ providedIn: 'root' })
export class AugmentationIndiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/augmentation-indices');
  protected resourceUrlMaxTotal = this.applicationConfigService.getEndpointForPaie('api/max-total');

  protected resourceUrlList = this.applicationConfigService.getEndpointForPaie('api/list-augmentation-indices');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(augmentationIndice: IAugmentationIndice): Observable<EntityResponseType> {
    return this.http.post<IAugmentationIndice>(this.resourceUrl, augmentationIndice, { observe: 'response' });
  }

  update(augmentationIndice: IAugmentationIndice): Observable<EntityResponseType> {
    return this.http.put<IAugmentationIndice>(
      `${this.resourceUrl}/${getAugmentationIndiceIdentifier(augmentationIndice) as number}`,
      augmentationIndice,
      { observe: 'response' }
    );
  }

  findMaxTotal(): Observable<EntityArrayResponseType> {
    return this.http.get<IAugmentationIndice[]>(`${this.resourceUrlMaxTotal}`, { observe: 'response' });
  }

  partialUpdate(augmentationIndice: IAugmentationIndice): Observable<EntityResponseType> {
    return this.http.patch<IAugmentationIndice>(
      `${this.resourceUrl}/${getAugmentationIndiceIdentifier(augmentationIndice) as number}`,
      augmentationIndice,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAugmentationIndice>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAugmentationIndice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
  queryByList(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAugmentationIndice[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAugmentationIndiceToCollectionIfMissing(
    augmentationIndiceCollection: IAugmentationIndice[],
    ...augmentationIndicesToCheck: (IAugmentationIndice | null | undefined)[]
  ): IAugmentationIndice[] {
    const augmentationIndices: IAugmentationIndice[] = augmentationIndicesToCheck.filter(isPresent);
    if (augmentationIndices.length > 0) {
      const augmentationIndiceCollectionIdentifiers = augmentationIndiceCollection.map(
        augmentationIndiceItem => getAugmentationIndiceIdentifier(augmentationIndiceItem)!
      );
      const augmentationIndicesToAdd = augmentationIndices.filter(augmentationIndiceItem => {
        const augmentationIndiceIdentifier = getAugmentationIndiceIdentifier(augmentationIndiceItem);
        if (augmentationIndiceIdentifier == null || augmentationIndiceCollectionIdentifiers.includes(augmentationIndiceIdentifier)) {
          return false;
        }
        augmentationIndiceCollectionIdentifiers.push(augmentationIndiceIdentifier);
        return true;
      });
      return [...augmentationIndicesToAdd, ...augmentationIndiceCollection];
    }
    return augmentationIndiceCollection;
  }
}
