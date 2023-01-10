import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITypeDestinataires, getTypeDestinatairesIdentifier } from '../type-destinataires.model';

export type EntityResponseType = HttpResponse<ITypeDestinataires>;
export type EntityArrayResponseType = HttpResponse<ITypeDestinataires[]>;

@Injectable({ providedIn: 'root' })
export class TypeDestinatairesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/type-destinataires');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(typeDestinataires: ITypeDestinataires): Observable<EntityResponseType> {
    return this.http.post<ITypeDestinataires>(this.resourceUrl, typeDestinataires, { observe: 'response' });
  }

  update(typeDestinataires: ITypeDestinataires): Observable<EntityResponseType> {
    return this.http.put<ITypeDestinataires>(
      `${this.resourceUrl}/${getTypeDestinatairesIdentifier(typeDestinataires) as number}`,
      typeDestinataires,
      { observe: 'response' }
    );
  }

  partialUpdate(typeDestinataires: ITypeDestinataires): Observable<EntityResponseType> {
    return this.http.patch<ITypeDestinataires>(
      `${this.resourceUrl}/${getTypeDestinatairesIdentifier(typeDestinataires) as number}`,
      typeDestinataires,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITypeDestinataires>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITypeDestinataires[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTypeDestinatairesToCollectionIfMissing(
    typeDestinatairesCollection: ITypeDestinataires[],
    ...typeDestinatairesToCheck: (ITypeDestinataires | null | undefined)[]
  ): ITypeDestinataires[] {
    const typeDestinataires: ITypeDestinataires[] = typeDestinatairesToCheck.filter(isPresent);
    if (typeDestinataires.length > 0) {
      const typeDestinatairesCollectionIdentifiers = typeDestinatairesCollection.map(
        typeDestinatairesItem => getTypeDestinatairesIdentifier(typeDestinatairesItem)!
      );
      const typeDestinatairesToAdd = typeDestinataires.filter(typeDestinatairesItem => {
        const typeDestinatairesIdentifier = getTypeDestinatairesIdentifier(typeDestinatairesItem);
        if (typeDestinatairesIdentifier == null || typeDestinatairesCollectionIdentifiers.includes(typeDestinatairesIdentifier)) {
          return false;
        }
        typeDestinatairesCollectionIdentifiers.push(typeDestinatairesIdentifier);
        return true;
      });
      return [...typeDestinatairesToAdd, ...typeDestinatairesCollection];
    }
    return typeDestinatairesCollection;
  }
}
