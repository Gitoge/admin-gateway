import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AffectationService } from '../service/affectation.service';
import { IAffectation, Affectation } from '../affectation.model';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { ActesService } from 'app/entities/carriere/actes/service/actes.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';

import { AffectationUpdateComponent } from './affectation-update.component';

describe('Affectation Management Update Component', () => {
  let comp: AffectationUpdateComponent;
  let fixture: ComponentFixture<AffectationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let affectationService: AffectationService;
  let actesService: ActesService;
  let agentService: AgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AffectationUpdateComponent],
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
      .overrideTemplate(AffectationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AffectationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    affectationService = TestBed.inject(AffectationService);
    actesService = TestBed.inject(ActesService);
    agentService = TestBed.inject(AgentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call actes query and add missing value', () => {
      const affectation: IAffectation = { id: 456 };
      const actes: IActes = { id: 75016 };
      affectation.actes = actes;

      const actesCollection: IActes[] = [{ id: 90832 }];
      jest.spyOn(actesService, 'query').mockReturnValue(of(new HttpResponse({ body: actesCollection })));
      const expectedCollection: IActes[] = [actes, ...actesCollection];
      jest.spyOn(actesService, 'addActesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      expect(actesService.query).toHaveBeenCalled();
      expect(actesService.addActesToCollectionIfMissing).toHaveBeenCalledWith(actesCollection, actes);
      expect(comp.actesCollection).toEqual(expectedCollection);
    });

    it('Should call Agent query and add missing value', () => {
      const affectation: IAffectation = { id: 456 };
      const agent: IAgent = { id: 9668 };
      affectation.agent = agent;

      const agentCollection: IAgent[] = [{ id: 65787 }];
      jest.spyOn(agentService, 'query').mockReturnValue(of(new HttpResponse({ body: agentCollection })));
      const additionalAgents = [agent];
      const expectedCollection: IAgent[] = [...additionalAgents, ...agentCollection];
      jest.spyOn(agentService, 'addAgentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      expect(agentService.query).toHaveBeenCalled();
      expect(agentService.addAgentToCollectionIfMissing).toHaveBeenCalledWith(agentCollection, ...additionalAgents);
      expect(comp.agentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const affectation: IAffectation = { id: 456 };
      const actes: IActes = { id: 99780 };
      affectation.actes = actes;
      const agent: IAgent = { id: 6805 };
      affectation.agent = agent;

      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(affectation));
      expect(comp.actesCollection).toContain(actes);
      expect(comp.agentsSharedCollection).toContain(agent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Affectation>>();
      const affectation = { id: 123 };
      jest.spyOn(affectationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: affectation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(affectationService.update).toHaveBeenCalledWith(affectation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Affectation>>();
      const affectation = new Affectation();
      jest.spyOn(affectationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: affectation }));
      saveSubject.complete();

      // THEN
      expect(affectationService.create).toHaveBeenCalledWith(affectation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Affectation>>();
      const affectation = { id: 123 };
      jest.spyOn(affectationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ affectation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(affectationService.update).toHaveBeenCalledWith(affectation);
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
  });
});
