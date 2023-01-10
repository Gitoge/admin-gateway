import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ConventionEtablissementsService } from '../service/convention-etablissements.service';
import { IConventionEtablissements, ConventionEtablissements } from '../convention-etablissements.model';

import { ConventionEtablissementsUpdateComponent } from './convention-etablissements-update.component';

describe('ConventionEtablissements Management Update Component', () => {
  let comp: ConventionEtablissementsUpdateComponent;
  let fixture: ComponentFixture<ConventionEtablissementsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let conventionEtablissementsService: ConventionEtablissementsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ConventionEtablissementsUpdateComponent],
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
      .overrideTemplate(ConventionEtablissementsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConventionEtablissementsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    conventionEtablissementsService = TestBed.inject(ConventionEtablissementsService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const conventionEtablissements: IConventionEtablissements = { id: 456 };

      activatedRoute.data = of({ conventionEtablissements });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(conventionEtablissements));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ConventionEtablissements>>();
      const conventionEtablissements = { id: 123 };
      jest.spyOn(conventionEtablissementsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conventionEtablissements });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conventionEtablissements }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(conventionEtablissementsService.update).toHaveBeenCalledWith(conventionEtablissements);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ConventionEtablissements>>();
      const conventionEtablissements = new ConventionEtablissements();
      jest.spyOn(conventionEtablissementsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conventionEtablissements });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conventionEtablissements }));
      saveSubject.complete();

      // THEN
      expect(conventionEtablissementsService.create).toHaveBeenCalledWith(conventionEtablissements);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ConventionEtablissements>>();
      const conventionEtablissements = { id: 123 };
      jest.spyOn(conventionEtablissementsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conventionEtablissements });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(conventionEtablissementsService.update).toHaveBeenCalledWith(conventionEtablissements);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
