import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SaisieElementsVariablesService } from '../service/saisie-elements-variables.service';
import { ISaisieElementsVariables, SaisieElementsVariables } from '../saisie-elements-variables.model';
import { IPeriodePaye } from 'app/entities/paie/periode-paye/periode-paye.model';
import { PeriodePayeService } from 'app/entities/paie/periode-paye/service/periode-paye.service';
import { IPostes } from 'app/entities/paie/postes/postes.model';
import { PostesService } from 'app/entities/paie/postes/service/postes.service';

import { SaisieElementsVariablesUpdateComponent } from './saisie-elements-variables-update.component';

describe('SaisieElementsVariables Management Update Component', () => {
  let comp: SaisieElementsVariablesUpdateComponent;
  let fixture: ComponentFixture<SaisieElementsVariablesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let saisieElementsVariablesService: SaisieElementsVariablesService;
  let periodePayeService: PeriodePayeService;
  let postesService: PostesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SaisieElementsVariablesUpdateComponent],
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
      .overrideTemplate(SaisieElementsVariablesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SaisieElementsVariablesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    saisieElementsVariablesService = TestBed.inject(SaisieElementsVariablesService);
    periodePayeService = TestBed.inject(PeriodePayeService);
    postesService = TestBed.inject(PostesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PeriodePaye query and add missing value', () => {
      const saisieElementsVariables: ISaisieElementsVariables = { id: 456 };
      const periodePaye: IPeriodePaye = { id: 24824 };
      saisieElementsVariables.periodePaye = periodePaye;

      const periodePayeCollection: IPeriodePaye[] = [{ id: 28534 }];
      jest.spyOn(periodePayeService, 'query').mockReturnValue(of(new HttpResponse({ body: periodePayeCollection })));
      const additionalPeriodePayes = [periodePaye];
      const expectedCollection: IPeriodePaye[] = [...additionalPeriodePayes, ...periodePayeCollection];
      jest.spyOn(periodePayeService, 'addPeriodePayeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ saisieElementsVariables });
      comp.ngOnInit();

      expect(periodePayeService.query).toHaveBeenCalled();
      expect(periodePayeService.addPeriodePayeToCollectionIfMissing).toHaveBeenCalledWith(periodePayeCollection, ...additionalPeriodePayes);
      expect(comp.periodePayesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Postes query and add missing value', () => {
      const saisieElementsVariables: ISaisieElementsVariables = { id: 456 };
      const postes: IPostes = { id: 47887 };
      saisieElementsVariables.postes = postes;

      const postesCollection: IPostes[] = [{ id: 24837 }];
      jest.spyOn(postesService, 'query').mockReturnValue(of(new HttpResponse({ body: postesCollection })));
      const additionalPostes = [postes];
      const expectedCollection: IPostes[] = [...additionalPostes, ...postesCollection];
      jest.spyOn(postesService, 'addPostesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ saisieElementsVariables });
      comp.ngOnInit();

      expect(postesService.query).toHaveBeenCalled();
      expect(postesService.addPostesToCollectionIfMissing).toHaveBeenCalledWith(postesCollection, ...additionalPostes);
      expect(comp.postesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const saisieElementsVariables: ISaisieElementsVariables = { id: 456 };
      const periodePaye: IPeriodePaye = { id: 65561 };
      saisieElementsVariables.periodePaye = periodePaye;
      const postes: IPostes = { id: 49558 };
      saisieElementsVariables.postes = postes;

      activatedRoute.data = of({ saisieElementsVariables });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(saisieElementsVariables));
      expect(comp.periodePayesSharedCollection).toContain(periodePaye);
      expect(comp.postesSharedCollection).toContain(postes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SaisieElementsVariables>>();
      const saisieElementsVariables = { id: 123 };
      jest.spyOn(saisieElementsVariablesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saisieElementsVariables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: saisieElementsVariables }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(saisieElementsVariablesService.update).toHaveBeenCalledWith(saisieElementsVariables);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SaisieElementsVariables>>();
      const saisieElementsVariables = new SaisieElementsVariables();
      jest.spyOn(saisieElementsVariablesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saisieElementsVariables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: saisieElementsVariables }));
      saveSubject.complete();

      // THEN
      expect(saisieElementsVariablesService.create).toHaveBeenCalledWith(saisieElementsVariables);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SaisieElementsVariables>>();
      const saisieElementsVariables = { id: 123 };
      jest.spyOn(saisieElementsVariablesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saisieElementsVariables });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(saisieElementsVariablesService.update).toHaveBeenCalledWith(saisieElementsVariables);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPeriodePayeById', () => {
      it('Should return tracked PeriodePaye primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPeriodePayeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPostesById', () => {
      it('Should return tracked Postes primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPostesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
