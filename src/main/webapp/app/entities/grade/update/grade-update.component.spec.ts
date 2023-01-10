import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GradeService } from '../service/grade.service';
import { IGrade, Grade } from '../grade.model';
import { IPostes } from 'app/entities/postes/postes.model';
import { PostesService } from 'app/entities/postes/service/postes.service';

import { GradeUpdateComponent } from './grade-update.component';

describe('Grade Management Update Component', () => {
  let comp: GradeUpdateComponent;
  let fixture: ComponentFixture<GradeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gradeService: GradeService;
  let postesService: PostesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GradeUpdateComponent],
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
      .overrideTemplate(GradeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GradeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gradeService = TestBed.inject(GradeService);
    postesService = TestBed.inject(PostesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Postes query and add missing value', () => {
      const grade: IGrade = { id: 456 };
      const postes: IPostes[] = [{ id: 5674 }];
      grade.postes = postes;

      const postesCollection: IPostes[] = [{ id: 18762 }];
      jest.spyOn(postesService, 'query').mockReturnValue(of(new HttpResponse({ body: postesCollection })));
      const additionalPostes = [...postes];
      const expectedCollection: IPostes[] = [...additionalPostes, ...postesCollection];
      jest.spyOn(postesService, 'addPostesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ grade });
      comp.ngOnInit();

      expect(postesService.query).toHaveBeenCalled();
      expect(postesService.addPostesToCollectionIfMissing).toHaveBeenCalledWith(postesCollection, ...additionalPostes);
      expect(comp.postesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const grade: IGrade = { id: 456 };
      const postes: IPostes = { id: 48971 };
      grade.postes = [postes];

      activatedRoute.data = of({ grade });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(grade));
      expect(comp.postesSharedCollection).toContain(postes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grade>>();
      const grade = { id: 123 };
      jest.spyOn(gradeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grade }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(gradeService.update).toHaveBeenCalledWith(grade);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grade>>();
      const grade = new Grade();
      jest.spyOn(gradeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grade }));
      saveSubject.complete();

      // THEN
      expect(gradeService.create).toHaveBeenCalledWith(grade);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grade>>();
      const grade = { id: 123 };
      jest.spyOn(gradeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grade });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gradeService.update).toHaveBeenCalledWith(grade);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPostesById', () => {
      it('Should return tracked Postes primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPostesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedPostes', () => {
      it('Should return option if no Postes is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedPostes(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Postes for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedPostes(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Postes is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedPostes(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
