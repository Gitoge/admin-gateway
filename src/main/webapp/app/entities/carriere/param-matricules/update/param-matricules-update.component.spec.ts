import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParamMatriculesService } from '../service/param-matricules.service';
import { IParamMatricules, ParamMatricules } from '../param-matricules.model';

import { ParamMatriculesUpdateComponent } from './param-matricules-update.component';

describe('ParamMatricules Management Update Component', () => {
  let comp: ParamMatriculesUpdateComponent;
  let fixture: ComponentFixture<ParamMatriculesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paramMatriculesService: ParamMatriculesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParamMatriculesUpdateComponent],
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
      .overrideTemplate(ParamMatriculesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParamMatriculesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paramMatriculesService = TestBed.inject(ParamMatriculesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paramMatricules: IParamMatricules = { id: 456 };

      activatedRoute.data = of({ paramMatricules });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paramMatricules));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamMatricules>>();
      const paramMatricules = { id: 123 };
      jest.spyOn(paramMatriculesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramMatricules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramMatricules }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paramMatriculesService.update).toHaveBeenCalledWith(paramMatricules);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamMatricules>>();
      const paramMatricules = new ParamMatricules();
      jest.spyOn(paramMatriculesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramMatricules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramMatricules }));
      saveSubject.complete();

      // THEN
      expect(paramMatriculesService.create).toHaveBeenCalledWith(paramMatricules);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamMatricules>>();
      const paramMatricules = { id: 123 };
      jest.spyOn(paramMatriculesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramMatricules });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paramMatriculesService.update).toHaveBeenCalledWith(paramMatricules);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
