import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExerciceService } from '../service/exercice.service';
import { IExercice, Exercice } from '../exercice.model';

import { ExerciceUpdateComponent } from './exercice-update.component';

describe('Exercice Management Update Component', () => {
  let comp: ExerciceUpdateComponent;
  let fixture: ComponentFixture<ExerciceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exerciceService: ExerciceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExerciceUpdateComponent],
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
      .overrideTemplate(ExerciceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExerciceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exerciceService = TestBed.inject(ExerciceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const exercice: IExercice = { id: 456 };

      activatedRoute.data = of({ exercice });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(exercice));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Exercice>>();
      const exercice = { id: 123 };
      jest.spyOn(exerciceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exercice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exercice }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(exerciceService.update).toHaveBeenCalledWith(exercice);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Exercice>>();
      const exercice = new Exercice();
      jest.spyOn(exerciceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exercice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exercice }));
      saveSubject.complete();

      // THEN
      expect(exerciceService.create).toHaveBeenCalledWith(exercice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Exercice>>();
      const exercice = { id: 123 };
      jest.spyOn(exerciceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exercice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exerciceService.update).toHaveBeenCalledWith(exercice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
