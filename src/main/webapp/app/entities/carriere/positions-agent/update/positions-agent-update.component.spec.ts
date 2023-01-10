import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PositionsAgentService } from '../service/positions-agent.service';
import { IPositionsAgent, PositionsAgent } from '../positions-agent.model';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { ActesService } from 'app/entities/carriere/actes/service/actes.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';
import { ICategorieAgent } from 'app/entities/carriere/categorie-agent/categorie-agent.model';
import { CategorieAgentService } from 'app/entities/carriere/categorie-agent/service/categorie-agent.service';

import { PositionsAgentUpdateComponent } from './positions-agent-update.component';

describe('PositionsAgent Management Update Component', () => {
  let comp: PositionsAgentUpdateComponent;
  let fixture: ComponentFixture<PositionsAgentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let positionsAgentService: PositionsAgentService;
  let actesService: ActesService;
  let agentService: AgentService;
  let categorieAgentService: CategorieAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PositionsAgentUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PositionsAgentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PositionsAgentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    positionsAgentService = TestBed.inject(PositionsAgentService);
    actesService = TestBed.inject(ActesService);
    agentService = TestBed.inject(AgentService);
    categorieAgentService = TestBed.inject(CategorieAgentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call actes query and add missing value', () => {
      const positionsAgent: IPositionsAgent = { id: 456 };
      const actes: IActes = { id: 79748 };
      positionsAgent.actes = actes;

      const actesCollection: IActes[] = [{ id: 10766 }];
      jest.spyOn(actesService, 'query').mockReturnValue(of(new HttpResponse({ body: actesCollection })));
      const expectedCollection: IActes[] = [actes, ...actesCollection];
      jest.spyOn(actesService, 'addActesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ positionsAgent });
      comp.ngOnInit();

      expect(actesService.query).toHaveBeenCalled();
      expect(actesService.addActesToCollectionIfMissing).toHaveBeenCalledWith(actesCollection, actes);
      expect(comp.actesCollection).toEqual(expectedCollection);
    });

    it('Should call Agent query and add missing value', () => {
      const positionsAgent: IPositionsAgent = { id: 456 };
      const agent: IAgent = { id: 65329 };
      positionsAgent.agent = agent;

      const agentCollection: IAgent[] = [{ id: 16811 }];
      jest.spyOn(agentService, 'query').mockReturnValue(of(new HttpResponse({ body: agentCollection })));
      const additionalAgents = [agent];
      const expectedCollection: IAgent[] = [...additionalAgents, ...agentCollection];
      jest.spyOn(agentService, 'addAgentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ positionsAgent });
      comp.ngOnInit();

      expect(agentService.query).toHaveBeenCalled();
      expect(agentService.addAgentToCollectionIfMissing).toHaveBeenCalledWith(agentCollection, ...additionalAgents);
      expect(comp.agentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CategorieAgent query and add missing value', () => {
      const positionsAgent: IPositionsAgent = { id: 456 };
      const categorieAgent: ICategorieAgent = { id: 24191 };
      positionsAgent.categorieAgent = categorieAgent;

      const categorieAgentCollection: ICategorieAgent[] = [{ id: 9975 }];
      jest.spyOn(categorieAgentService, 'query').mockReturnValue(of(new HttpResponse({ body: categorieAgentCollection })));
      const additionalCategorieAgents = [categorieAgent];
      const expectedCollection: ICategorieAgent[] = [...additionalCategorieAgents, ...categorieAgentCollection];
      jest.spyOn(categorieAgentService, 'addCategorieAgentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ positionsAgent });
      comp.ngOnInit();

      expect(categorieAgentService.query).toHaveBeenCalled();
      expect(categorieAgentService.addCategorieAgentToCollectionIfMissing).toHaveBeenCalledWith(
        categorieAgentCollection,
        ...additionalCategorieAgents
      );
      expect(comp.categorieAgentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const positionsAgent: IPositionsAgent = { id: 456 };
      const actes: IActes = { id: 94221 };
      positionsAgent.actes = actes;
      const agent: IAgent = { id: 28529 };
      positionsAgent.agent = agent;
      const categorieAgent: ICategorieAgent = { id: 77154 };
      positionsAgent.categorieAgent = categorieAgent;

      activatedRoute.data = of({ positionsAgent });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(positionsAgent));
      expect(comp.actesCollection).toContain(actes);
      expect(comp.agentsSharedCollection).toContain(agent);
      expect(comp.categorieAgentsSharedCollection).toContain(categorieAgent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PositionsAgent>>();
      const positionsAgent = { id: 123 };
      jest.spyOn(positionsAgentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ positionsAgent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: positionsAgent }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(positionsAgentService.update).toHaveBeenCalledWith(positionsAgent);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PositionsAgent>>();
      const positionsAgent = new PositionsAgent();
      jest.spyOn(positionsAgentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ positionsAgent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: positionsAgent }));
      saveSubject.complete();

      // THEN
      expect(positionsAgentService.create).toHaveBeenCalledWith(positionsAgent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PositionsAgent>>();
      const positionsAgent = { id: 123 };
      jest.spyOn(positionsAgentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ positionsAgent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(positionsAgentService.update).toHaveBeenCalledWith(positionsAgent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackActesById', () => {
      it('Should return tracked Actes primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackActesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackAgentById', () => {
      it('Should return tracked Agent primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAgentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackCategorieAgentById', () => {
      it('Should return tracked CategorieAgent primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCategorieAgentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
