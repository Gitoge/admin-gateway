import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ExclusionAugmentationService } from '../service/exclusion-augmentation.service';
import { IExclusionAugmentation, ExclusionAugmentation } from '../exclusion-augmentation.model';

import { ExclusionAugmentationUpdateComponent } from './exclusion-augmentation-update.component';

describe('ExclusionAugmentation Management Update Component', () => {
  let comp: ExclusionAugmentationUpdateComponent;
  let fixture: ComponentFixture<ExclusionAugmentationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let exclusionAugmentationService: ExclusionAugmentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ExclusionAugmentationUpdateComponent],
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
      .overrideTemplate(ExclusionAugmentationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ExclusionAugmentationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    exclusionAugmentationService = TestBed.inject(ExclusionAugmentationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const exclusionAugmentation: IExclusionAugmentation = { id: 456 };

      activatedRoute.data = of({ exclusionAugmentation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(exclusionAugmentation));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExclusionAugmentation>>();
      const exclusionAugmentation = { id: 123 };
      jest.spyOn(exclusionAugmentationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exclusionAugmentation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exclusionAugmentation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(exclusionAugmentationService.update).toHaveBeenCalledWith(exclusionAugmentation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExclusionAugmentation>>();
      const exclusionAugmentation = new ExclusionAugmentation();
      jest.spyOn(exclusionAugmentationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exclusionAugmentation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: exclusionAugmentation }));
      saveSubject.complete();

      // THEN
      expect(exclusionAugmentationService.create).toHaveBeenCalledWith(exclusionAugmentation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ExclusionAugmentation>>();
      const exclusionAugmentation = { id: 123 };
      jest.spyOn(exclusionAugmentationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ exclusionAugmentation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(exclusionAugmentationService.update).toHaveBeenCalledWith(exclusionAugmentation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
