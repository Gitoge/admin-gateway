import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IService, getServiceIdentifier } from '../service.model';
import { SERVER_API_URL_BACKEND } from 'app/app.constants';

export type EntityResponseType = HttpResponse<IService>;
export type EntityArrayResponseType = HttpResponse<IService[]>;

@Injectable({ providedIn: 'root' })
export class ServiceService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/services');

  protected resourceUrlEtab = this.applicationConfigService.getEndpointForBackend('api/services/etablissement');

  protected resourceUrlServiceRecherche = SERVER_API_URL_BACKEND + 'api/services/recherchemotsclés';

  protected resourceUrlCodeServices = this.applicationConfigService.getEndpointForBackend('api/services/etablissement/code-service');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(service: IService): Observable<EntityResponseType> {
    return this.http.post<IService>(this.resourceUrl, service, { observe: 'response' });
  }

  update(service: IService): Observable<EntityResponseType> {
    return this.http.put<IService>(`${this.resourceUrl}/${getServiceIdentifier(service) as number}`, service, { observe: 'response' });
  }

  partialUpdate(service: IService): Observable<EntityResponseType> {
    return this.http.patch<IService>(`${this.resourceUrl}/${getServiceIdentifier(service) as number}`, service, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IService>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findServicesByMotsCles(motCles: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IService[]>(`${this.resourceUrlServiceRecherche}?motCles=${motCles}`, {
      params: options,
      observe: 'response',
    });
  }

  findServicesByEtablissement(etablissementId: number): Observable<EntityResponseType> {
    return this.http.get<IService>(`${this.resourceUrlEtab}?etablissementId=${etablissementId}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IService[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  recherche(motCle: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IService[]>(`${this.resourceUrl}/recherches?motCle=${motCle}`, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByCode(etablissementId: number, code: string): Observable<EntityResponseType> {
    return this.http.get<IService>(`${this.resourceUrlCodeServices}?etablissementId=${etablissementId}&code=${code}`, {
      observe: 'response',
    });
  }

  addServiceToCollectionIfMissing(serviceCollection: IService[], ...servicesToCheck: (IService | null | undefined)[]): IService[] {
    const services: IService[] = servicesToCheck.filter(isPresent);
    if (services.length > 0) {
      const serviceCollectionIdentifiers = serviceCollection.map(serviceItem => getServiceIdentifier(serviceItem)!);
      const servicesToAdd = services.filter(serviceItem => {
        const serviceIdentifier = getServiceIdentifier(serviceItem);
        if (serviceIdentifier == null || serviceCollectionIdentifiers.includes(serviceIdentifier)) {
          return false;
        }
        serviceCollectionIdentifiers.push(serviceIdentifier);
        return true;
      });
      return [...servicesToAdd, ...serviceCollection];
    }
    return serviceCollection;
  }
}
