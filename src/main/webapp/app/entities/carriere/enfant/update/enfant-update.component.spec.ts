import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EnfantService } from '../service/enfant.service';
import { IEnfant, Enfant } from '../enfant.model';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';

import { EnfantUpdateComponent } from './enfant-update.component';

describe('Enfant Management Update Component', () => {
  let comp: EnfantUpdateComponent;
  let fixture: ComponentFixture<EnfantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let enfantService: EnfantService;
  let agentService: AgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EnfantUpdateComponent],
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
      .overrideTemplate(EnfantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EnfantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    enfantService = TestBed.inject(EnfantService);
    agentService = TestBed.inject(AgentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Agent query and add missing value', () => {
      const enfant: IEnfant = { id: 456 };
      const agent: IAgent = { id: 63953 };
      enfant.agent = agent;

      const agentCollection: IAgent[] = [{ id: 43688 }];
      jest.spyOn(agentService, 'query').mockReturnValue(of(new HttpResponse({ body: agentCollection })));
      const additionalAgents = [agent];
      const expectedCollection: IAgent[] = [...additionalAgents, ...agentCollection];
      jest.spyOn(agentService, 'addAgentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ enfant });
      comp.ngOnInit();

      expect(agentService.query).toHaveBeenCalled();
      expect(agentService.addAgentToCollectionIfMissing).toHaveBeenCalledWith(agentCollection, ...additionalAgents);
      expect(comp.agentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const enfant: IEnfant = { id: 456 };
      const agent: IAgent = { id: 12048 };
      enfant.agent = agent;

      activatedRoute.data = of({ enfant });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(enfant));
      expect(comp.agentsSharedCollection).toContain(agent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Enfant>>();
      const enfant = { id: 123 };
      jest.spyOn(enfantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enfant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: enfant }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(enfantService.update).toHaveBeenCalledWith(enfant);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Enfant>>();
      const enfant = new Enfant();
      jest.spyOn(enfantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enfant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: enfant }));
      saveSubject.complete();

      // THEN
      expect(enfantService.create).toHaveBeenCalledWith(enfant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Enfant>>();
      const enfant = { id: 123 };
      jest.spyOn(enfantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ enfant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(enfantService.update).toHaveBeenCalledWith(enfant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAgentById', () => {
      it('Should return tracked Agent primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAgentById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
