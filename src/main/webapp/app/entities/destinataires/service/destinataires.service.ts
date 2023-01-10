import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDestinataires, getDestinatairesIdentifier } from '../destinataires.model';

export type EntityResponseType = HttpResponse<IDestinataires>;
export type EntityArrayResponseType = HttpResponse<IDestinataires[]>;

@Injectable({ providedIn: 'root' })
export class DestinatairesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/destinataires');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(destinataires: IDestinataires): Observable<EntityResponseType> {
    return this.http.post<IDestinataires>(this.resourceUrl, destinataires, { observe: 'response' });
  }

  update(destinataires: IDestinataires): Observable<EntityResponseType> {
    return this.http.put<IDestinataires>(`${this.resourceUrl}/${getDestinatairesIdentifier(destinataires) as number}`, destinataires, {
      observe: 'response',
    });
  }

  partialUpdate(destinataires: IDestinataires): Observable<EntityResponseType> {
    return this.http.patch<IDestinataires>(`${this.resourceUrl}/${getDestinatairesIdentifier(destinataires) as number}`, destinataires, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDestinataires>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDestinataires[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDestinatairesToCollectionIfMissing(
    destinatairesCollection: IDestinataires[],
    ...destinatairesToCheck: (IDestinataires | null | undefined)[]
  ): IDestinataires[] {
    const destinataires: IDestinataires[] = destinatairesToCheck.filter(isPresent);
    if (destinataires.length > 0) {
      const destinatairesCollectionIdentifiers = destinatairesCollection.map(
        destinatairesItem => getDestinatairesIdentifier(destinatairesItem)!
      );
      const destinatairesToAdd = destinataires.filter(destinatairesItem => {
        const destinatairesIdentifier = getDestinatairesIdentifier(destinatairesItem);
        if (destinatairesIdentifier == null || destinatairesCollectionIdentifiers.includes(destinatairesIdentifier)) {
          return false;
        }
        destinatairesCollectionIdentifiers.push(destinatairesIdentifier);
        return true;
      });
      return [...destinatairesToAdd, ...destinatairesCollection];
    }
    return destinatairesCollection;
  }
}
