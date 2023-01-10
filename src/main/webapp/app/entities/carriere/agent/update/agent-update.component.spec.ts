import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AgentService } from '../service/agent.service';
import { IAgent, Agent } from '../agent.model';
import { INationalite } from 'app/entities/carriere/nationalite/nationalite.model';
import { NationaliteService } from 'app/entities/carriere/nationalite/service/nationalite.service';

import { AgentUpdateComponent } from './agent-update.component';

describe('Agent Management Update Component', () => {
  let comp: AgentUpdateComponent;
  let fixture: ComponentFixture<AgentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let agentService: AgentService;
  let nationaliteService: NationaliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AgentUpdateComponent],
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
      .overrideTemplate(AgentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    agentService = TestBed.inject(AgentService);
    nationaliteService = TestBed.inject(NationaliteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Nationalite query and add missing value', () => {
      const agent: IAgent = { id: 456 };
      const nationalite: INationalite = { id: 64141 };
      agent.nationalite = nationalite;

      const nationaliteCollection: INationalite[] = [{ id: 75334 }];
      jest.spyOn(nationaliteService, 'query').mockReturnValue(of(new HttpResponse({ body: nationaliteCollection })));
      const additionalNationalites = [nationalite];
      const expectedCollection: INationalite[] = [...additionalNationalites, ...nationaliteCollection];
      jest.spyOn(nationaliteService, 'addNationaliteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ agent });
      comp.ngOnInit();

      expect(nationaliteService.query).toHaveBeenCalled();
      expect(nationaliteService.addNationaliteToCollectionIfMissing).toHaveBeenCalledWith(nationaliteCollection, ...additionalNationalites);
      expect(comp.nationalitesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const agent: IAgent = { id: 456 };
      const nationalite: INationalite = { id: 43882 };
      agent.nationalite = nationalite;

      activatedRoute.data = of({ agent });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(agent));
      expect(comp.nationalitesSharedCollection).toContain(nationalite);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Agent>>();
      const agent = { id: 123 };
      jest.spyOn(agentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agent }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(agentService.update).toHaveBeenCalledWith(agent);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Agent>>();
      const agent = new Agent();
      jest.spyOn(agentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agent }));
      saveSubject.complete();

      // THEN
      expect(agentService.create).toHaveBeenCalledWith(agent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Agent>>();
      const agent = { id: 123 };
      jest.spyOn(agentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(agentService.update).toHaveBeenCalledWith(agent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackNationaliteById', () => {
      it('Should return tracked Nationalite primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNationaliteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
