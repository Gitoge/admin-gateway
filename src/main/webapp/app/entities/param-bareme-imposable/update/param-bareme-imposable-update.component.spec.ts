import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParamBaremeImposableService } from '../service/param-bareme-imposable.service';
import { IParamBaremeImposable, ParamBaremeImposable } from '../param-bareme-imposable.model';

import { ParamBaremeImposableUpdateComponent } from './param-bareme-imposable-update.component';

describe('ParamBaremeImposable Management Update Component', () => {
  let comp: ParamBaremeImposableUpdateComponent;
  let fixture: ComponentFixture<ParamBaremeImposableUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paramBaremeImposableService: ParamBaremeImposableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParamBaremeImposableUpdateComponent],
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
      .overrideTemplate(ParamBaremeImposableUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParamBaremeImposableUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paramBaremeImposableService = TestBed.inject(ParamBaremeImposableService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paramBaremeImposable: IParamBaremeImposable = { id: 456 };

      activatedRoute.data = of({ paramBaremeImposable });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paramBaremeImposable));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamBaremeImposable>>();
      const paramBaremeImposable = { id: 123 };
      jest.spyOn(paramBaremeImposableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramBaremeImposable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramBaremeImposable }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paramBaremeImposableService.update).toHaveBeenCalledWith(paramBaremeImposable);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamBaremeImposable>>();
      const paramBaremeImposable = new ParamBaremeImposable();
      jest.spyOn(paramBaremeImposableService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramBaremeImposable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramBaremeImposable }));
      saveSubject.complete();

      // THEN
      expect(paramBaremeImposableService.create).toHaveBeenCalledWith(paramBaremeImposable);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamBaremeImposable>>();
      const paramBaremeImposable = { id: 123 };
      jest.spyOn(paramBaremeImposableService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramBaremeImposable });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paramBaremeImposableService.update).toHaveBeenCalledWith(paramBaremeImposable);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
