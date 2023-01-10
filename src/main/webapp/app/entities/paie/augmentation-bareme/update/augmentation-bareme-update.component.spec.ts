import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AugmentationBaremeService } from '../service/augmentation-bareme.service';
import { IAugmentationBareme, AugmentationBareme } from '../augmentation-bareme.model';

import { AugmentationBaremeUpdateComponent } from './augmentation-bareme-update.component';

describe('AugmentationBareme Management Update Component', () => {
  let comp: AugmentationBaremeUpdateComponent;
  let fixture: ComponentFixture<AugmentationBaremeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let augmentationBaremeService: AugmentationBaremeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AugmentationBaremeUpdateComponent],
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
      .overrideTemplate(AugmentationBaremeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AugmentationBaremeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    augmentationBaremeService = TestBed.inject(AugmentationBaremeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const augmentationBareme: IAugmentationBareme = { id: 456 };

      activatedRoute.data = of({ augmentationBareme });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(augmentationBareme));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AugmentationBareme>>();
      const augmentationBareme = { id: 123 };
      jest.spyOn(augmentationBaremeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentationBareme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: augmentationBareme }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(augmentationBaremeService.update).toHaveBeenCalledWith(augmentationBareme);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AugmentationBareme>>();
      const augmentationBareme = new AugmentationBareme();
      jest.spyOn(augmentationBaremeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentationBareme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: augmentationBareme }));
      saveSubject.complete();

      // THEN
      expect(augmentationBaremeService.create).toHaveBeenCalledWith(augmentationBareme);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AugmentationBareme>>();
      const augmentationBareme = { id: 123 };
      jest.spyOn(augmentationBaremeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentationBareme });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(augmentationBaremeService.update).toHaveBeenCalledWith(augmentationBareme);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
