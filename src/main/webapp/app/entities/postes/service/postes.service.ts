import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPostes, getPostesIdentifier } from '../postes.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IPostes>;
export type EntityArrayResponseType = HttpResponse<IPostes[]>;

@Injectable({ providedIn: 'root' })
export class PostesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/postes');
  protected resourceUrlList = this.applicationConfigService.getEndpointForBackend('api/listPostes');
  protected resourceUrlCodePoste = this.applicationConfigService.getEndpointForBackend('api/postes/code-postes');

  protected resourceUrlPostesRecherche = this.applicationConfigService.getEndpointForBackend('api/postes/recherche');

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
  create(postes: IPostes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(postes);
    return this.http
      .post<IPostes>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(postes: IPostes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(postes);
    return this.http
      .put<IPostes>(`${this.resourceUrl}/${getPostesIdentifier(postes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(postes: IPostes): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(postes);
    return this.http
      .patch<IPostes>(`${this.resourceUrl}/${getPostesIdentifier(postes) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPostes>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IPostes[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  findByCode(code: string): Observable<EntityResponseType> {
    return this.http
      .get<IPostes>(`${this.resourceUrlCodePoste}?code=${code}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByGrade(gradeId: number): Observable<EntityResponseType> {
    return this.http
      .get<IPostes>(`${this.resourceUrl}/grade?gradeId=${gradeId}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByEmplois(emploisId: number): Observable<EntityResponseType> {
    return this.http
      .get<IPostes>(`${this.resourceUrl}/emplois?emploisId=${emploisId}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findByAssiette(assietteId: number): Observable<EntityResponseType> {
    return this.http
      .get<IPostes>(`${this.resourceUrl}/assiettes?assietteId=${assietteId}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPostes[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findPostesByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPostes[]>(`${this.resourceUrlPostesRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  queryList(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPostes[]>(this.resourceUrlList, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPostesToCollectionIfMissing(postesCollection: IPostes[], ...postesToCheck: (IPostes | null | undefined)[]): IPostes[] {
    const postes: IPostes[] = postesToCheck.filter(isPresent);
    if (postes.length > 0) {
      const postesCollectionIdentifiers = postesCollection.map(postesItem => getPostesIdentifier(postesItem)!);
      const postesToAdd = postes.filter(postesItem => {
        const postesIdentifier = getPostesIdentifier(postesItem);
        if (postesIdentifier == null || postesCollectionIdentifiers.includes(postesIdentifier)) {
          return false;
        }
        postesCollectionIdentifiers.push(postesIdentifier);
        return true;
      });
      return [...postesToAdd, ...postesCollection];
    }
    return postesCollection;
  }

  protected convertDateFromClient(postes: IPostes): IPostes {
    return Object.assign({}, postes, {
      dateEffet: postes.dateEffet?.isValid() ? postes.dateEffet.format(DATE_FORMAT) : undefined,
      dateEcheance: postes.dateEcheance?.isValid() ? postes.dateEcheance.format(DATE_FORMAT) : undefined,
      formule: postes.formule?.isValid() ? postes.formule.format(DATE_FORMAT) : undefined,
      dateInsert: postes.dateInsert?.isValid() ? postes.dateInsert.toJSON() : undefined,
      dateUpdate: postes.dateUpdate?.isValid() ? postes.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateEffet = res.body.dateEffet ? dayjs(res.body.dateEffet) : undefined;
      res.body.dateEcheance = res.body.dateEcheance ? dayjs(res.body.dateEcheance) : undefined;
      res.body.formule = res.body.formule ? dayjs(res.body.formule) : undefined;
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((postes: IPostes) => {
        postes.dateEffet = postes.dateEffet ? dayjs(postes.dateEffet) : undefined;
        postes.dateEcheance = postes.dateEcheance ? dayjs(postes.dateEcheance) : undefined;
        postes.formule = postes.formule ? dayjs(postes.formule) : undefined;
        postes.dateInsert = postes.dateInsert ? dayjs(postes.dateInsert) : undefined;
        postes.dateUpdate = postes.dateUpdate ? dayjs(postes.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
