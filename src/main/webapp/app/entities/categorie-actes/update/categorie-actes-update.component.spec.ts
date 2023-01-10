import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CategorieActesService } from '../service/categorie-actes.service';
import { ICategorieActes, CategorieActes } from '../categorie-actes.model';

import { CategorieActesUpdateComponent } from './categorie-actes-update.component';

describe('CategorieActes Management Update Component', () => {
  let comp: CategorieActesUpdateComponent;
  let fixture: ComponentFixture<CategorieActesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let categorieActesService: CategorieActesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CategorieActesUpdateComponent],
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
      .overrideTemplate(CategorieActesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CategorieActesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    categorieActesService = TestBed.inject(CategorieActesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const categorieActes: ICategorieActes = { id: 456 };

      activatedRoute.data = of({ categorieActes });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(categorieActes));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CategorieActes>>();
      const categorieActes = { id: 123 };
      jest.spyOn(categorieActesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorieActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: categorieActes }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(categorieActesService.update).toHaveBeenCalledWith(categorieActes);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CategorieActes>>();
      const categorieActes = new CategorieActes();
      jest.spyOn(categorieActesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorieActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: categorieActes }));
      saveSubject.complete();

      // THEN
      expect(categorieActesService.create).toHaveBeenCalledWith(categorieActes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CategorieActes>>();
      const categorieActes = { id: 123 };
      jest.spyOn(categorieActesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ categorieActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(categorieActesService.update).toHaveBeenCalledWith(categorieActes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
