jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ArrondissementService } from '../service/arrondissement.service';
import { IArrondissement, Arrondissement } from '../arrondissement.model';
import { IDepartement } from 'app/entities/departement/departement.model';
import { DepartementService } from 'app/entities/departement/service/departement.service';

import { ArrondissementUpdateComponent } from './arrondissement-update.component';

describe('Component Tests', () => {
  describe('Arrondissement Management Update Component', () => {
    let comp: ArrondissementUpdateComponent;
    let fixture: ComponentFixture<ArrondissementUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let arrondissementService: ArrondissementService;
    let departementService: DepartementService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ArrondissementUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ArrondissementUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ArrondissementUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      arrondissementService = TestBed.inject(ArrondissementService);
      departementService = TestBed.inject(DepartementService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Departement query and add missing value', () => {
        const arrondissement: IArrondissement = { id: 456 };
        const departement: IDepartement = { id: 53424 };
        arrondissement.departement = departement;

        const departementCollection: IDepartement[] = [{ id: 66067 }];
        jest.spyOn(departementService, 'query').mockReturnValue(of(new HttpResponse({ body: departementCollection })));
        const additionalDepartements = [departement];
        const expectedCollection: IDepartement[] = [...additionalDepartements, ...departementCollection];
        jest.spyOn(departementService, 'addDepartementToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ arrondissement });
        comp.ngOnInit();

        expect(departementService.query).toHaveBeenCalled();
        expect(departementService.addDepartementToCollectionIfMissing).toHaveBeenCalledWith(
          departementCollection,
          ...additionalDepartements
        );
        expect(comp.departementsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const arrondissement: IArrondissement = { id: 456 };
        const departement: IDepartement = { id: 96223 };
        arrondissement.departement = departement;

        activatedRoute.data = of({ arrondissement });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(arrondissement));
        expect(comp.departementsSharedCollection).toContain(departement);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Arrondissement>>();
        const arrondissement = { id: 123 };
        jest.spyOn(arrondissementService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ arrondissement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: arrondissement }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(arrondissementService.update).toHaveBeenCalledWith(arrondissement);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Arrondissement>>();
        const arrondissement = new Arrondissement();
        jest.spyOn(arrondissementService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ arrondissement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: arrondissement }));
        saveSubject.complete();

        // THEN
        expect(arrondissementService.create).toHaveBeenCalledWith(arrondissement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Arrondissement>>();
        const arrondissement = { id: 123 };
        jest.spyOn(arrondissementService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ arrondissement });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(arrondissementService.update).toHaveBeenCalledWith(arrondissement);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackDepartementById', () => {
        it('Should return tracked Departement primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackDepartementById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
