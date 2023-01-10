import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TableValeurService } from '../service/table-valeur.service';
import { ITableValeur, TableValeur } from '../table-valeur.model';
import { ITableTypeValeur } from 'app/entities/table-type-valeur/table-type-valeur.model';
import { TableTypeValeurService } from 'app/entities/table-type-valeur/service/table-type-valeur.service';

import { TableValeurUpdateComponent } from './table-valeur-update.component';

describe('TableValeur Management Update Component', () => {
  let comp: TableValeurUpdateComponent;
  let fixture: ComponentFixture<TableValeurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tableValeurService: TableValeurService;
  let tableTypeValeurService: TableTypeValeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TableValeurUpdateComponent],
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
      .overrideTemplate(TableValeurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TableValeurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tableValeurService = TestBed.inject(TableValeurService);
    tableTypeValeurService = TestBed.inject(TableTypeValeurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TableTypeValeur query and add missing value', () => {
      const tableValeur: ITableValeur = { id: 456 };
      const tabletypevaleur: ITableTypeValeur = { id: 85860 };
      tableValeur.tabletypevaleur = tabletypevaleur;

      const tableTypeValeurCollection: ITableTypeValeur[] = [{ id: 93345 }];
      jest.spyOn(tableTypeValeurService, 'query').mockReturnValue(of(new HttpResponse({ body: tableTypeValeurCollection })));
      const additionalTableTypeValeurs = [tabletypevaleur];
      const expectedCollection: ITableTypeValeur[] = [...additionalTableTypeValeurs, ...tableTypeValeurCollection];
      jest.spyOn(tableTypeValeurService, 'addTableTypeValeurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ tableValeur });
      comp.ngOnInit();

      expect(tableTypeValeurService.query).toHaveBeenCalled();
      expect(tableTypeValeurService.addTableTypeValeurToCollectionIfMissing).toHaveBeenCalledWith(
        tableTypeValeurCollection,
        ...additionalTableTypeValeurs
      );
      expect(comp.tableTypeValeursSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const tableValeur: ITableValeur = { id: 456 };
      const tabletypevaleur: ITableTypeValeur = { id: 6919 };
      tableValeur.tabletypevaleur = tabletypevaleur;

      activatedRoute.data = of({ tableValeur });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(tableValeur));
      expect(comp.tableTypeValeursSharedCollection).toContain(tabletypevaleur);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TableValeur>>();
      const tableValeur = { id: 123 };
      jest.spyOn(tableValeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tableValeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tableValeur }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(tableValeurService.update).toHaveBeenCalledWith(tableValeur);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TableValeur>>();
      const tableValeur = new TableValeur();
      jest.spyOn(tableValeurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tableValeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tableValeur }));
      saveSubject.complete();

      // THEN
      expect(tableValeurService.create).toHaveBeenCalledWith(tableValeur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TableValeur>>();
      const tableValeur = { id: 123 };
      jest.spyOn(tableValeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tableValeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tableValeurService.update).toHaveBeenCalledWith(tableValeur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTableTypeValeurById', () => {
      it('Should return tracked TableTypeValeur primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTableTypeValeurById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
