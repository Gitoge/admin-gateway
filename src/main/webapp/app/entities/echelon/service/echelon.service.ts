import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEchelon, getEchelonIdentifier } from '../echelon.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { IEmoluments } from '../../paie/emoluments/emoluments.model';

export type EntityResponseType = HttpResponse<IEchelon>;
export type EntityArrayResponseType = HttpResponse<IEchelon[]>;

@Injectable({ providedIn: 'root' })
export class EchelonService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/echelons');
  protected resourceUrlById = this.applicationConfigService.getEndpointForBackend('api/echelonsById');
  protected resourceUrlCodeEchelon = this.applicationConfigService.getEndpointForBackend('api/echelons/code-echelon');

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

  create(echelon: IEchelon): Observable<EntityResponseType> {
    return this.http.post<IEchelon>(this.resourceUrl, echelon, { observe: 'response' });
  }

  update(echelon: IEchelon): Observable<EntityResponseType> {
    return this.http.put<IEchelon>(`${this.resourceUrl}/${getEchelonIdentifier(echelon) as number}`, echelon, { observe: 'response' });
  }

  partialUpdate(echelon: IEchelon): Observable<EntityResponseType> {
    return this.http.patch<IEchelon>(`${this.resourceUrl}/${getEchelonIdentifier(echelon) as number}`, echelon, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEchelon>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IEchelon[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  findByCode(code: string): Observable<EntityResponseType> {
    return this.http.get<IEchelon>(`${this.resourceUrlCodeEchelon}?code=${code}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEchelon[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  getEchelonById(echelonId: number): Observable<any> {
    return this.http.get<IEchelon[]>(`${this.resourceUrlById}?echelonId=${echelonId}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEchelonToCollectionIfMissing(echelonCollection: IEchelon[], ...echelonsToCheck: (IEchelon | null | undefined)[]): IEchelon[] {
    const echelons: IEchelon[] = echelonsToCheck.filter(isPresent);
    if (echelons.length > 0) {
      const echelonCollectionIdentifiers = echelonCollection.map(echelonItem => getEchelonIdentifier(echelonItem)!);
      const echelonsToAdd = echelons.filter(echelonItem => {
        const echelonIdentifier = getEchelonIdentifier(echelonItem);
        if (echelonIdentifier == null || echelonCollectionIdentifiers.includes(echelonIdentifier)) {
          return false;
        }
        echelonCollectionIdentifiers.push(echelonIdentifier);
        return true;
      });
      return [...echelonsToAdd, ...echelonCollection];
    }
    return echelonCollection;
  }
}
