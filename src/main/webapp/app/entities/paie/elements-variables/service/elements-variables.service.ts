import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IElementsVariables, getElementsVariablesIdentifier } from '../elements-variables.model';

export type EntityResponseType = HttpResponse<IElementsVariables>;
export type EntityArrayResponseType = HttpResponse<IElementsVariables[]>;

@Injectable({ providedIn: 'root' })
export class ElementsVariablesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/elements-variables', 'paie');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(elementsVariables: IElementsVariables): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(elementsVariables);
    return this.http
      .post<IElementsVariables>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(elementsVariables: IElementsVariables): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(elementsVariables);
    return this.http
      .put<IElementsVariables>(`${this.resourceUrl}/${getElementsVariablesIdentifier(elementsVariables) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(elementsVariables: IElementsVariables): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(elementsVariables);
    return this.http
      .patch<IElementsVariables>(`${this.resourceUrl}/${getElementsVariablesIdentifier(elementsVariables) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IElementsVariables>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IElementsVariables[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addElementsVariablesToCollectionIfMissing(
    elementsVariablesCollection: IElementsVariables[],
    ...elementsVariablesToCheck: (IElementsVariables | null | undefined)[]
  ): IElementsVariables[] {
    const elementsVariables: IElementsVariables[] = elementsVariablesToCheck.filter(isPresent);
    if (elementsVariables.length > 0) {
      const elementsVariablesCollectionIdentifiers = elementsVariablesCollection.map(
        elementsVariablesItem => getElementsVariablesIdentifier(elementsVariablesItem)!
      );
      const elementsVariablesToAdd = elementsVariables.filter(elementsVariablesItem => {
        const elementsVariablesIdentifier = getElementsVariablesIdentifier(elementsVariablesItem);
        if (elementsVariablesIdentifier == null || elementsVariablesCollectionIdentifiers.includes(elementsVariablesIdentifier)) {
          return false;
        }
        elementsVariablesCollectionIdentifiers.push(elementsVariablesIdentifier);
        return true;
      });
      return [...elementsVariablesToAdd, ...elementsVariablesCollection];
    }
    return elementsVariablesCollection;
  }

  protected convertDateFromClient(elementsVariables: IElementsVariables): IElementsVariables {
    return Object.assign({}, elementsVariables, {
      dateDebut: elementsVariables.dateDebut?.isValid() ? elementsVariables.dateDebut.format(DATE_FORMAT) : undefined,
      dateEcheance: elementsVariables.dateEcheance?.isValid() ? elementsVariables.dateEcheance.format(DATE_FORMAT) : undefined,
      dateInsert: elementsVariables.dateInsert?.isValid() ? elementsVariables.dateInsert.toJSON() : undefined,
      dateUpdate: elementsVariables.dateUpdate?.isValid() ? elementsVariables.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateDebut = res.body.dateDebut ? dayjs(res.body.dateDebut) : undefined;
      res.body.dateEcheance = res.body.dateEcheance ? dayjs(res.body.dateEcheance) : undefined;
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((elementsVariables: IElementsVariables) => {
        elementsVariables.dateDebut = elementsVariables.dateDebut ? dayjs(elementsVariables.dateDebut) : undefined;
        elementsVariables.dateEcheance = elementsVariables.dateEcheance ? dayjs(elementsVariables.dateEcheance) : undefined;
        elementsVariables.dateInsert = elementsVariables.dateInsert ? dayjs(elementsVariables.dateInsert) : undefined;
        elementsVariables.dateUpdate = elementsVariables.dateUpdate ? dayjs(elementsVariables.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
