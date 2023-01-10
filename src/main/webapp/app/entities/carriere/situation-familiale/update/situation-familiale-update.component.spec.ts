import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SituationFamilialeService } from '../service/situation-familiale.service';
import { ISituationFamiliale, SituationFamiliale } from '../situation-familiale.model';
import { IActes } from 'app/entities/carriere/actes/actes.model';
import { ActesService } from 'app/entities/carriere/actes/service/actes.service';
import { IAgent } from 'app/entities/carriere/agent/agent.model';
import { AgentService } from 'app/entities/carriere/agent/service/agent.service';

import { SituationFamilialeUpdateComponent } from './situation-familiale-update.component';

describe('SituationFamiliale Management Update Component', () => {
  let comp: SituationFamilialeUpdateComponent;
  let fixture: ComponentFixture<SituationFamilialeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let situationFamilialeService: SituationFamilialeService;
  let actesService: ActesService;
  let agentService: AgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SituationFamilialeUpdateComponent],
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
      .overrideTemplate(SituationFamilialeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SituationFamilialeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    situationFamilialeService = TestBed.inject(SituationFamilialeService);
    actesService = TestBed.inject(ActesService);
    agentService = TestBed.inject(AgentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call actes query and add missing value', () => {
      const situationFamiliale: ISituationFamiliale = { id: 456 };
      const actes: IActes = { id: 25092 };
      situationFamiliale.actes = actes;

      const actesCollection: IActes[] = [{ id: 36335 }];
      jest.spyOn(actesService, 'query').mockReturnValue(of(new HttpResponse({ body: actesCollection })));
      const expectedCollection: IActes[] = [actes, ...actesCollection];
      jest.spyOn(actesService, 'addActesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ situationFamiliale });
      comp.ngOnInit();

      expect(actesService.query).toHaveBeenCalled();
      expect(actesService.addActesToCollectionIfMissing).toHaveBeenCalledWith(actesCollection, actes);
      expect(comp.actesCollection).toEqual(expectedCollection);
    });

    it('Should call Agent query and add missing value', () => {
      const situationFamiliale: ISituationFamiliale = { id: 456 };
      const agent: IAgent = { id: 82661 };
      situationFamiliale.agent = agent;

      const agentCollection: IAgent[] = [{ id: 14210 }];
      jest.spyOn(agentService, 'query').mockReturnValue(of(new HttpResponse({ body: agentCollection })));
      const additionalAgents = [agent];
      const expectedCollection: IAgent[] = [...additionalAgents, ...agentCollection];
      jest.spyOn(agentService, 'addAgentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ situationFamiliale });
      comp.ngOnInit();

      expect(agentService.query).toHaveBeenCalled();
      expect(agentService.addAgentToCollectionIfMissing).toHaveBeenCalledWith(agentCollection, ...additionalAgents);
      expect(comp.agentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const situationFamiliale: ISituationFamiliale = { id: 456 };
      const actes: IActes = { id: 37544 };
      situationFamiliale.actes = actes;
      const agent: IAgent = { id: 75753 };
      situationFamiliale.agent = agent;

      activatedRoute.data = of({ situationFamiliale });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(situationFamiliale));
      expect(comp.actesCollection).toContain(actes);
      expect(comp.agentsSharedCollection).toContain(agent);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SituationFamiliale>>();
      const situationFamiliale = { id: 123 };
      jest.spyOn(situationFamilialeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ situationFamiliale });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: situationFamiliale }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(situationFamilialeService.update).toHaveBeenCalledWith(situationFamiliale);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SituationFamiliale>>();
      const situationFamiliale = new SituationFamiliale();
      jest.spyOn(situationFamilialeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ situationFamiliale });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: situationFamiliale }));
      saveSubject.complete();

      // THEN
      expect(situationFamilialeService.create).toHaveBeenCalledWith(situationFamiliale);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SituationFamiliale>>();
      const situationFamiliale = { id: 123 };
      jest.spyOn(situationFamilialeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ situationFamiliale });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(situationFamilialeService.update).toHaveBeenCalledWith(situationFamiliale);
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
