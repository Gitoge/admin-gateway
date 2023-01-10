import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtablissementService } from '../service/etablissement.service';
import { IEtablissement, Etablissement } from '../etablissement.model';
import { ITypeEtablissement } from 'app/entities/type-etablissement/type-etablissement.model';
import { TypeEtablissementService } from 'app/entities/type-etablissement/service/type-etablissement.service';
import { ILocalite } from 'app/entities/localite/localite.model';
import { LocaliteService } from 'app/entities/localite/service/localite.service';

import { EtablissementUpdateComponent } from './etablissement-update.component';

describe('Etablissement Management Update Component', () => {
  let comp: EtablissementUpdateComponent;
  let fixture: ComponentFixture<EtablissementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etablissementService: EtablissementService;
  let typeEtablissementService: TypeEtablissementService;
  let localiteService: LocaliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EtablissementUpdateComponent],
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
      .overrideTemplate(EtablissementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtablissementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etablissementService = TestBed.inject(EtablissementService);
    typeEtablissementService = TestBed.inject(TypeEtablissementService);
    localiteService = TestBed.inject(LocaliteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypeEtablissement query and add missing value', () => {
      const etablissement: IEtablissement = { id: 456 };
      const typeEtab: ITypeEtablissement = { id: 19302 };
      etablissement.typeEtab = typeEtab;

      const typeEtablissementCollection: ITypeEtablissement[] = [{ id: 84851 }];
      jest.spyOn(typeEtablissementService, 'query').mockReturnValue(of(new HttpResponse({ body: typeEtablissementCollection })));
      const additionalTypeEtablissements = [typeEtab];
      const expectedCollection: ITypeEtablissement[] = [...additionalTypeEtablissements, ...typeEtablissementCollection];
      jest.spyOn(typeEtablissementService, 'addTypeEtablissementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      expect(typeEtablissementService.query).toHaveBeenCalled();
      expect(typeEtablissementService.addTypeEtablissementToCollectionIfMissing).toHaveBeenCalledWith(
        typeEtablissementCollection,
        ...additionalTypeEtablissements
      );
      expect(comp.typeEtablissementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Localite query and add missing value', () => {
      const etablissement: IEtablissement = { id: 456 };
      const localite: ILocalite = { id: 860 };
      etablissement.localite = localite;

      const localiteCollection: ILocalite[] = [{ id: 31103 }];
      jest.spyOn(localiteService, 'query').mockReturnValue(of(new HttpResponse({ body: localiteCollection })));
      const additionalLocalites = [localite];
      const expectedCollection: ILocalite[] = [...additionalLocalites, ...localiteCollection];
      jest.spyOn(localiteService, 'addLocaliteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      expect(localiteService.query).toHaveBeenCalled();
      expect(localiteService.addLocaliteToCollectionIfMissing).toHaveBeenCalledWith(localiteCollection, ...additionalLocalites);
      expect(comp.localitesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etablissement: IEtablissement = { id: 456 };
      const typeEtab: ITypeEtablissement = { id: 93651 };
      etablissement.typeEtab = typeEtab;
      const localite: ILocalite = { id: 17242 };
      etablissement.localite = localite;

      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(etablissement));
      expect(comp.typeEtablissementsSharedCollection).toContain(typeEtab);
      expect(comp.localitesSharedCollection).toContain(localite);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Etablissement>>();
      const etablissement = { id: 123 };
      jest.spyOn(etablissementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etablissement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(etablissementService.update).toHaveBeenCalledWith(etablissement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Etablissement>>();
      const etablissement = new Etablissement();
      jest.spyOn(etablissementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etablissement }));
      saveSubject.complete();

      // THEN
      expect(etablissementService.create).toHaveBeenCalledWith(etablissement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Etablissement>>();
      const etablissement = { id: 123 };
      jest.spyOn(etablissementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etablissement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etablissementService.update).toHaveBeenCalledWith(etablissement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTypeEtablissementById', () => {
      it('Should return tracked TypeEtablissement primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTypeEtablissementById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackLocaliteById', () => {
      it('Should return tracked Localite primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLocaliteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
