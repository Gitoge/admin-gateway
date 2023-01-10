import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PostesNonCumulabeService } from '../service/postes-non-cumulabe.service';
import { IPostesNonCumulabe, PostesNonCumulabe } from '../postes-non-cumulabe.model';

import { PostesNonCumulabeUpdateComponent } from './postes-non-cumulabe-update.component';

describe('PostesNonCumulabe Management Update Component', () => {
  let comp: PostesNonCumulabeUpdateComponent;
  let fixture: ComponentFixture<PostesNonCumulabeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let postesNonCumulabeService: PostesNonCumulabeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PostesNonCumulabeUpdateComponent],
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
      .overrideTemplate(PostesNonCumulabeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PostesNonCumulabeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    postesNonCumulabeService = TestBed.inject(PostesNonCumulabeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const postesNonCumulabe: IPostesNonCumulabe = { id: 456 };

      activatedRoute.data = of({ postesNonCumulabe });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(postesNonCumulabe));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PostesNonCumulabe>>();
      const postesNonCumulabe = { id: 123 };
      jest.spyOn(postesNonCumulabeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ postesNonCumulabe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: postesNonCumulabe }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(postesNonCumulabeService.update).toHaveBeenCalledWith(postesNonCumulabe);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PostesNonCumulabe>>();
      const postesNonCumulabe = new PostesNonCumulabe();
      jest.spyOn(postesNonCumulabeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ postesNonCumulabe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: postesNonCumulabe }));
      saveSubject.complete();

      // THEN
      expect(postesNonCumulabeService.create).toHaveBeenCalledWith(postesNonCumulabe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PostesNonCumulabe>>();
      const postesNonCumulabe = { id: 123 };
      jest.spyOn(postesNonCumulabeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ postesNonCumulabe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(postesNonCumulabeService.update).toHaveBeenCalledWith(postesNonCumulabe);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
