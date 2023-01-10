import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPositionsAgent, getPositionsAgentIdentifier } from '../positions-agent.model';

export type EntityResponseType = HttpResponse<IPositionsAgent>;
export type EntityArrayResponseType = HttpResponse<IPositionsAgent[]>;

@Injectable({ providedIn: 'root' })
export class PositionsAgentService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/positions-agents');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(positionsAgent: IPositionsAgent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(positionsAgent);
    return this.http
      .post<IPositionsAgent>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(positionsAgent: IPositionsAgent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(positionsAgent);
    return this.http
      .put<IPositionsAgent>(`${this.resourceUrl}/${getPositionsAgentIdentifier(positionsAgent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(positionsAgent: IPositionsAgent): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(positionsAgent);
    return this.http
      .patch<IPositionsAgent>(`${this.resourceUrl}/${getPositionsAgentIdentifier(positionsAgent) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPositionsAgent>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPositionsAgent[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPositionsAgentToCollectionIfMissing(
    positionsAgentCollection: IPositionsAgent[],
    ...positionsAgentsToCheck: (IPositionsAgent | null | undefined)[]
  ): IPositionsAgent[] {
    const positionsAgents: IPositionsAgent[] = positionsAgentsToCheck.filter(isPresent);
    if (positionsAgents.length > 0) {
      const positionsAgentCollectionIdentifiers = positionsAgentCollection.map(
        positionsAgentItem => getPositionsAgentIdentifier(positionsAgentItem)!
      );
      const positionsAgentsToAdd = positionsAgents.filter(positionsAgentItem => {
        const positionsAgentIdentifier = getPositionsAgentIdentifier(positionsAgentItem);
        if (positionsAgentIdentifier == null || positionsAgentCollectionIdentifiers.includes(positionsAgentIdentifier)) {
          return false;
        }
        positionsAgentCollectionIdentifiers.push(positionsAgentIdentifier);
        return true;
      });
      return [...positionsAgentsToAdd, ...positionsAgentCollection];
    }
    return positionsAgentCollection;
  }

  protected convertDateFromClient(positionsAgent: IPositionsAgent): IPositionsAgent {
    return Object.assign({}, positionsAgent, {
      datePosition: positionsAgent.datePosition?.isValid() ? positionsAgent.datePosition.format(DATE_FORMAT) : undefined,
      dateAnnulation: positionsAgent.dateAnnulation?.isValid() ? positionsAgent.dateAnnulation.format(DATE_FORMAT) : undefined,
      dateFinAbsence: positionsAgent.dateFinAbsence?.isValid() ? positionsAgent.dateFinAbsence.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.datePosition = res.body.datePosition ? dayjs(res.body.datePosition) : undefined;
      res.body.dateAnnulation = res.body.dateAnnulation ? dayjs(res.body.dateAnnulation) : undefined;
      res.body.dateFinAbsence = res.body.dateFinAbsence ? dayjs(res.body.dateFinAbsence) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((positionsAgent: IPositionsAgent) => {
        positionsAgent.datePosition = positionsAgent.datePosition ? dayjs(positionsAgent.datePosition) : undefined;
        positionsAgent.dateAnnulation = positionsAgent.dateAnnulation ? dayjs(positionsAgent.dateAnnulation) : undefined;
        positionsAgent.dateFinAbsence = positionsAgent.dateFinAbsence ? dayjs(positionsAgent.dateFinAbsence) : undefined;
      });
    }
    return res;
  }
}
