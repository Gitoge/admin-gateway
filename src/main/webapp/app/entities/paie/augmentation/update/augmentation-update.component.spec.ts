import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AugmentationService } from '../service/augmentation.service';
import { IAugmentation, Augmentation } from '../augmentation.model';

import { AugmentationUpdateComponent } from './augmentation-update.component';

describe('Augmentation Management Update Component', () => {
  let comp: AugmentationUpdateComponent;
  let fixture: ComponentFixture<AugmentationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let augmentationService: AugmentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AugmentationUpdateComponent],
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
      .overrideTemplate(AugmentationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AugmentationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    augmentationService = TestBed.inject(AugmentationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const augmentation: IAugmentation = { id: 456 };

      activatedRoute.data = of({ augmentation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(augmentation));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Augmentation>>();
      const augmentation = { id: 123 };
      jest.spyOn(augmentationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: augmentation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(augmentationService.update).toHaveBeenCalledWith(augmentation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Augmentation>>();
      const augmentation = new Augmentation();
      jest.spyOn(augmentationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: augmentation }));
      saveSubject.complete();

      // THEN
      expect(augmentationService.create).toHaveBeenCalledWith(augmentation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Augmentation>>();
      const augmentation = { id: 123 };
      jest.spyOn(augmentationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(augmentationService.update).toHaveBeenCalledWith(augmentation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
