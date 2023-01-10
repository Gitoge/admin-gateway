import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { HierarchieService } from '../service/hierarchie.service';
import { IHierarchie, Hierarchie } from '../hierarchie.model';
import { IPostes } from 'app/entities/postes/postes.model';
import { PostesService } from 'app/entities/postes/service/postes.service';

import { HierarchieUpdateComponent } from './hierarchie-update.component';

describe('Hierarchie Management Update Component', () => {
  let comp: HierarchieUpdateComponent;
  let fixture: ComponentFixture<HierarchieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let hierarchieService: HierarchieService;
  let postesService: PostesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [HierarchieUpdateComponent],
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
      .overrideTemplate(HierarchieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(HierarchieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    hierarchieService = TestBed.inject(HierarchieService);
    postesService = TestBed.inject(PostesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Postes query and add missing value', () => {
      const hierarchie: IHierarchie = { id: 456 };
      const postes: IPostes[] = [{ id: 28697 }];
      hierarchie.postes = postes;

      const postesCollection: IPostes[] = [{ id: 81567 }];
      jest.spyOn(postesService, 'query').mockReturnValue(of(new HttpResponse({ body: postesCollection })));
      const additionalPostes = [...postes];
      const expectedCollection: IPostes[] = [...additionalPostes, ...postesCollection];
      jest.spyOn(postesService, 'addPostesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ hierarchie });
      comp.ngOnInit();

      expect(postesService.query).toHaveBeenCalled();
      expect(postesService.addPostesToCollectionIfMissing).toHaveBeenCalledWith(postesCollection, ...additionalPostes);
      expect(comp.postesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const hierarchie: IHierarchie = { id: 456 };
      const postes: IPostes = { id: 90671 };
      hierarchie.postes = [postes];

      activatedRoute.data = of({ hierarchie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(hierarchie));
      expect(comp.postesSharedCollection).toContain(postes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Hierarchie>>();
      const hierarchie = { id: 123 };
      jest.spyOn(hierarchieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hierarchie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hierarchie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(hierarchieService.update).toHaveBeenCalledWith(hierarchie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Hierarchie>>();
      const hierarchie = new Hierarchie();
      jest.spyOn(hierarchieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hierarchie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: hierarchie }));
      saveSubject.complete();

      // THEN
      expect(hierarchieService.create).toHaveBeenCalledWith(hierarchie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Hierarchie>>();
      const hierarchie = { id: 123 };
      jest.spyOn(hierarchieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ hierarchie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(hierarchieService.update).toHaveBeenCalledWith(hierarchie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPostesById', () => {
      it('Should return tracked Postes primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPostesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedPostes', () => {
      it('Should return option if no Postes is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedPostes(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Postes for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedPostes(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Postes is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedPostes(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});
