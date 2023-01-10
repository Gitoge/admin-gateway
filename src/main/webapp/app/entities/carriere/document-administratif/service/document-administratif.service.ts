import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocumentAdministratif, getDocumentAdministratifIdentifier } from '../document-administratif.model';

export type EntityResponseType = HttpResponse<IDocumentAdministratif>;
export type EntityArrayResponseType = HttpResponse<IDocumentAdministratif[]>;

@Injectable({ providedIn: 'root' })
export class DocumentAdministratifService {
  //public resourceUrl = this.applicationConfigService.getEndpointFor('api/document-administratifs');
  public resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/document-administratifs');
  public resourceUrlProprietaire = this.applicationConfigService.getEndpointForCarriere('api/document-administratifs/proprietaire');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(documentAdministratif: IDocumentAdministratif): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentAdministratif);
    return this.http
      .post<IDocumentAdministratif>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(documentAdministratif: IDocumentAdministratif): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentAdministratif);
    return this.http
      .put<IDocumentAdministratif>(`${this.resourceUrl}/${getDocumentAdministratifIdentifier(documentAdministratif) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(documentAdministratif: IDocumentAdministratif): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(documentAdministratif);
    return this.http
      .patch<IDocumentAdministratif>(`${this.resourceUrl}/${getDocumentAdministratifIdentifier(documentAdministratif) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDocumentAdministratif>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocumentAdministratif[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  findByProprietaire(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocumentAdministratif[]>(`${this.resourceUrlProprietaire}`, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDocumentAdministratifToCollectionIfMissing(
    documentAdministratifCollection: IDocumentAdministratif[],
    ...documentAdministratifsToCheck: (IDocumentAdministratif | null | undefined)[]
  ): IDocumentAdministratif[] {
    const documentAdministratifs: IDocumentAdministratif[] = documentAdministratifsToCheck.filter(isPresent);
    if (documentAdministratifs.length > 0) {
      const documentAdministratifCollectionIdentifiers = documentAdministratifCollection.map(
        documentAdministratifItem => getDocumentAdministratifIdentifier(documentAdministratifItem)!
      );
      const documentAdministratifsToAdd = documentAdministratifs.filter(documentAdministratifItem => {
        const documentAdministratifIdentifier = getDocumentAdministratifIdentifier(documentAdministratifItem);
        if (
          documentAdministratifIdentifier == null ||
          documentAdministratifCollectionIdentifiers.includes(documentAdministratifIdentifier)
        ) {
          return false;
        }
        documentAdministratifCollectionIdentifiers.push(documentAdministratifIdentifier);
        return true;
      });
      return [...documentAdministratifsToAdd, ...documentAdministratifCollection];
    }
    return documentAdministratifCollection;
  }

  protected convertDateFromClient(documentAdministratif: IDocumentAdministratif): IDocumentAdministratif {
    return Object.assign({}, documentAdministratif, {
      dateCreation: documentAdministratif.dateCreation?.isValid() ? documentAdministratif.dateCreation.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateCreation = res.body.dateCreation ? dayjs(res.body.dateCreation) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((documentAdministratif: IDocumentAdministratif) => {
        documentAdministratif.dateCreation = documentAdministratif.dateCreation ? dayjs(documentAdministratif.dateCreation) : undefined;
      });
    }
    return res;
  }
}
