import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConvention, getConventionIdentifier } from '../convention.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IConvention>;
export type EntityArrayResponseType = HttpResponse<IConvention[]>;

@Injectable({ providedIn: 'root' })
export class ConventionService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/conventions');

  private header: HttpHeaders;

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private authServerProvider: AuthServerProvider
  ) {
    this.header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authServerProvider.getToken())
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  create(convention: IConvention): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(convention);
    return this.http
      .post<IConvention>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(convention: IConvention): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(convention);
    return this.http
      .put<IConvention>(`${this.resourceUrl}/${getConventionIdentifier(convention) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(convention: IConvention): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(convention);
    return this.http
      .patch<IConvention>(`${this.resourceUrl}/${getConventionIdentifier(convention) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IConvention>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findLibelle(libelle: string): Observable<EntityArrayResponseType> {
    return this.http.get<IConvention[]>(`${this.resourceUrl}/libelle?libelle=${libelle}`, { headers: this.header, observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IConvention[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConventionToCollectionIfMissing(
    conventionCollection: IConvention[],
    ...conventionsToCheck: (IConvention | null | undefined)[]
  ): IConvention[] {
    const conventions: IConvention[] = conventionsToCheck.filter(isPresent);
    if (conventions.length > 0) {
      const conventionCollectionIdentifiers = conventionCollection.map(conventionItem => getConventionIdentifier(conventionItem)!);
      const conventionsToAdd = conventions.filter(conventionItem => {
        const conventionIdentifier = getConventionIdentifier(conventionItem);
        if (conventionIdentifier == null || conventionCollectionIdentifiers.includes(conventionIdentifier)) {
          return false;
        }
        conventionCollectionIdentifiers.push(conventionIdentifier);
        return true;
      });
      return [...conventionsToAdd, ...conventionCollection];
    }
    return conventionCollection;
  }

  protected convertDateFromClient(convention: IConvention): IConvention {
    return Object.assign({}, convention, {
      dateInsert: convention.dateInsert?.isValid() ? convention.dateInsert.toJSON() : undefined,
      dateUpdate: convention.dateUpdate?.isValid() ? convention.dateUpdate.toJSON() : undefined,
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
      res.body.forEach((convention: IConvention) => {
        convention.dateInsert = convention.dateInsert ? dayjs(convention.dateInsert) : undefined;
        convention.dateUpdate = convention.dateUpdate ? dayjs(convention.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
