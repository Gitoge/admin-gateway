import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExclusionAugmentation, getExclusionAugmentationIdentifier } from '../exclusion-augmentation.model';

export type EntityResponseType = HttpResponse<IExclusionAugmentation>;
export type EntityArrayResponseType = HttpResponse<IExclusionAugmentation[]>;

@Injectable({ providedIn: 'root' })
export class ExclusionAugmentationService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/exclusion_augmentation');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(exclusionAugmentation: IExclusionAugmentation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exclusionAugmentation);
    return this.http
      .post<IExclusionAugmentation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(exclusionAugmentation: IExclusionAugmentation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exclusionAugmentation);
    return this.http
      .put<IExclusionAugmentation>(`${this.resourceUrl}/${getExclusionAugmentationIdentifier(exclusionAugmentation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(exclusionAugmentation: IExclusionAugmentation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(exclusionAugmentation);
    return this.http
      .patch<IExclusionAugmentation>(`${this.resourceUrl}/${getExclusionAugmentationIdentifier(exclusionAugmentation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IExclusionAugmentation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IExclusionAugmentation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExclusionAugmentationToCollectionIfMissing(
    exclusionAugmentationCollection: IExclusionAugmentation[],
    ...exclusionAugmentationsToCheck: (IExclusionAugmentation | null | undefined)[]
  ): IExclusionAugmentation[] {
    const exclusionAugmentations: IExclusionAugmentation[] = exclusionAugmentationsToCheck.filter(isPresent);
    if (exclusionAugmentations.length > 0) {
      const exclusionAugmentationCollectionIdentifiers = exclusionAugmentationCollection.map(
        exclusionAugmentationItem => getExclusionAugmentationIdentifier(exclusionAugmentationItem)!
      );
      const exclusionAugmentationsToAdd = exclusionAugmentations.filter(exclusionAugmentationItem => {
        const exclusionAugmentationIdentifier = getExclusionAugmentationIdentifier(exclusionAugmentationItem);
        if (
          exclusionAugmentationIdentifier == null ||
          exclusionAugmentationCollectionIdentifiers.includes(exclusionAugmentationIdentifier)
        ) {
          return false;
        }
        exclusionAugmentationCollectionIdentifiers.push(exclusionAugmentationIdentifier);
        return true;
      });
      return [...exclusionAugmentationsToAdd, ...exclusionAugmentationCollection];
    }
    return exclusionAugmentationCollection;
  }

  protected convertDateFromClient(exclusionAugmentation: IExclusionAugmentation): IExclusionAugmentation {
    return Object.assign({}, exclusionAugmentation, {
      dateInsertId: exclusionAugmentation.dateInsertId?.isValid() ? exclusionAugmentation.dateInsertId.toJSON() : undefined,
      dateUpdateId: exclusionAugmentation.dateUpdateId?.isValid() ? exclusionAugmentation.dateUpdateId.toJSON() : undefined,
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
      res.body.forEach((exclusionAugmentation: IExclusionAugmentation) => {
        exclusionAugmentation.dateInsertId = exclusionAugmentation.dateInsertId ? dayjs(exclusionAugmentation.dateInsertId) : undefined;
        exclusionAugmentation.dateUpdateId = exclusionAugmentation.dateUpdateId ? dayjs(exclusionAugmentation.dateUpdateId) : undefined;
      });
    }
    return res;
  }
}
