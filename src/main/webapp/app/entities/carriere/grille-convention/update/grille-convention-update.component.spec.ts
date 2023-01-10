import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GrilleConventionService } from '../service/grille-convention.service';
import { IGrilleConvention, GrilleConvention } from '../grille-convention.model';

import { GrilleConventionUpdateComponent } from './grille-convention-update.component';

describe('GrilleConvention Management Update Component', () => {
  let comp: GrilleConventionUpdateComponent;
  let fixture: ComponentFixture<GrilleConventionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grilleConventionService: GrilleConventionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GrilleConventionUpdateComponent],
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
      .overrideTemplate(GrilleConventionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrilleConventionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grilleConventionService = TestBed.inject(GrilleConventionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const grilleConvention: IGrilleConvention = { id: 456 };

      activatedRoute.data = of({ grilleConvention });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(grilleConvention));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrilleConvention>>();
      const grilleConvention = { id: 123 };
      jest.spyOn(grilleConventionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grilleConvention });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grilleConvention }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(grilleConventionService.update).toHaveBeenCalledWith(grilleConvention);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrilleConvention>>();
      const grilleConvention = new GrilleConvention();
      jest.spyOn(grilleConventionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grilleConvention });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grilleConvention }));
      saveSubject.complete();

      // THEN
      expect(grilleConventionService.create).toHaveBeenCalledWith(grilleConvention);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrilleConvention>>();
      const grilleConvention = { id: 123 };
      jest.spyOn(grilleConventionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grilleConvention });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grilleConventionService.update).toHaveBeenCalledWith(grilleConvention);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
