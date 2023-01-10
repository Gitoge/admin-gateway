import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistoAugmentation, getHistoAugmentationIdentifier } from '../histo-augmentation.model';

export type EntityResponseType = HttpResponse<IHistoAugmentation>;
export type EntityArrayResponseType = HttpResponse<IHistoAugmentation[]>;

@Injectable({ providedIn: 'root' })
export class HistoAugmentationService {
  protected resourceUrl = this.applicationConfigService.getEndpointForPaie('api/histo-augmentations');
  protected resourceUrlIndice = this.applicationConfigService.getEndpointForPaie('api/histo-augmentations/indice');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(histoAugmentation: IHistoAugmentation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(histoAugmentation);
    return this.http
      .post<IHistoAugmentation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(histoAugmentation: IHistoAugmentation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(histoAugmentation);
    return this.http
      .put<IHistoAugmentation>(`${this.resourceUrl}/${getHistoAugmentationIdentifier(histoAugmentation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(histoAugmentation: IHistoAugmentation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(histoAugmentation);
    return this.http
      .patch<IHistoAugmentation>(`${this.resourceUrl}/${getHistoAugmentationIdentifier(histoAugmentation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IHistoAugmentation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHistoAugmentation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  queryIndice(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IHistoAugmentation[]>(this.resourceUrlIndice, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHistoAugmentationToCollectionIfMissing(
    histoAugmentationCollection: IHistoAugmentation[],
    ...histoAugmentationsToCheck: (IHistoAugmentation | null | undefined)[]
  ): IHistoAugmentation[] {
    const histoAugmentations: IHistoAugmentation[] = histoAugmentationsToCheck.filter(isPresent);
    if (histoAugmentations.length > 0) {
      const histoAugmentationCollectionIdentifiers = histoAugmentationCollection.map(
        histoAugmentationItem => getHistoAugmentationIdentifier(histoAugmentationItem)!
      );
      const histoAugmentationsToAdd = histoAugmentations.filter(histoAugmentationItem => {
        const histoAugmentationIdentifier = getHistoAugmentationIdentifier(histoAugmentationItem);
        if (histoAugmentationIdentifier == null || histoAugmentationCollectionIdentifiers.includes(histoAugmentationIdentifier)) {
          return false;
        }
        histoAugmentationCollectionIdentifiers.push(histoAugmentationIdentifier);
        return true;
      });
      return [...histoAugmentationsToAdd, ...histoAugmentationCollection];
    }
    return histoAugmentationCollection;
  }

  protected convertDateFromClient(histoAugmentation: IHistoAugmentation): IHistoAugmentation {
    return Object.assign({}, histoAugmentation, {
      date: histoAugmentation.date?.isValid() ? histoAugmentation.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((histoAugmentation: IHistoAugmentation) => {
        histoAugmentation.date = histoAugmentation.date ? dayjs(histoAugmentation.date) : undefined;
      });
    }
    return res;
  }
}
