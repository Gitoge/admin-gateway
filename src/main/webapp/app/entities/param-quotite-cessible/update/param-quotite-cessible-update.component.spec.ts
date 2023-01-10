import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParamQuotiteCessibleService } from '../service/param-quotite-cessible.service';
import { IParamQuotiteCessible, ParamQuotiteCessible } from '../param-quotite-cessible.model';

import { ParamQuotiteCessibleUpdateComponent } from './param-quotite-cessible-update.component';

describe('ParamQuotiteCessible Management Update Component', () => {
  let comp: ParamQuotiteCessibleUpdateComponent;
  let fixture: ComponentFixture<ParamQuotiteCessibleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paramQuotiteCessibleService: ParamQuotiteCessibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParamQuotiteCessibleUpdateComponent],
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
      .overrideTemplate(ParamQuotiteCessibleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParamQuotiteCessibleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paramQuotiteCessibleService = TestBed.inject(ParamQuotiteCessibleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paramQuotiteCessible: IParamQuotiteCessible = { id: 456 };

      activatedRoute.data = of({ paramQuotiteCessible });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paramQuotiteCessible));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamQuotiteCessible>>();
      const paramQuotiteCessible = { id: 123 };
      jest.spyOn(paramQuotiteCessibleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramQuotiteCessible });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramQuotiteCessible }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paramQuotiteCessibleService.update).toHaveBeenCalledWith(paramQuotiteCessible);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamQuotiteCessible>>();
      const paramQuotiteCessible = new ParamQuotiteCessible();
      jest.spyOn(paramQuotiteCessibleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramQuotiteCessible });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paramQuotiteCessible }));
      saveSubject.complete();

      // THEN
      expect(paramQuotiteCessibleService.create).toHaveBeenCalledWith(paramQuotiteCessible);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParamQuotiteCessible>>();
      const paramQuotiteCessible = { id: 123 };
      jest.spyOn(paramQuotiteCessibleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paramQuotiteCessible });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paramQuotiteCessibleService.update).toHaveBeenCalledWith(paramQuotiteCessible);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
