import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HistoAugmentationService } from '../service/histo-augmentation.service';
import { IHistoAugmentation, HistoAugmentation } from '../histo-augmentation.model';

import { HistoAugmentationUpdateComponent } from './histo-augmentation-update.component';

describe('HistoAugmentation Management Update Component', () => {
  let comp: HistoAugmentationUpdateComponent;
  let fixture: ComponentFixture<HistoAugmentationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let histoAugmentationService: HistoAugmentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HistoAugmentationUpdateComponent],
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
      .overrideTemplate(HistoAugmentationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HistoAugmentationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    histoAugmentationService = TestBed.inject(HistoAugmentationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const histoAugmentation: IHistoAugmentation = { id: 456 };

      activatedRoute.data = of({ histoAugmentation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(histoAugmentation));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HistoAugmentation>>();
      const histoAugmentation = { id: 123 };
      jest.spyOn(histoAugmentationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ histoAugmentation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: histoAugmentation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(histoAugmentationService.update).toHaveBeenCalledWith(histoAugmentation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HistoAugmentation>>();
      const histoAugmentation = new HistoAugmentation();
      jest.spyOn(histoAugmentationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ histoAugmentation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: histoAugmentation }));
      saveSubject.complete();

      // THEN
      expect(histoAugmentationService.create).toHaveBeenCalledWith(histoAugmentation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HistoAugmentation>>();
      const histoAugmentation = { id: 123 };
      jest.spyOn(histoAugmentationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ histoAugmentation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(histoAugmentationService.update).toHaveBeenCalledWith(histoAugmentation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
