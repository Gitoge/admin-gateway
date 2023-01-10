import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAgent, getAgentIdentifier } from '../agent.model';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';
import { IPriseEnCompte } from '../../prise-en-compte/prise-en-compte.model';
import { IInfosAgentPdf } from '../infos-agent-pdf.model';
import { IEmoluments } from 'app/entities/paie/emoluments/emoluments.model';
import { IFichePaie } from '../../../paie/fiche-paie/fiche-paie.model';

export type EntityResponseType = HttpResponse<IAgent>;
export type EntityResponseTypeInt = HttpResponse<number[]>;
export type EntityResponseTypeEmololuments = HttpResponse<IEmoluments[]>;
export type EntityResponseTypeFichesPaie = HttpResponse<IFichePaie[]>;
export type EntityResponseFichePaie = HttpResponse<IFichePaie[]>;
export type EntityArrayResponseType = HttpResponse<IAgent[]>;
export type EntityArrayResponseTypeString = HttpResponse<string[]>;
type EntityResponseType1 = HttpResponse<IInfosAgentPdf>;

@Injectable({ providedIn: 'root' })
export class AgentService {
  protected resourceUrl = this.applicationConfigService.getEndpointForCarriere('api/agents');
  protected resourceUrlMatricule = this.applicationConfigService.getEndpointForCarriere('api/agents-matricule');
  protected resourceUrlAgent = this.applicationConfigService.getEndpointForCarriere('api/agents/mot/cle');
  protected resourceUrlMatriculeRecherche = this.applicationConfigService.getEndpointForCarriere('api/agents/matricule');
  protected resourceUrlAgentByPiece = this.applicationConfigService.getEndpointForCarriere('api/agents/piece');
  protected resourceUrlInfosAgentPdf = this.applicationConfigService.getEndpointForCarriere('api/agents/piece');
  protected resourceFicheByAgent = this.applicationConfigService.getEndpointForCarriere('api/calcul/fiche-paie/agent');
  protected resourceEmoluments = this.applicationConfigService.getEndpointForCarriere('api/calcul/augmentations');
  protected resourceEmolumentsForAll = this.applicationConfigService.getEndpointForCarriere('api/calcul/emoluments/all/agent');
  protected resourceFichesPaieForAll = this.applicationConfigService.getEndpointForCarriere('api/calcul/fiche-paie/all/agent');
  protected resourceUrlMatricules = this.applicationConfigService.getEndpointForCarriere('api/matricules/agent');
  private header: HttpHeaders;
  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private authServerProvider: AuthServerProvider
  ) {
    this.header = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.authServerProvider.getToken())
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');
  }

  create(priseEnCompte: IPriseEnCompte): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(priseEnCompte);

    return this.http
      .post<IPriseEnCompte>(this.resourceUrl, copy, { headers: this.header, observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(agent: IAgent): Observable<EntityResponseType> {
    // const copy = this.convertDateFromClient(agent);
    return this.http.put<IAgent>(`${this.resourceUrl}/${getAgentIdentifier(agent) as number}`, agent, {
      headers: this.header,
      observe: 'response',
    });
    // .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAgent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    //   .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  findAll(): Observable<EntityArrayResponseType> {
    return this.http.get<IAgent[]>(`${this.resourceUrl}/all`, { headers: this.header, observe: 'response' });
  }

  findAllMatricules(): Observable<EntityArrayResponseTypeString> {
    return this.http.get<string[]>(`${this.resourceUrlMatricules}`, { headers: this.header, observe: 'response' });
  }

  findByEtablissement(etablissementId: number): Observable<EntityResponseTypeInt> {
    return this.http.get<number[]>(`${this.resourceUrl}/etablissement?etablissementId=${etablissementId}`, { observe: 'response' });
    //   .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAgent[]>(this.resourceUrl, { params: options, observe: 'response' });
    //  .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  // genererEmoluments(req?: any): Observable<EntityResponseTypeEmololuments> {
  //   const options = createRequestOption(req);
  //   return this.http.get<IEmoluments[]>(this.resourceEmoluments, { params: options, observe: 'response' });
  //   //  .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  // }

  getMatricule(req?: any): any {
    const options = createRequestOption(req);
    return this.http.get<IAgent[]>(this.resourceUrlMatricule, { params: options, observe: 'response' });
  }
  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAgentToCollectionIfMissing(agentCollection: IAgent[], ...agentsToCheck: (IAgent | null | undefined)[]): IAgent[] {
    const agents: IAgent[] = agentsToCheck.filter(isPresent);
    if (agents.length > 0) {
      const agentCollectionIdentifiers = agentCollection.map(agentItem => getAgentIdentifier(agentItem)!);
      const agentsToAdd = agents.filter(agentItem => {
        const agentIdentifier = getAgentIdentifier(agentItem);
        if (agentIdentifier == null || agentCollectionIdentifiers.includes(agentIdentifier)) {
          return false;
        }
        agentCollectionIdentifiers.push(agentIdentifier);
        return true;
      });
      return [...agentsToAdd, ...agentCollection];
    }
    return agentCollection;
  }

  findAgentByMatricule(matricule: string): Observable<EntityResponseType> {
    return this.http.get<IAgent>(`${this.resourceUrlMatriculeRecherche}?matricule=${matricule}`, { observe: 'response' });
  }

  genererEmolument(agentId: number): Observable<EntityResponseTypeEmololuments> {
    return this.http.get<IEmoluments[]>(`${this.resourceEmoluments}/grade?agentId=${agentId}`, { observe: 'response' });
  }

  genererEmolumentForAll(): Observable<EntityResponseTypeEmololuments> {
    return this.http.get<IEmoluments[]>(`${this.resourceEmolumentsForAll}`, { observe: 'response' });
  }

  genererFichePaie(agentId: number): Observable<EntityResponseFichePaie> {
    return this.http.get<IFichePaie[]>(`${this.resourceFicheByAgent}?agentId=${agentId}`, { observe: 'response' });
  }

  genererFichePaieForAll(): Observable<EntityResponseTypeFichesPaie> {
    return this.http.get<IFichePaie[]>(`${this.resourceFichesPaieForAll}`, { observe: 'response' });
  }

  findAgentByMotCle(prenom: string, nom: string): Observable<EntityResponseType> {
    return this.http.get<IAgent>(`${this.resourceUrlAgent}?prenom=${prenom}&nom=${nom}`, { observe: 'response' });
    //   .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  protected convertDateFromClient(agent: IAgent): IAgent {
    return Object.assign({}, agent, {
      dateNaissance: agent.dateNaissance?.isValid() ? agent.dateNaissance.format(DATE_FORMAT) : undefined,
      datePriseEnCharge: agent.datePriseEnCharge?.isValid() ? agent.datePriseEnCharge.toJSON() : undefined,
      dateSortie: agent.dateSortie?.isValid() ? agent.dateSortie.toJSON() : undefined,
      dateInsert: agent.dateInsert?.isValid() ? agent.dateInsert.toJSON() : undefined,
      dateUpdate: agent.dateUpdate?.isValid() ? agent.dateUpdate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateNaissance = res.body.dateNaissance ? dayjs(res.body.dateNaissance) : undefined;
      res.body.datePriseEnCharge = res.body.datePriseEnCharge ? dayjs(res.body.datePriseEnCharge) : undefined;
      res.body.dateSortie = res.body.dateSortie ? dayjs(res.body.dateSortie) : undefined;
      res.body.dateInsert = res.body.dateInsert ? dayjs(res.body.dateInsert) : undefined;
      res.body.dateUpdate = res.body.dateUpdate ? dayjs(res.body.dateUpdate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((agent: IAgent) => {
        agent.dateNaissance = agent.dateNaissance ? dayjs(agent.dateNaissance) : undefined;
        agent.datePriseEnCharge = agent.datePriseEnCharge ? dayjs(agent.datePriseEnCharge) : undefined;
        agent.dateSortie = agent.dateSortie ? dayjs(agent.dateSortie) : undefined;
        agent.dateInsert = agent.dateInsert ? dayjs(agent.dateInsert) : undefined;
        agent.dateUpdate = agent.dateUpdate ? dayjs(agent.dateUpdate) : undefined;
      });
    }
    return res;
  }
}
