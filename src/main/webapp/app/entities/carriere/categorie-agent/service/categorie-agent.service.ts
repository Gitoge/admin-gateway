import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICategorieAgent, getCategorieAgentIdentifier } from '../categorie-agent.model';

export type EntityResponseType = HttpResponse<ICategorieAgent>;
export type EntityArrayResponseType = HttpResponse<ICategorieAgent[]>;

@Injectable({ providedIn: 'root' })
export class CategorieAgentService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/categorie-agents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(categorieAgent: ICategorieAgent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categorieAgent);
    return this.http
      .post<ICategorieAgent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(categorieAgent: ICategorieAgent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categorieAgent);
    return this.http
      .put<ICategorieAgent>(`${this.resourceUrl}/${getCategorieAgentIdentifier(categorieAgent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(categorieAgent: ICategorieAgent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(categorieAgent);
    return this.http
      .patch<ICategorieAgent>(`${this.resourceUrl}/${getCategorieAgentIdentifier(categorieAgent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICategorieAgent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICategorieAgent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCategorieAgentToCollectionIfMissing(
    categorieAgentCollection: ICategorieAgent[],
    ...categorieAgentsToCheck: (ICategorieAgent | null | undefined)[]
  ): ICategorieAgent[] {
    const categorieAgents: ICategorieAgent[] = categorieAgentsToCheck.filter(isPresent);
    if (categorieAgents.length > 0) {
      const categorieAgentCollectionIdentifiers = categorieAgentCollection.map(
        categorieAgentItem => getCategorieAgentIdentifier(categorieAgentItem)!
      );
      const categorieAgentsToAdd = categorieAgents.filter(categorieAgentItem => {
        const categorieAgentIdentifier = getCategorieAgentIdentifier(categorieAgentItem);
        if (categorieAgentIdentifier == null || categorieAgentCollectionIdentifiers.includes(categorieAgentIdentifier)) {
          return false;
        }
        categorieAgentCollectionIdentifiers.push(categorieAgentIdentifier);
        return true;
      });
      return [...categorieAgentsToAdd, ...categorieAgentCollection];
    }
    return categorieAgentCollection;
  }

  protected convertDateFromClient(categorieAgent: ICategorieAgent): ICategorieAgent {
    return Object.assign({}, categorieAgent, {
      dateInsert: categorieAgent.dateInsert?.isValid() ? categorieAgent.dateInsert.toJSON() : undefined,
      dateUpdate: categorieAgent.dateUpdate?.isValid() ? categorieAgent.dateUpdate.toJSON() : undefined,
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
      res.body.forEach((categorieAgent: ICategorieAgent) => {
        categorieAgent.dateInsert = categorieAgent.dateInsert ? dayjs(categorieAgent.dateInsert) : undefined;
        categorieAgent.dateUpdate = categorieAgent.dateUpdate ? dayjs(categorieAgent.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
