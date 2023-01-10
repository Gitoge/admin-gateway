import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TableTypeValeurService } from '../service/table-type-valeur.service';
import { ITableTypeValeur, TableTypeValeur } from '../table-type-valeur.model';

import { TableTypeValeurUpdateComponent } from './table-type-valeur-update.component';

describe('TableTypeValeur Management Update Component', () => {
  let comp: TableTypeValeurUpdateComponent;
  let fixture: ComponentFixture<TableTypeValeurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let tableTypeValeurService: TableTypeValeurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TableTypeValeurUpdateComponent],
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
      .overrideTemplate(TableTypeValeurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TableTypeValeurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    tableTypeValeurService = TestBed.inject(TableTypeValeurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tableTypeValeur: ITableTypeValeur = { id: 456 };

      activatedRoute.data = of({ tableTypeValeur });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(tableTypeValeur));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TableTypeValeur>>();
      const tableTypeValeur = { id: 123 };
      jest.spyOn(tableTypeValeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tableTypeValeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tableTypeValeur }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(tableTypeValeurService.update).toHaveBeenCalledWith(tableTypeValeur);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TableTypeValeur>>();
      const tableTypeValeur = new TableTypeValeur();
      jest.spyOn(tableTypeValeurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tableTypeValeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tableTypeValeur }));
      saveSubject.complete();

      // THEN
      expect(tableTypeValeurService.create).toHaveBeenCalledWith(tableTypeValeur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TableTypeValeur>>();
      const tableTypeValeur = { id: 123 };
      jest.spyOn(tableTypeValeurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tableTypeValeur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(tableTypeValeurService.update).toHaveBeenCalledWith(tableTypeValeur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
