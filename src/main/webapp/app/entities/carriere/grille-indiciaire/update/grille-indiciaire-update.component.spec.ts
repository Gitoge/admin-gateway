import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GrilleIndiciaireService } from '../service/grille-indiciaire.service';
import { IGrilleIndiciaire, GrilleIndiciaire } from '../grille-indiciaire.model';
import { IIndices } from 'app/entities/carriere/indices/indices.model';
import { IndicesService } from 'app/entities/carriere/indices/service/indices.service';

import { GrilleIndiciaireUpdateComponent } from './grille-indiciaire-update.component';

describe('GrilleIndiciaire Management Update Component', () => {
  let comp: GrilleIndiciaireUpdateComponent;
  let fixture: ComponentFixture<GrilleIndiciaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grilleIndiciaireService: GrilleIndiciaireService;
  let indicesService: IndicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GrilleIndiciaireUpdateComponent],
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
      .overrideTemplate(GrilleIndiciaireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrilleIndiciaireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grilleIndiciaireService = TestBed.inject(GrilleIndiciaireService);
    indicesService = TestBed.inject(IndicesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Indices query and add missing value', () => {
      const grilleIndiciaire: IGrilleIndiciaire = { id: 456 };
      const indices: IIndices = { id: 75854 };
      grilleIndiciaire.indices = indices;

      const indicesCollection: IIndices[] = [{ id: 31183 }];
      jest.spyOn(indicesService, 'query').mockReturnValue(of(new HttpResponse({ body: indicesCollection })));
      const additionalIndices = [indices];
      const expectedCollection: IIndices[] = [...additionalIndices, ...indicesCollection];
      jest.spyOn(indicesService, 'addIndicesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ grilleIndiciaire });
      comp.ngOnInit();

      expect(indicesService.query).toHaveBeenCalled();
      expect(indicesService.addIndicesToCollectionIfMissing).toHaveBeenCalledWith(indicesCollection, ...additionalIndices);
      expect(comp.indicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const grilleIndiciaire: IGrilleIndiciaire = { id: 456 };
      const indices: IIndices = { id: 40029 };
      grilleIndiciaire.indices = indices;

      activatedRoute.data = of({ grilleIndiciaire });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(grilleIndiciaire));
      expect(comp.indicesSharedCollection).toContain(indices);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrilleIndiciaire>>();
      const grilleIndiciaire = { id: 123 };
      jest.spyOn(grilleIndiciaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grilleIndiciaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grilleIndiciaire }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(grilleIndiciaireService.update).toHaveBeenCalledWith(grilleIndiciaire);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrilleIndiciaire>>();
      const grilleIndiciaire = new GrilleIndiciaire();
      jest.spyOn(grilleIndiciaireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grilleIndiciaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grilleIndiciaire }));
      saveSubject.complete();

      // THEN
      expect(grilleIndiciaireService.create).toHaveBeenCalledWith(grilleIndiciaire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrilleIndiciaire>>();
      const grilleIndiciaire = { id: 123 };
      jest.spyOn(grilleIndiciaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grilleIndiciaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grilleIndiciaireService.update).toHaveBeenCalledWith(grilleIndiciaire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackIndicesById', () => {
      it('Should return tracked Indices primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackIndicesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
