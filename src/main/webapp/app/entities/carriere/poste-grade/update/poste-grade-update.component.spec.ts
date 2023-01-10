import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PosteGradeService } from '../service/poste-grade.service';
import { IPosteGrade, PosteGrade } from '../poste-grade.model';

import { PosteGradeUpdateComponent } from './poste-grade-update.component';

describe('PosteGrade Management Update Component', () => {
  let comp: PosteGradeUpdateComponent;
  let fixture: ComponentFixture<PosteGradeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let posteGradeService: PosteGradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PosteGradeUpdateComponent],
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
      .overrideTemplate(PosteGradeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PosteGradeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    posteGradeService = TestBed.inject(PosteGradeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const posteGrade: IPosteGrade = { id: 456 };

      activatedRoute.data = of({ posteGrade });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(posteGrade));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PosteGrade>>();
      const posteGrade = { id: 123 };
      jest.spyOn(posteGradeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posteGrade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: posteGrade }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(posteGradeService.update).toHaveBeenCalledWith(posteGrade);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PosteGrade>>();
      const posteGrade = new PosteGrade();
      jest.spyOn(posteGradeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posteGrade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: posteGrade }));
      saveSubject.complete();

      // THEN
      expect(posteGradeService.create).toHaveBeenCalledWith(posteGrade);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PosteGrade>>();
      const posteGrade = { id: 123 };
      jest.spyOn(posteGradeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posteGrade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(posteGradeService.update).toHaveBeenCalledWith(posteGrade);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
