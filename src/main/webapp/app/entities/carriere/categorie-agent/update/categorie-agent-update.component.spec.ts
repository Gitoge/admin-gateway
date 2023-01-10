import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CategorieAgentService } from '../service/categorie-agent.service';
import { ICategorieAgent, CategorieAgent } from '../categorie-agent.model';

import { CategorieAgentUpdateComponent } from './categorie-agent-update.component';

describe('CategorieAgent Management Update Component', () => {
  let comp: CategorieAgentUpdateComponent;
  let fixture: ComponentFixture<CategorieAgentUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let categorieAgentService: CategorieAgentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CategorieAgentUpdateComponent],
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
      .overrideTemplate(CategorieAgentUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CategorieAgentUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    categorieAgentService = TestBed.inject(CategorieAgentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const categorieAgent: ICategorieAgent = { id: 456 };

      activatedRoute.data = of({ categorieAgent });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(categorieAgent));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CategorieAgent>>();
      const categorieAgent = { id: 123 };
      jest.spyOn(categorieAgentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorieAgent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: categorieAgent }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(categorieAgentService.update).toHaveBeenCalledWith(categorieAgent);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CategorieAgent>>();
      const categorieAgent = new CategorieAgent();
      jest.spyOn(categorieAgentService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorieAgent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: categorieAgent }));
      saveSubject.complete();

      // THEN
      expect(categorieAgentService.create).toHaveBeenCalledWith(categorieAgent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CategorieAgent>>();
      const categorieAgent = { id: 123 };
      jest.spyOn(categorieAgentService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorieAgent });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(categorieAgentService.update).toHaveBeenCalledWith(categorieAgent);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
