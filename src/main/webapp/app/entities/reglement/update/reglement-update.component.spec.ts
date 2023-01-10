import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReglementService } from '../service/reglement.service';
import { IReglement, Reglement } from '../reglement.model';
import { ITypeReglement } from 'app/entities/type-reglement/type-reglement.model';
import { TypeReglementService } from 'app/entities/type-reglement/service/type-reglement.service';

import { ReglementUpdateComponent } from './reglement-update.component';

describe('Reglement Management Update Component', () => {
  let comp: ReglementUpdateComponent;
  let fixture: ComponentFixture<ReglementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reglementService: ReglementService;
  let typeReglementService: TypeReglementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReglementUpdateComponent],
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
      .overrideTemplate(ReglementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReglementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reglementService = TestBed.inject(ReglementService);
    typeReglementService = TestBed.inject(TypeReglementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypeReglement query and add missing value', () => {
      const reglement: IReglement = { id: 456 };
      const typereglement: ITypeReglement = { id: 10984 };
      reglement.typereglement = typereglement;

      const typeReglementCollection: ITypeReglement[] = [{ id: 87043 }];
      jest.spyOn(typeReglementService, 'query').mockReturnValue(of(new HttpResponse({ body: typeReglementCollection })));
      const additionalTypeReglements = [typereglement];
      const expectedCollection: ITypeReglement[] = [...additionalTypeReglements, ...typeReglementCollection];
      jest.spyOn(typeReglementService, 'addTypeReglementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reglement });
      comp.ngOnInit();

      expect(typeReglementService.query).toHaveBeenCalled();
      expect(typeReglementService.addTypeReglementToCollectionIfMissing).toHaveBeenCalledWith(
        typeReglementCollection,
        ...additionalTypeReglements
      );
      expect(comp.typeReglementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reglement: IReglement = { id: 456 };
      const typereglement: ITypeReglement = { id: 90972 };
      reglement.typereglement = typereglement;

      activatedRoute.data = of({ reglement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(reglement));
      expect(comp.typeReglementsSharedCollection).toContain(typereglement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reglement>>();
      const reglement = { id: 123 };
      jest.spyOn(reglementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reglement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reglement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(reglementService.update).toHaveBeenCalledWith(reglement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reglement>>();
      const reglement = new Reglement();
      jest.spyOn(reglementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reglement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reglement }));
      saveSubject.complete();

      // THEN
      expect(reglementService.create).toHaveBeenCalledWith(reglement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Reglement>>();
      const reglement = { id: 123 };
      jest.spyOn(reglementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reglement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reglementService.update).toHaveBeenCalledWith(reglement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTypeReglementById', () => {
      it('Should return tracked TypeReglement primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTypeReglementById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
