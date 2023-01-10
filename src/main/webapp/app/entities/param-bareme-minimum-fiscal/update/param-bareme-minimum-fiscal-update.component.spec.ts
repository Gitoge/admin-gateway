import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParamBaremeMinimumFiscalService } from '../service/param-bareme-minimum-fiscal.service';
import { IParamBaremeMinimumFiscal, ParamBaremeMinimumFiscal } from '../param-bareme-minimum-fiscal.model';

import { ParamBaremeMinimumFiscalUpdateComponent } from './param-bareme-minimum-fiscal-update.component';

describe('ParamBaremeMinimumFiscal Management Update Component', () => {
  let comp: ParamBaremeMinimumFiscalUpdateComponent;
  let fixture: ComponentFixture<ParamBaremeMinimumFiscalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paramBaremeMinimumFiscalService: ParamBaremeMinimumFiscalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParamBaremeMinimumFiscalUpdateComponent],
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
      .overrideTemplate(ParamBaremeMinimumFiscalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParamBaremeMinimumFiscalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paramBaremeMinimumFiscalService = TestBed.inject(ParamBaremeMinimumFiscalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal = { id: 456 };

      activatedRoute.data = of({ paramBaremeMinimumFiscal });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paramBaremeMinimumFiscal));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamBaremeMinimumFiscal>>();
      const paramBaremeMinimumFiscal = { id: 123 };
      jest.spyOn(paramBaremeMinimumFiscalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramBaremeMinimumFiscal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramBaremeMinimumFiscal }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paramBaremeMinimumFiscalService.update).toHaveBeenCalledWith(paramBaremeMinimumFiscal);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamBaremeMinimumFiscal>>();
      const paramBaremeMinimumFiscal = new ParamBaremeMinimumFiscal();
      jest.spyOn(paramBaremeMinimumFiscalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramBaremeMinimumFiscal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramBaremeMinimumFiscal }));
      saveSubject.complete();

      // THEN
      expect(paramBaremeMinimumFiscalService.create).toHaveBeenCalledWith(paramBaremeMinimumFiscal);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamBaremeMinimumFiscal>>();
      const paramBaremeMinimumFiscal = { id: 123 };
      jest.spyOn(paramBaremeMinimumFiscalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramBaremeMinimumFiscal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paramBaremeMinimumFiscalService.update).toHaveBeenCalledWith(paramBaremeMinimumFiscal);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
