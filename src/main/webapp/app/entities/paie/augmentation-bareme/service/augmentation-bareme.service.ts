import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAugmentationBareme, getAugmentationBaremeIdentifier } from '../augmentation-bareme.model';

export type EntityResponseType = HttpResponse<IAugmentationBareme>;
export type EntityArrayResponseType = HttpResponse<IAugmentationBareme[]>;

@Injectable({ providedIn: 'root' })
export class AugmentationBaremeService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/augmentation_bareme');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(augmentationBareme: IAugmentationBareme): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(augmentationBareme);
    return this.http
      .post<IAugmentationBareme>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(augmentationBareme: IAugmentationBareme): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(augmentationBareme);
    return this.http
      .put<IAugmentationBareme>(`${this.resourceUrl}/${getAugmentationBaremeIdentifier(augmentationBareme) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(augmentationBareme: IAugmentationBareme): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(augmentationBareme);
    return this.http
      .patch<IAugmentationBareme>(`${this.resourceUrl}/${getAugmentationBaremeIdentifier(augmentationBareme) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAugmentationBareme>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAugmentationBareme[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAugmentationBaremeToCollectionIfMissing(
    augmentationBaremeCollection: IAugmentationBareme[],
    ...augmentationBaremesToCheck: (IAugmentationBareme | null | undefined)[]
  ): IAugmentationBareme[] {
    const augmentationBaremes: IAugmentationBareme[] = augmentationBaremesToCheck.filter(isPresent);
    if (augmentationBaremes.length > 0) {
      const augmentationBaremeCollectionIdentifiers = augmentationBaremeCollection.map(
        augmentationBaremeItem => getAugmentationBaremeIdentifier(augmentationBaremeItem)!
      );
      const augmentationBaremesToAdd = augmentationBaremes.filter(augmentationBaremeItem => {
        const augmentationBaremeIdentifier = getAugmentationBaremeIdentifier(augmentationBaremeItem);
        if (augmentationBaremeIdentifier == null || augmentationBaremeCollectionIdentifiers.includes(augmentationBaremeIdentifier)) {
          return false;
        }
        augmentationBaremeCollectionIdentifiers.push(augmentationBaremeIdentifier);
        return true;
      });
      return [...augmentationBaremesToAdd, ...augmentationBaremeCollection];
    }
    return augmentationBaremeCollection;
  }

  protected convertDateFromClient(augmentationBareme: IAugmentationBareme): IAugmentationBareme {
    return Object.assign({}, augmentationBareme, {
      dateInsert: augmentationBareme.dateInsert?.isValid() ? augmentationBareme.dateInsert.toJSON() : undefined,
      dateUpdate: augmentationBareme.dateUpdate?.isValid() ? augmentationBareme.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((augmentationBareme: IAugmentationBareme) => {
        augmentationBareme.dateInsert = augmentationBareme.dateInsert ? dayjs(augmentationBareme.dateInsert) : undefined;
        augmentationBareme.dateUpdate = augmentationBareme.dateUpdate ? dayjs(augmentationBareme.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
