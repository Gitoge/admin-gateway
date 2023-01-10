import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PeriodePayeService } from '../service/periode-paye.service';
import { IPeriodePaye, PeriodePaye } from '../periode-paye.model';
import { IExercice } from 'app/entities/paie/exercice/exercice.model';
import { ExerciceService } from 'app/entities/paie/exercice/service/exercice.service';

import { PeriodePayeUpdateComponent } from './periode-paye-update.component';

describe('PeriodePaye Management Update Component', () => {
  let comp: PeriodePayeUpdateComponent;
  let fixture: ComponentFixture<PeriodePayeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let periodePayeService: PeriodePayeService;
  let exerciceService: ExerciceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PeriodePayeUpdateComponent],
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
      .overrideTemplate(PeriodePayeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PeriodePayeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    periodePayeService = TestBed.inject(PeriodePayeService);
    exerciceService = TestBed.inject(ExerciceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Exercice query and add missing value', () => {
      const periodePaye: IPeriodePaye = { id: 456 };
      const exercice: IExercice = { id: 36145 };
      periodePaye.exercice = exercice;

      const exerciceCollection: IExercice[] = [{ id: 22023 }];
      jest.spyOn(exerciceService, 'query').mockReturnValue(of(new HttpResponse({ body: exerciceCollection })));
      const additionalExercices = [exercice];
      const expectedCollection: IExercice[] = [...additionalExercices, ...exerciceCollection];
      jest.spyOn(exerciceService, 'addExerciceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ periodePaye });
      comp.ngOnInit();

      expect(exerciceService.query).toHaveBeenCalled();
      expect(exerciceService.addExerciceToCollectionIfMissing).toHaveBeenCalledWith(exerciceCollection, ...additionalExercices);
      expect(comp.exercicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const periodePaye: IPeriodePaye = { id: 456 };
      const exercice: IExercice = { id: 8488 };
      periodePaye.exercice = exercice;

      activatedRoute.data = of({ periodePaye });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(periodePaye));
      expect(comp.exercicesSharedCollection).toContain(exercice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PeriodePaye>>();
      const periodePaye = { id: 123 };
      jest.spyOn(periodePayeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ periodePaye });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: periodePaye }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(periodePayeService.update).toHaveBeenCalledWith(periodePaye);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PeriodePaye>>();
      const periodePaye = new PeriodePaye();
      jest.spyOn(periodePayeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ periodePaye });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: periodePaye }));
      saveSubject.complete();

      // THEN
      expect(periodePayeService.create).toHaveBeenCalledWith(periodePaye);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PeriodePaye>>();
      const periodePaye = { id: 123 };
      jest.spyOn(periodePayeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ periodePaye });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(periodePayeService.update).toHaveBeenCalledWith(periodePaye);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackExerciceById', () => {
      it('Should return tracked Exercice primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackExerciceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
