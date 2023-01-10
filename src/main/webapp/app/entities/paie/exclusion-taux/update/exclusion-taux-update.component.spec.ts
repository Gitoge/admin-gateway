import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExclusionTauxService } from '../service/exclusion-taux.service';
import { IExclusionTaux, ExclusionTaux } from '../exclusion-taux.model';

import { ExclusionTauxUpdateComponent } from './exclusion-taux-update.component';

describe('ExclusionTaux Management Update Component', () => {
  let comp: ExclusionTauxUpdateComponent;
  let fixture: ComponentFixture<ExclusionTauxUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exclusionTauxService: ExclusionTauxService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExclusionTauxUpdateComponent],
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
      .overrideTemplate(ExclusionTauxUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExclusionTauxUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exclusionTauxService = TestBed.inject(ExclusionTauxService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const exclusionTaux: IExclusionTaux = { id: 456 };

      activatedRoute.data = of({ exclusionTaux });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(exclusionTaux));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExclusionTaux>>();
      const exclusionTaux = { id: 123 };
      jest.spyOn(exclusionTauxService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exclusionTaux });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exclusionTaux }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(exclusionTauxService.update).toHaveBeenCalledWith(exclusionTaux);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExclusionTaux>>();
      const exclusionTaux = new ExclusionTaux();
      jest.spyOn(exclusionTauxService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exclusionTaux });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exclusionTaux }));
      saveSubject.complete();

      // THEN
      expect(exclusionTauxService.create).toHaveBeenCalledWith(exclusionTaux);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExclusionTaux>>();
      const exclusionTaux = { id: 123 };
      jest.spyOn(exclusionTauxService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exclusionTaux });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exclusionTauxService.update).toHaveBeenCalledWith(exclusionTaux);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
