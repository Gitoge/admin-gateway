import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PostesReferenceActesService } from '../service/postes-reference-actes.service';
import { IPostesReferenceActes, PostesReferenceActes } from '../postes-reference-actes.model';

import { PostesReferenceActesUpdateComponent } from './postes-reference-actes-update.component';

describe('PostesReferenceActes Management Update Component', () => {
  let comp: PostesReferenceActesUpdateComponent;
  let fixture: ComponentFixture<PostesReferenceActesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let postesReferenceActesService: PostesReferenceActesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PostesReferenceActesUpdateComponent],
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
      .overrideTemplate(PostesReferenceActesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PostesReferenceActesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    postesReferenceActesService = TestBed.inject(PostesReferenceActesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const postesReferenceActes: IPostesReferenceActes = { id: 456 };

      activatedRoute.data = of({ postesReferenceActes });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(postesReferenceActes));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PostesReferenceActes>>();
      const postesReferenceActes = { id: 123 };
      jest.spyOn(postesReferenceActesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ postesReferenceActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: postesReferenceActes }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(postesReferenceActesService.update).toHaveBeenCalledWith(postesReferenceActes);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PostesReferenceActes>>();
      const postesReferenceActes = new PostesReferenceActes();
      jest.spyOn(postesReferenceActesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ postesReferenceActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: postesReferenceActes }));
      saveSubject.complete();

      // THEN
      expect(postesReferenceActesService.create).toHaveBeenCalledWith(postesReferenceActes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PostesReferenceActes>>();
      const postesReferenceActes = { id: 123 };
      jest.spyOn(postesReferenceActesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ postesReferenceActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(postesReferenceActesService.update).toHaveBeenCalledWith(postesReferenceActes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
