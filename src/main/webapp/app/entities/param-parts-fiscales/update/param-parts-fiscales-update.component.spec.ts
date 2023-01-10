import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParamPartsFiscalesService } from '../service/param-parts-fiscales.service';
import { IParamPartsFiscales, ParamPartsFiscales } from '../param-parts-fiscales.model';

import { ParamPartsFiscalesUpdateComponent } from './param-parts-fiscales-update.component';

describe('ParamPartsFiscales Management Update Component', () => {
  let comp: ParamPartsFiscalesUpdateComponent;
  let fixture: ComponentFixture<ParamPartsFiscalesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paramPartsFiscalesService: ParamPartsFiscalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParamPartsFiscalesUpdateComponent],
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
      .overrideTemplate(ParamPartsFiscalesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParamPartsFiscalesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paramPartsFiscalesService = TestBed.inject(ParamPartsFiscalesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paramPartsFiscales: IParamPartsFiscales = { id: 456 };

      activatedRoute.data = of({ paramPartsFiscales });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paramPartsFiscales));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamPartsFiscales>>();
      const paramPartsFiscales = { id: 123 };
      jest.spyOn(paramPartsFiscalesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramPartsFiscales });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramPartsFiscales }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paramPartsFiscalesService.update).toHaveBeenCalledWith(paramPartsFiscales);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamPartsFiscales>>();
      const paramPartsFiscales = new ParamPartsFiscales();
      jest.spyOn(paramPartsFiscalesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramPartsFiscales });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramPartsFiscales }));
      saveSubject.complete();

      // THEN
      expect(paramPartsFiscalesService.create).toHaveBeenCalledWith(paramPartsFiscales);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamPartsFiscales>>();
      const paramPartsFiscales = { id: 123 };
      jest.spyOn(paramPartsFiscalesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramPartsFiscales });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paramPartsFiscalesService.update).toHaveBeenCalledWith(paramPartsFiscales);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
