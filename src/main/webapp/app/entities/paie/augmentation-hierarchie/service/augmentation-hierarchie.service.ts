import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAugmentationHierarchie, getAugmentationHierarchieIdentifier } from '../augmentation-hierarchie.model';

export type EntityResponseType = HttpResponse<IAugmentationHierarchie>;
export type EntityArrayResponseType = HttpResponse<IAugmentationHierarchie[]>;

@Injectable({ providedIn: 'root' })
export class AugmentationHierarchieService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/augmentation-hierarchie');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(augmentationHierarchie: IAugmentationHierarchie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(augmentationHierarchie);
    return this.http
      .post<IAugmentationHierarchie>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(augmentationHierarchie: IAugmentationHierarchie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(augmentationHierarchie);
    return this.http
      .put<IAugmentationHierarchie>(`${this.resourceUrl}/${getAugmentationHierarchieIdentifier(augmentationHierarchie) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(augmentationHierarchie: IAugmentationHierarchie): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(augmentationHierarchie);
    return this.http
      .patch<IAugmentationHierarchie>(
        `${this.resourceUrl}/${getAugmentationHierarchieIdentifier(augmentationHierarchie) as number}`,
        copy,
        { observe: 'response' }
      )
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAugmentationHierarchie>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAugmentationHierarchie[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAugmentationHierarchieToCollectionIfMissing(
    augmentationHierarchieCollection: IAugmentationHierarchie[],
    ...augmentationHierarchiesToCheck: (IAugmentationHierarchie | null | undefined)[]
  ): IAugmentationHierarchie[] {
    const augmentationHierarchies: IAugmentationHierarchie[] = augmentationHierarchiesToCheck.filter(isPresent);
    if (augmentationHierarchies.length > 0) {
      const augmentationHierarchieCollectionIdentifiers = augmentationHierarchieCollection.map(
        augmentationHierarchieItem => getAugmentationHierarchieIdentifier(augmentationHierarchieItem)!
      );
      const augmentationHierarchiesToAdd = augmentationHierarchies.filter(augmentationHierarchieItem => {
        const augmentationHierarchieIdentifier = getAugmentationHierarchieIdentifier(augmentationHierarchieItem);
        if (
          augmentationHierarchieIdentifier == null ||
          augmentationHierarchieCollectionIdentifiers.includes(augmentationHierarchieIdentifier)
        ) {
          return false;
        }
        augmentationHierarchieCollectionIdentifiers.push(augmentationHierarchieIdentifier);
        return true;
      });
      return [...augmentationHierarchiesToAdd, ...augmentationHierarchieCollection];
    }
    return augmentationHierarchieCollection;
  }

  protected convertDateFromClient(augmentationHierarchie: IAugmentationHierarchie): IAugmentationHierarchie {
    return Object.assign({}, augmentationHierarchie, {
      dateInsert: augmentationHierarchie.dateInsert?.isValid() ? augmentationHierarchie.dateInsert.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((augmentationHierarchie: IAugmentationHierarchie) => {
        augmentationHierarchie.dateInsert = augmentationHierarchie.dateInsert ? dayjs(augmentationHierarchie.dateInsert) : undefined;
      });
    }
    return res;
  }
}
