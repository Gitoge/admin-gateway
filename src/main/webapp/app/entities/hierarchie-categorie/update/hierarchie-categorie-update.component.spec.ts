import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HierarchieCategorieService } from '../service/hierarchie-categorie.service';
import { IHierarchieCategorie, HierarchieCategorie } from '../hierarchie-categorie.model';

import { HierarchieCategorieUpdateComponent } from './hierarchie-categorie-update.component';

describe('HierarchieCategorie Management Update Component', () => {
  let comp: HierarchieCategorieUpdateComponent;
  let fixture: ComponentFixture<HierarchieCategorieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let hierarchieCategorieService: HierarchieCategorieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HierarchieCategorieUpdateComponent],
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
      .overrideTemplate(HierarchieCategorieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HierarchieCategorieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    hierarchieCategorieService = TestBed.inject(HierarchieCategorieService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const hierarchieCategorie: IHierarchieCategorie = { id: 456 };

      activatedRoute.data = of({ hierarchieCategorie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(hierarchieCategorie));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HierarchieCategorie>>();
      const hierarchieCategorie = { id: 123 };
      jest.spyOn(hierarchieCategorieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hierarchieCategorie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hierarchieCategorie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(hierarchieCategorieService.update).toHaveBeenCalledWith(hierarchieCategorie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HierarchieCategorie>>();
      const hierarchieCategorie = new HierarchieCategorie();
      jest.spyOn(hierarchieCategorieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hierarchieCategorie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hierarchieCategorie }));
      saveSubject.complete();

      // THEN
      expect(hierarchieCategorieService.create).toHaveBeenCalledWith(hierarchieCategorie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<HierarchieCategorie>>();
      const hierarchieCategorie = { id: 123 };
      jest.spyOn(hierarchieCategorieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hierarchieCategorie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(hierarchieCategorieService.update).toHaveBeenCalledWith(hierarchieCategorie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
