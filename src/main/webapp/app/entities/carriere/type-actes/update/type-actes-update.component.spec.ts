import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeActesService } from '../service/type-actes.service';
import { ITypeActes, TypeActes } from '../type-actes.model';
import { ICategorieActes } from 'app/entities/carriere/categorie-actes/categorie-actes.model';
import { CategorieActesService } from 'app/entities/carriere/categorie-actes/service/categorie-actes.service';

import { TypeActesUpdateComponent } from './type-actes-update.component';

describe('TypeActes Management Update Component', () => {
  let comp: TypeActesUpdateComponent;
  let fixture: ComponentFixture<TypeActesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeActesService: TypeActesService;
  let categorieActesService: CategorieActesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeActesUpdateComponent],
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
      .overrideTemplate(TypeActesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeActesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeActesService = TestBed.inject(TypeActesService);
    categorieActesService = TestBed.inject(CategorieActesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CategorieActes query and add missing value', () => {
      const typeActes: ITypeActes = { id: 456 };
      const categorieActes: ICategorieActes = { id: 3547 };
      typeActes.categorieActes = categorieActes;

      const categorieActesCollection: ICategorieActes[] = [{ id: 8665 }];
      jest.spyOn(categorieActesService, 'query').mockReturnValue(of(new HttpResponse({ body: categorieActesCollection })));
      const additionalCategorieActes = [categorieActes];
      const expectedCollection: ICategorieActes[] = [...additionalCategorieActes, ...categorieActesCollection];
      jest.spyOn(categorieActesService, 'addCategorieActesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ typeActes });
      comp.ngOnInit();

      expect(categorieActesService.query).toHaveBeenCalled();
      expect(categorieActesService.addCategorieActesToCollectionIfMissing).toHaveBeenCalledWith(
        categorieActesCollection,
        ...additionalCategorieActes
      );
      expect(comp.categorieActesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const typeActes: ITypeActes = { id: 456 };
      const categorieActes: ICategorieActes = { id: 44326 };
      typeActes.categorieActes = categorieActes;

      activatedRoute.data = of({ typeActes });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typeActes));
      expect(comp.categorieActesSharedCollection).toContain(categorieActes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeActes>>();
      const typeActes = { id: 123 };
      jest.spyOn(typeActesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeActes }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeActesService.update).toHaveBeenCalledWith(typeActes);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeActes>>();
      const typeActes = new TypeActes();
      jest.spyOn(typeActesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeActes }));
      saveSubject.complete();

      // THEN
      expect(typeActesService.create).toHaveBeenCalledWith(typeActes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeActes>>();
      const typeActes = { id: 123 };
      jest.spyOn(typeActesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeActesService.update).toHaveBeenCalledWith(typeActes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackCategorieActesById', () => {
      it('Should return tracked CategorieActes primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCategorieActesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
