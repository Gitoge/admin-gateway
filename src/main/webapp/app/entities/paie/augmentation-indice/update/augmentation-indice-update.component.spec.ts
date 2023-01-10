import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AugmentationIndiceService } from '../service/augmentation-indice.service';
import { IAugmentationIndice, AugmentationIndice } from '../augmentation-indice.model';

import { AugmentationIndiceUpdateComponent } from './augmentation-indice-update.component';

describe('AugmentationIndice Management Update Component', () => {
  let comp: AugmentationIndiceUpdateComponent;
  let fixture: ComponentFixture<AugmentationIndiceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let augmentationIndiceService: AugmentationIndiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AugmentationIndiceUpdateComponent],
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
      .overrideTemplate(AugmentationIndiceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AugmentationIndiceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    augmentationIndiceService = TestBed.inject(AugmentationIndiceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const augmentationIndice: IAugmentationIndice = { id: 456 };

      activatedRoute.data = of({ augmentationIndice });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(augmentationIndice));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AugmentationIndice>>();
      const augmentationIndice = { id: 123 };
      jest.spyOn(augmentationIndiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentationIndice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: augmentationIndice }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(augmentationIndiceService.update).toHaveBeenCalledWith(augmentationIndice);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AugmentationIndice>>();
      const augmentationIndice = new AugmentationIndice();
      jest.spyOn(augmentationIndiceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentationIndice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: augmentationIndice }));
      saveSubject.complete();

      // THEN
      expect(augmentationIndiceService.create).toHaveBeenCalledWith(augmentationIndice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AugmentationIndice>>();
      const augmentationIndice = { id: 123 };
      jest.spyOn(augmentationIndiceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentationIndice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(augmentationIndiceService.update).toHaveBeenCalledWith(augmentationIndice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
