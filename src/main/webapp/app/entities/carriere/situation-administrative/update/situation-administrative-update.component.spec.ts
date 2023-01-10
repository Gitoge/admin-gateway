import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SituationAdministrativeService } from '../service/situation-administrative.service';
import { ISituationAdministrative, SituationAdministrative } from '../situation-administrative.model';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { ActesService } from 'app/entities/carriere/actes/service/actes.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';
import { ICategorieAgent } from 'app/entities/carriere/categorie-agent/categorie-agent.model';
import { CategorieAgentService } from 'app/entities/carriere/categorie-agent/service/categorie-agent.service';

import { SituationAdministrativeUpdateComponent } from './situation-administrative-update.component';

describe('SituationAdministrative Management Update Component', () => {
  let comp: SituationAdministrativeUpdateComponent;
  let fixture: ComponentFixture<SituationAdministrativeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let situationAdministrativeService: SituationAdministrativeService;
  let actesService: ActesService;
  let agentService: AgentService;
  let categorieAgentService: CategorieAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SituationAdministrativeUpdateComponent],
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
      .overrideTemplate(SituationAdministrativeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SituationAdministrativeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    situationAdministrativeService = TestBed.inject(SituationAdministrativeService);
    actesService = TestBed.inject(ActesService);
    agentService = TestBed.inject(AgentService);
    categorieAgentService = TestBed.inject(CategorieAgentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call actes query and add missing value', () => {
      const situationAdministrative: ISituationAdministrative = { id: 456 };
      const actes: IActes = { id: 22490 };
      situationAdministrative.actes = actes;

      const actesCollection: IActes[] = [{ id: 82385 }];
      jest.spyOn(actesService, 'query').mockReturnValue(of(new HttpResponse({ body: actesCollection })));
      const expectedCollection: IActes[] = [actes, ...actesCollection];
      jest.spyOn(actesService, 'addActesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ situationAdministrative });
      comp.ngOnInit();

      expect(actesService.query).toHaveBeenCalled();
      expect(actesService.addActesToCollectionIfMissing).toHaveBeenCalledWith(actesCollection, actes);
      expect(comp.actesCollection).toEqual(expectedCollection);
    });

    it('Should call Agent query and add missing value', () => {
      const situationAdministrative: ISituationAdministrative = { id: 456 };
      const agent: IAgent = { id: 95903 };
      situationAdministrative.agent = agent;

      const agentCollection: IAgent[] = [{ id: 5809 }];
      jest.spyOn(agentService, 'query').mockReturnValue(of(new HttpResponse({ body: agentCollection })));
      const additionalAgents = [agent];
      const expectedCollection: IAgent[] = [...additionalAgents, ...agentCollection];
      jest.spyOn(agentService, 'addAgentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ situationAdministrative });
      comp.ngOnInit();

      expect(agentService.query).toHaveBeenCalled();
      expect(agentService.addAgentToCollectionIfMissing).toHaveBeenCalledWith(agentCollection, ...additionalAgents);
      expect(comp.agentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CategorieAgent query and add missing value', () => {
      const situationAdministrative: ISituationAdministrative = { id: 456 };
      const categorieAgent: ICategorieAgent = { id: 94088 };
      situationAdministrative.categorieAgent = categorieAgent;

      const categorieAgentCollection: ICategorieAgent[] = [{ id: 83745 }];
      jest.spyOn(categorieAgentService, 'query').mockReturnValue(of(new HttpResponse({ body: categorieAgentCollection })));
      const additionalCategorieAgents = [categorieAgent];
      const expectedCollection: ICategorieAgent[] = [...additionalCategorieAgents, ...categorieAgentCollection];
      jest.spyOn(categorieAgentService, 'addCategorieAgentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ situationAdministrative });
      comp.ngOnInit();

      expect(categorieAgentService.query).toHaveBeenCalled();
      expect(categorieAgentService.addCategorieAgentToCollectionIfMissing).toHaveBeenCalledWith(
        categorieAgentCollection,
        ...additionalCategorieAgents
      );
      expect(comp.categorieAgentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const situationAdministrative: ISituationAdministrative = { id: 456 };
      const actes: IActes = { id: 63179 };
      situationAdministrative.actes = actes;
      const agent: IAgent = { id: 33573 };
      situationAdministrative.agent = agent;
      const categorieAgent: ICategorieAgent = { id: 29301 };
      situationAdministrative.categorieAgent = categorieAgent;

      activatedRoute.data = of({ situationAdministrative });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(situationAdministrative));
      expect(comp.actesCollection).toContain(actes);
      expect(comp.agentsSharedCollection).toContain(agent);
      expect(comp.categorieAgentsSharedCollection).toContain(categorieAgent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SituationAdministrative>>();
      const situationAdministrative = { id: 123 };
      jest.spyOn(situationAdministrativeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ situationAdministrative });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: situationAdministrative }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(situationAdministrativeService.update).toHaveBeenCalledWith(situationAdministrative);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SituationAdministrative>>();
      const situationAdministrative = new SituationAdministrative();
      jest.spyOn(situationAdministrativeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ situationAdministrative });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: situationAdministrative }));
      saveSubject.complete();

      // THEN
      expect(situationAdministrativeService.create).toHaveBeenCalledWith(situationAdministrative);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SituationAdministrative>>();
      const situationAdministrative = { id: 123 };
      jest.spyOn(situationAdministrativeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ situationAdministrative });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(situationAdministrativeService.update).toHaveBeenCalledWith(situationAdministrative);
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
