import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IModules, getModulesIdentifier } from '../modules.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { IPages } from 'app/entities/pages/pages.model';
import { SERVER_API_URL_BACKEND } from 'app/app.constants';

export type EntityResponseType = HttpResponse<IModules>;
export type EntityArrayResponseType = HttpResponse<IModules[]>;

export type EntityArrayResponseTypePages = HttpResponse<IPages[]>;

@Injectable({ providedIn: 'root' })
export class ModulesService {
  public resourceUrl = this.applicationConfigService.getEndpointForBackend('api/modules');

  public resourceUrlActifs = this.applicationConfigService.getEndpointForBackend('api/modules/actifs');

  public resourceUrlPagesOfModules = this.applicationConfigService.getEndpointForBackend('api/pages/modules');

  protected resourceUrlModulesRecherche = SERVER_API_URL_BACKEND + 'api/modules/recherchemotsclés';

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private authServerProvider: AuthServerProvider
  ) {}

  create(modules: IModules): Observable<EntityResponseType> {
    return this.http.post<IModules>(this.resourceUrl, modules, { observe: 'response' });
  }

  partialUpdate(modules: IModules): Observable<EntityResponseType> {
    return this.http.patch<IModules>(`${this.resourceUrl}/${getModulesIdentifier(modules) as number}`, modules, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IModules>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findModulesByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IModules[]>(`${this.resourceUrlModulesRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IModules[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  queryActifs(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IModules[]>(this.resourceUrlActifs, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addModulesToCollectionIfMissing(modulesCollection: IModules[], ...modulesToCheck: (IModules | null | undefined)[]): IModules[] {
    const modules: IModules[] = modulesToCheck.filter(isPresent);
    if (modules.length > 0) {
      const modulesCollectionIdentifiers = modulesCollection.map(modulesItem => getModulesIdentifier(modulesItem)!);
      const modulesToAdd = modules.filter(modulesItem => {
        const modulesIdentifier = getModulesIdentifier(modulesItem);
        if (modulesIdentifier == null || modulesCollectionIdentifiers.includes(modulesIdentifier)) {
          return false;
        }
        modulesCollectionIdentifiers.push(modulesIdentifier);
        return true;
      });
      return [...modulesToAdd, ...modulesCollection];
    }
    return modulesCollection;
  }

  update(modules: IModules): Observable<EntityResponseType> {
    return this.http.put<IModules>(`${this.resourceUrl}/${getModulesIdentifier(modules) as number}`, modules, { observe: 'response' });
  }

  findPages(id: number): Observable<EntityArrayResponseTypePages> {
    return this.http.get<IPages[]>(`${this.resourceUrlPagesOfModules}/${id}`, { observe: 'response' });
  }
}
