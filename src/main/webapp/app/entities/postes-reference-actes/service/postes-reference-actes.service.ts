import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPostesReferenceActes, getPostesReferenceActesIdentifier } from '../postes-reference-actes.model';

export type EntityResponseType = HttpResponse<IPostesReferenceActes>;
export type EntityArrayResponseType = HttpResponse<IPostesReferenceActes[]>;

@Injectable({ providedIn: 'root' })
export class PostesReferenceActesService {
  protected resourceUrl = this.applicationConfigService.getEndpointForBackend('api/postes-reference-actes');
  protected resourceUrlCode = this.applicationConfigService.getEndpointForBackend('api/postesReferenceActes/code-postes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(postesReferenceActes: IPostesReferenceActes): Observable<EntityResponseType> {
    return this.http.post<IPostesReferenceActes>(this.resourceUrl, postesReferenceActes, { observe: 'response' });
  }

  update(postesReferenceActes: IPostesReferenceActes): Observable<EntityResponseType> {
    return this.http.put<IPostesReferenceActes>(
      `${this.resourceUrl}/${getPostesReferenceActesIdentifier(postesReferenceActes) as number}`,
      postesReferenceActes,
      { observe: 'response' }
    );
  }

  partialUpdate(postesReferenceActes: IPostesReferenceActes): Observable<EntityResponseType> {
    return this.http.patch<IPostesReferenceActes>(
      `${this.resourceUrl}/${getPostesReferenceActesIdentifier(postesReferenceActes) as number}`,
      postesReferenceActes,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPostesReferenceActes>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPostesReferenceActes[]>(this.resourceUrl, { params: options, observe: 'response' });
  }
  findByCode(code: string): Observable<EntityArrayResponseType> {
    return this.http.get<IPostesReferenceActes[]>(`${this.resourceUrlCode}?code=${code}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPostesReferenceActesToCollectionIfMissing(
    postesReferenceActesCollection: IPostesReferenceActes[],
    ...postesReferenceActesToCheck: (IPostesReferenceActes | null | undefined)[]
  ): IPostesReferenceActes[] {
    const postesReferenceActes: IPostesReferenceActes[] = postesReferenceActesToCheck.filter(isPresent);
    if (postesReferenceActes.length > 0) {
      const postesReferenceActesCollectionIdentifiers = postesReferenceActesCollection.map(
        postesReferenceActesItem => getPostesReferenceActesIdentifier(postesReferenceActesItem)!
      );
      const postesReferenceActesToAdd = postesReferenceActes.filter(postesReferenceActesItem => {
        const postesReferenceActesIdentifier = getPostesReferenceActesIdentifier(postesReferenceActesItem);
        if (postesReferenceActesIdentifier == null || postesReferenceActesCollectionIdentifiers.includes(postesReferenceActesIdentifier)) {
          return false;
        }
        postesReferenceActesCollectionIdentifiers.push(postesReferenceActesIdentifier);
        return true;
      });
      return [...postesReferenceActesToAdd, ...postesReferenceActesCollection];
    }
    return postesReferenceActesCollection;
  }
}
