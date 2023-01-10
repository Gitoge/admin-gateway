import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ActesService } from '../service/actes.service';
import { IActes, Actes } from '../actes.model';
import { INatureActes } from 'app/entities/carriere/nature-actes/nature-actes.model';
import { NatureActesService } from 'app/entities/carriere/nature-actes/service/nature-actes.service';
import { ITypeActes } from 'app/entities/carriere/type-actes/type-actes.model';
import { TypeActesService } from 'app/entities/carriere/type-actes/service/type-actes.service';

import { ActesUpdateComponent } from './actes-update.component';

describe('Actes Management Update Component', () => {
  let comp: ActesUpdateComponent;
  let fixture: ComponentFixture<ActesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let actesService: ActesService;
  let natureActesService: NatureActesService;
  let typeActesService: TypeActesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ActesUpdateComponent],
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
      .overrideTemplate(ActesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ActesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    actesService = TestBed.inject(ActesService);
    natureActesService = TestBed.inject(NatureActesService);
    typeActesService = TestBed.inject(TypeActesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call NatureActes query and add missing value', () => {
      const actes: IActes = { id: 456 };
      const natureActes: INatureActes = { id: 76545 };
      actes.natureActes = natureActes;

      const natureActesCollection: INatureActes[] = [{ id: 5473 }];
      jest.spyOn(natureActesService, 'query').mockReturnValue(of(new HttpResponse({ body: natureActesCollection })));
      const additionalNatureActes = [natureActes];
      const expectedCollection: INatureActes[] = [...additionalNatureActes, ...natureActesCollection];
      jest.spyOn(natureActesService, 'addNatureActesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ actes });
      comp.ngOnInit();

      expect(natureActesService.query).toHaveBeenCalled();
      expect(natureActesService.addNatureActesToCollectionIfMissing).toHaveBeenCalledWith(natureActesCollection, ...additionalNatureActes);
      expect(comp.natureActesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call TypeActes query and add missing value', () => {
      const actes: IActes = { id: 456 };
      const typeActes: ITypeActes = { id: 19201 };
      actes.typeActes = typeActes;

      const typeActesCollection: ITypeActes[] = [{ id: 23430 }];
      jest.spyOn(typeActesService, 'query').mockReturnValue(of(new HttpResponse({ body: typeActesCollection })));
      const additionalTypeActes = [typeActes];
      const expectedCollection: ITypeActes[] = [...additionalTypeActes, ...typeActesCollection];
      jest.spyOn(typeActesService, 'addTypeActesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ actes });
      comp.ngOnInit();

      expect(typeActesService.query).toHaveBeenCalled();
      expect(typeActesService.addTypeActesToCollectionIfMissing).toHaveBeenCalledWith(typeActesCollection, ...additionalTypeActes);
      expect(comp.typeActesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const actes: IActes = { id: 456 };
      const natureActes: INatureActes = { id: 52500 };
      actes.natureActes = natureActes;
      const typeActes: ITypeActes = { id: 13827 };
      actes.typeActes = typeActes;

      activatedRoute.data = of({ actes });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(actes));
      expect(comp.natureActesSharedCollection).toContain(natureActes);
      expect(comp.typeActesSharedCollection).toContain(typeActes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Actes>>();
      const actes = { id: 123 };
      jest.spyOn(actesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actes }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(actesService.update).toHaveBeenCalledWith(actes);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Actes>>();
      const actes = new Actes();
      jest.spyOn(actesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: actes }));
      saveSubject.complete();

      // THEN
      expect(actesService.create).toHaveBeenCalledWith(actes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Actes>>();
      const actes = { id: 123 };
      jest.spyOn(actesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ actes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(actesService.update).toHaveBeenCalledWith(actes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackNatureActesById', () => {
      it('Should return tracked NatureActes primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNatureActesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackTypeActesById', () => {
      it('Should return tracked TypeActes primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTypeActesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
