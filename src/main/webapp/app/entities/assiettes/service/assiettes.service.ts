import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAssiettes, getAssiettesIdentifier } from '../assiettes.model';

export type EntityResponseType = HttpResponse<IAssiettes>;
export type EntityArrayResponseType = HttpResponse<IAssiettes[]>;

@Injectable({ providedIn: 'root' })
export class AssiettesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/assiettes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(assiettes: IAssiettes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assiettes);
    return this.http
      .post<IAssiettes>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(assiettes: IAssiettes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assiettes);
    return this.http
      .put<IAssiettes>(`${this.resourceUrl}/${getAssiettesIdentifier(assiettes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(assiettes: IAssiettes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(assiettes);
    return this.http
      .patch<IAssiettes>(`${this.resourceUrl}/${getAssiettesIdentifier(assiettes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IAssiettes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IAssiettes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAssiettesToCollectionIfMissing(
    assiettesCollection: IAssiettes[],
    ...assiettesToCheck: (IAssiettes | null | undefined)[]
  ): IAssiettes[] {
    const assiettes: IAssiettes[] = assiettesToCheck.filter(isPresent);
    if (assiettes.length > 0) {
      const assiettesCollectionIdentifiers = assiettesCollection.map(assiettesItem => getAssiettesIdentifier(assiettesItem)!);
      const assiettesToAdd = assiettes.filter(assiettesItem => {
        const assiettesIdentifier = getAssiettesIdentifier(assiettesItem);
        if (assiettesIdentifier == null || assiettesCollectionIdentifiers.includes(assiettesIdentifier)) {
          return false;
        }
        assiettesCollectionIdentifiers.push(assiettesIdentifier);
        return true;
      });
      return [...assiettesToAdd, ...assiettesCollection];
    }
    return assiettesCollection;
  }

  protected convertDateFromClient(assiettes: IAssiettes): IAssiettes {
    return Object.assign({}, assiettes, {
      userdateInsert: assiettes.userdateInsert?.isValid() ? assiettes.userdateInsert.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.userdateInsert = res.body.userdateInsert ? dayjs(res.body.userdateInsert) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((assiettes: IAssiettes) => {
        assiettes.userdateInsert = assiettes.userdateInsert ? dayjs(assiettes.userdateInsert) : undefined;
      });
    }
    return res;
  }
}
