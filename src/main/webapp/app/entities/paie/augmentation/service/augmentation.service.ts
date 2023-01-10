import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAugmentation, getAugmentationIdentifier } from '../augmentation.model';

export type EntityResponseType = HttpResponse<IAugmentation>;
export type EntityArrayResponseType = HttpResponse<IAugmentation[]>;

@Injectable({ providedIn: 'root' })
export class AugmentationService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/augmentation');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(augmentation: IAugmentation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(augmentation);
    return this.http
      .post<IAugmentation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(augmentation: IAugmentation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(augmentation);
    return this.http
      .put<IAugmentation>(`${this.resourceUrl}/${getAugmentationIdentifier(augmentation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(augmentation: IAugmentation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(augmentation);
    return this.http
      .patch<IAugmentation>(`${this.resourceUrl}/${getAugmentationIdentifier(augmentation) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAugmentation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAugmentation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAugmentationToCollectionIfMissing(
    augmentationCollection: IAugmentation[],
    ...augmentationsToCheck: (IAugmentation | null | undefined)[]
  ): IAugmentation[] {
    const augmentations: IAugmentation[] = augmentationsToCheck.filter(isPresent);
    if (augmentations.length > 0) {
      const augmentationCollectionIdentifiers = augmentationCollection.map(
        augmentationItem => getAugmentationIdentifier(augmentationItem)!
      );
      const augmentationsToAdd = augmentations.filter(augmentationItem => {
        const augmentationIdentifier = getAugmentationIdentifier(augmentationItem);
        if (augmentationIdentifier == null || augmentationCollectionIdentifiers.includes(augmentationIdentifier)) {
          return false;
        }
        augmentationCollectionIdentifiers.push(augmentationIdentifier);
        return true;
      });
      return [...augmentationsToAdd, ...augmentationCollection];
    }
    return augmentationCollection;
  }

  protected convertDateFromClient(augmentation: IAugmentation): IAugmentation {
    return Object.assign({}, augmentation, {
      dateInsertId: augmentation.dateInsertId?.isValid() ? augmentation.dateInsertId.toJSON() : undefined,
      dateUpdateId: augmentation.dateUpdateId?.isValid() ? augmentation.dateUpdateId.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateInsertId = res.body.dateInsertId ? dayjs(res.body.dateInsertId) : undefined;
      res.body.dateUpdateId = res.body.dateUpdateId ? dayjs(res.body.dateUpdateId) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((augmentation: IAugmentation) => {
        augmentation.dateInsertId = augmentation.dateInsertId ? dayjs(augmentation.dateInsertId) : undefined;
        augmentation.dateUpdateId = augmentation.dateUpdateId ? dayjs(augmentation.dateUpdateId) : undefined;
      });
    }
    return res;
  }
}
