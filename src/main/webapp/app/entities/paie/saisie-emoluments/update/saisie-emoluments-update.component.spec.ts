import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SaisieEmolumentsService } from '../service/saisie-emoluments.service';
import { ISaisieEmoluments, SaisieEmoluments } from '../saisie-emoluments.model';
import { IPeriodePaye } from 'app/entities/paie/periode-paye/periode-paye.model';
import { PeriodePayeService } from 'app/entities/paie/periode-paye/service/periode-paye.service';
import { IPostes } from 'app/entities/paie/postes/postes.model';
import { PostesService } from 'app/entities/paie/postes/service/postes.service';

import { SaisieEmolumentsUpdateComponent } from './saisie-emoluments-update.component';

describe('SaisieEmoluments Management Update Component', () => {
  let comp: SaisieEmolumentsUpdateComponent;
  let fixture: ComponentFixture<SaisieEmolumentsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let saisieEmolumentsService: SaisieEmolumentsService;
  let periodePayeService: PeriodePayeService;
  let postesService: PostesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SaisieEmolumentsUpdateComponent],
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
      .overrideTemplate(SaisieEmolumentsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SaisieEmolumentsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    saisieEmolumentsService = TestBed.inject(SaisieEmolumentsService);
    periodePayeService = TestBed.inject(PeriodePayeService);
    postesService = TestBed.inject(PostesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PeriodePaye query and add missing value', () => {
      const saisieEmoluments: ISaisieEmoluments = { id: 456 };
      const periodePaye: IPeriodePaye = { id: 70997 };
      saisieEmoluments.periodePaye = periodePaye;

      const periodePayeCollection: IPeriodePaye[] = [{ id: 42119 }];
      jest.spyOn(periodePayeService, 'query').mockReturnValue(of(new HttpResponse({ body: periodePayeCollection })));
      const additionalPeriodePayes = [periodePaye];
      const expectedCollection: IPeriodePaye[] = [...additionalPeriodePayes, ...periodePayeCollection];
      jest.spyOn(periodePayeService, 'addPeriodePayeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ saisieEmoluments });
      comp.ngOnInit();

      expect(periodePayeService.query).toHaveBeenCalled();
      expect(periodePayeService.addPeriodePayeToCollectionIfMissing).toHaveBeenCalledWith(periodePayeCollection, ...additionalPeriodePayes);
      expect(comp.periodePayesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Postes query and add missing value', () => {
      const saisieEmoluments: ISaisieEmoluments = { id: 456 };
      const postes: IPostes = { id: 23141 };
      saisieEmoluments.postes = postes;

      const postesCollection: IPostes[] = [{ id: 18916 }];
      jest.spyOn(postesService, 'query').mockReturnValue(of(new HttpResponse({ body: postesCollection })));
      const additionalPostes = [postes];
      const expectedCollection: IPostes[] = [...additionalPostes, ...postesCollection];
      jest.spyOn(postesService, 'addPostesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ saisieEmoluments });
      comp.ngOnInit();

      expect(postesService.query).toHaveBeenCalled();
      expect(postesService.addPostesToCollectionIfMissing).toHaveBeenCalledWith(postesCollection, ...additionalPostes);
      expect(comp.postesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const saisieEmoluments: ISaisieEmoluments = { id: 456 };
      const periodePaye: IPeriodePaye = { id: 40755 };
      saisieEmoluments.periodePaye = periodePaye;
      const postes: IPostes = { id: 29422 };
      saisieEmoluments.postes = postes;

      activatedRoute.data = of({ saisieEmoluments });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(saisieEmoluments));
      expect(comp.periodePayesSharedCollection).toContain(periodePaye);
      expect(comp.postesSharedCollection).toContain(postes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SaisieEmoluments>>();
      const saisieEmoluments = { id: 123 };
      jest.spyOn(saisieEmolumentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saisieEmoluments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: saisieEmoluments }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(saisieEmolumentsService.update).toHaveBeenCalledWith(saisieEmoluments);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SaisieEmoluments>>();
      const saisieEmoluments = new SaisieEmoluments();
      jest.spyOn(saisieEmolumentsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saisieEmoluments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: saisieEmoluments }));
      saveSubject.complete();

      // THEN
      expect(saisieEmolumentsService.create).toHaveBeenCalledWith(saisieEmoluments);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SaisieEmoluments>>();
      const saisieEmoluments = { id: 123 };
      jest.spyOn(saisieEmolumentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ saisieEmoluments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(saisieEmolumentsService.update).toHaveBeenCalledWith(saisieEmoluments);
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
