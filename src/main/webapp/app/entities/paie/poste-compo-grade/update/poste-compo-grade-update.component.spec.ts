import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PosteCompoGradeService } from '../service/poste-compo-grade.service';
import { IPosteCompoGrade, PosteCompoGrade } from '../poste-compo-grade.model';

import { PosteCompoGradeUpdateComponent } from './poste-compo-grade-update.component';

describe('PosteCompoGrade Management Update Component', () => {
  let comp: PosteCompoGradeUpdateComponent;
  let fixture: ComponentFixture<PosteCompoGradeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let posteCompoGradeService: PosteCompoGradeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PosteCompoGradeUpdateComponent],
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
      .overrideTemplate(PosteCompoGradeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PosteCompoGradeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    posteCompoGradeService = TestBed.inject(PosteCompoGradeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const posteCompoGrade: IPosteCompoGrade = { id: 456 };

      activatedRoute.data = of({ posteCompoGrade });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(posteCompoGrade));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PosteCompoGrade>>();
      const posteCompoGrade = { id: 123 };
      jest.spyOn(posteCompoGradeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posteCompoGrade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: posteCompoGrade }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(posteCompoGradeService.update).toHaveBeenCalledWith(posteCompoGrade);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PosteCompoGrade>>();
      const posteCompoGrade = new PosteCompoGrade();
      jest.spyOn(posteCompoGradeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posteCompoGrade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: posteCompoGrade }));
      saveSubject.complete();

      // THEN
      expect(posteCompoGradeService.create).toHaveBeenCalledWith(posteCompoGrade);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PosteCompoGrade>>();
      const posteCompoGrade = { id: 123 };
      jest.spyOn(posteCompoGradeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ posteCompoGrade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(posteCompoGradeService.update).toHaveBeenCalledWith(posteCompoGrade);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
