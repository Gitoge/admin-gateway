import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AugmentationHierarchieService } from '../service/augmentation-hierarchie.service';
import { IAugmentationHierarchie, AugmentationHierarchie } from '../augmentation-hierarchie.model';

import { AugmentationHierarchieUpdateComponent } from './augmentation-hierarchie-update.component';

describe('AugmentationHierarchie Management Update Component', () => {
  let comp: AugmentationHierarchieUpdateComponent;
  let fixture: ComponentFixture<AugmentationHierarchieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let augmentationHierarchieService: AugmentationHierarchieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AugmentationHierarchieUpdateComponent],
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
      .overrideTemplate(AugmentationHierarchieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AugmentationHierarchieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    augmentationHierarchieService = TestBed.inject(AugmentationHierarchieService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const augmentationHierarchie: IAugmentationHierarchie = { id: 456 };

      activatedRoute.data = of({ augmentationHierarchie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(augmentationHierarchie));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AugmentationHierarchie>>();
      const augmentationHierarchie = { id: 123 };
      jest.spyOn(augmentationHierarchieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentationHierarchie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: augmentationHierarchie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(augmentationHierarchieService.update).toHaveBeenCalledWith(augmentationHierarchie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AugmentationHierarchie>>();
      const augmentationHierarchie = new AugmentationHierarchie();
      jest.spyOn(augmentationHierarchieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentationHierarchie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: augmentationHierarchie }));
      saveSubject.complete();

      // THEN
      expect(augmentationHierarchieService.create).toHaveBeenCalledWith(augmentationHierarchie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<AugmentationHierarchie>>();
      const augmentationHierarchie = { id: 123 };
      jest.spyOn(augmentationHierarchieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ augmentationHierarchie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(augmentationHierarchieService.update).toHaveBeenCalledWith(augmentationHierarchie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
