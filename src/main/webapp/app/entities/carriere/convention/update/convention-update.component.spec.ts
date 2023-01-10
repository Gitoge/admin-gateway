import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConventionService } from '../service/convention.service';
import { IConvention, Convention } from '../convention.model';

import { ConventionUpdateComponent } from './convention-update.component';

describe('Convention Management Update Component', () => {
  let comp: ConventionUpdateComponent;
  let fixture: ComponentFixture<ConventionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let conventionService: ConventionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConventionUpdateComponent],
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
      .overrideTemplate(ConventionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConventionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    conventionService = TestBed.inject(ConventionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const convention: IConvention = { id: 456 };

      activatedRoute.data = of({ convention });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(convention));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Convention>>();
      const convention = { id: 123 };
      jest.spyOn(conventionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ convention });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: convention }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(conventionService.update).toHaveBeenCalledWith(convention);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Convention>>();
      const convention = new Convention();
      jest.spyOn(conventionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ convention });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: convention }));
      saveSubject.complete();

      // THEN
      expect(conventionService.create).toHaveBeenCalledWith(convention);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Convention>>();
      const convention = { id: 123 };
      jest.spyOn(conventionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ convention });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(conventionService.update).toHaveBeenCalledWith(convention);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
