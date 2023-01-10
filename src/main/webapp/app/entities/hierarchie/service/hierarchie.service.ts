import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHierarchie, getHierarchieIdentifier } from '../hierarchie.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

export type EntityResponseType = HttpResponse<IHierarchie>;
export type EntityArrayResponseType = HttpResponse<IHierarchie[]>;

@Injectable({ providedIn: 'root' })
export class HierarchieService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/hierarchies');

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

  create(hierarchie: IHierarchie): Observable<EntityResponseType> {
    return this.http.post<IHierarchie>(this.resourceUrl, hierarchie, { observe: 'response' });
  }

  update(hierarchie: IHierarchie): Observable<EntityResponseType> {
    return this.http.put<IHierarchie>(`${this.resourceUrl}/${getHierarchieIdentifier(hierarchie) as number}`, hierarchie, {
      observe: 'response',
    });
  }

  partialUpdate(hierarchie: IHierarchie): Observable<EntityResponseType> {
    return this.http.patch<IHierarchie>(`${this.resourceUrl}/${getHierarchieIdentifier(hierarchie) as number}`, hierarchie, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHierarchie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IHierarchie[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  findLibelle(id: number): Observable<EntityResponseType> {
    return this.http.get<IHierarchie>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHierarchie[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHierarchieToCollectionIfMissing(
    hierarchieCollection: IHierarchie[],
    ...hierarchiesToCheck: (IHierarchie | null | undefined)[]
  ): IHierarchie[] {
    const hierarchies: IHierarchie[] = hierarchiesToCheck.filter(isPresent);
    if (hierarchies.length > 0) {
      const hierarchieCollectionIdentifiers = hierarchieCollection.map(hierarchieItem => getHierarchieIdentifier(hierarchieItem)!);
      const hierarchiesToAdd = hierarchies.filter(hierarchieItem => {
        const hierarchieIdentifier = getHierarchieIdentifier(hierarchieItem);
        if (hierarchieIdentifier == null || hierarchieCollectionIdentifiers.includes(hierarchieIdentifier)) {
          return false;
        }
        hierarchieCollectionIdentifiers.push(hierarchieIdentifier);
        return true;
      });
      return [...hierarchiesToAdd, ...hierarchieCollection];
    }
    return hierarchieCollection;
  }
}
