import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPages, getPagesIdentifier } from '../pages.model';

import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { SERVER_API_URL_BACKEND } from 'app/app.constants';

export type EntityResponseType = HttpResponse<IPages>;
export type EntityArrayResponseType = HttpResponse<IPages[]>;

@Injectable({ providedIn: 'root' })
export class PagesService {
  // public resourceUrl = this.applicationConfigService.getEndpointForBackend('api/pages');
  public resourceUrl = SERVER_API_URL_BACKEND + 'api/pages';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private authServerProvider: AuthServerProvider
  ) {}

  create(pages: IPages): Observable<EntityResponseType> {
    return this.http.post<IPages>(this.resourceUrl, pages, { observe: 'response' });
  }

  update(pages: IPages): Observable<EntityResponseType> {
    return this.http.put<IPages>(`${this.resourceUrl}/${getPagesIdentifier(pages) as number}`, pages, { observe: 'response' });
  }

  partialUpdate(pages: IPages): Observable<EntityResponseType> {
    return this.http.patch<IPages>(`${this.resourceUrl}/${getPagesIdentifier(pages) as number}`, pages, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPages>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findPagesByModulesId(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<IPages[]>(`${this.resourceUrl}/modules/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPages[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPagesToCollectionIfMissing(pagesCollection: IPages[], ...pagesToCheck: (IPages | null | undefined)[]): IPages[] {
    const pages: IPages[] = pagesToCheck.filter(isPresent);
    if (pages.length > 0) {
      const pagesCollectionIdentifiers = pagesCollection.map(pagesItem => getPagesIdentifier(pagesItem)!);
      const pagesToAdd = pages.filter(pagesItem => {
        const pagesIdentifier = getPagesIdentifier(pagesItem);
        if (pagesIdentifier == null || pagesCollectionIdentifiers.includes(pagesIdentifier)) {
          return false;
        }
        pagesCollectionIdentifiers.push(pagesIdentifier);
        return true;
      });
      return [...pagesToAdd, ...pagesCollection];
    }
    return pagesCollection;
  }
}
