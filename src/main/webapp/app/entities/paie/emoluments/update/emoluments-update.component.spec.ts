import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmolumentsService } from '../service/emoluments.service';
import { IEmoluments, Emoluments } from '../emoluments.model';
import { IPostes } from 'app/entities/paie/postes/postes.model';
import { PostesService } from 'app/entities/paie/postes/service/postes.service';

import { EmolumentsUpdateComponent } from './emoluments-update.component';

describe('Emoluments Management Update Component', () => {
  let comp: EmolumentsUpdateComponent;
  let fixture: ComponentFixture<EmolumentsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emolumentsService: EmolumentsService;
  let postesService: PostesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmolumentsUpdateComponent],
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
      .overrideTemplate(EmolumentsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmolumentsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emolumentsService = TestBed.inject(EmolumentsService);
    postesService = TestBed.inject(PostesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Postes query and add missing value', () => {
      const emoluments: IEmoluments = { id: 456 };
      const postes: IPostes = { id: 15012 };
      emoluments.postes = postes;

      const postesCollection: IPostes[] = [{ id: 2931 }];
      jest.spyOn(postesService, 'query').mockReturnValue(of(new HttpResponse({ body: postesCollection })));
      const additionalPostes = [postes];
      const expectedCollection: IPostes[] = [...additionalPostes, ...postesCollection];
      jest.spyOn(postesService, 'addPostesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ emoluments });
      comp.ngOnInit();

      expect(postesService.query).toHaveBeenCalled();
      expect(postesService.addPostesToCollectionIfMissing).toHaveBeenCalledWith(postesCollection, ...additionalPostes);
      expect(comp.postesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const emoluments: IEmoluments = { id: 456 };
      const postes: IPostes = { id: 7018 };
      emoluments.postes = postes;

      activatedRoute.data = of({ emoluments });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(emoluments));
      expect(comp.postesSharedCollection).toContain(postes);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Emoluments>>();
      const emoluments = { id: 123 };
      jest.spyOn(emolumentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emoluments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emoluments }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(emolumentsService.update).toHaveBeenCalledWith(emoluments);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Emoluments>>();
      const emoluments = new Emoluments();
      jest.spyOn(emolumentsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emoluments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emoluments }));
      saveSubject.complete();

      // THEN
      expect(emolumentsService.create).toHaveBeenCalledWith(emoluments);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Emoluments>>();
      const emoluments = { id: 123 };
      jest.spyOn(emolumentsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emoluments });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emolumentsService.update).toHaveBeenCalledWith(emoluments);
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
});
