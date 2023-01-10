import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CorpsService } from '../service/corps.service';
import { ICorps, Corps } from '../corps.model';

import { CorpsUpdateComponent } from './corps-update.component';

describe('Corps Management Update Component', () => {
  let comp: CorpsUpdateComponent;
  let fixture: ComponentFixture<CorpsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let corpsService: CorpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CorpsUpdateComponent],
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
      .overrideTemplate(CorpsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CorpsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    corpsService = TestBed.inject(CorpsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const corps: ICorps = { id: 456 };

      activatedRoute.data = of({ corps });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(corps));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Corps>>();
      const corps = { id: 123 };
      jest.spyOn(corpsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ corps });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: corps }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(corpsService.update).toHaveBeenCalledWith(corps);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Corps>>();
      const corps = new Corps();
      jest.spyOn(corpsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ corps });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: corps }));
      saveSubject.complete();

      // THEN
      expect(corpsService.create).toHaveBeenCalledWith(corps);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Corps>>();
      const corps = { id: 123 };
      jest.spyOn(corpsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ corps });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(corpsService.update).toHaveBeenCalledWith(corps);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
