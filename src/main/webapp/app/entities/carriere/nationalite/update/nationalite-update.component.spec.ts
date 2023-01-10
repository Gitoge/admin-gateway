import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NationaliteService } from '../service/nationalite.service';
import { INationalite, Nationalite } from '../nationalite.model';

import { NationaliteUpdateComponent } from './nationalite-update.component';

describe('Nationalite Management Update Component', () => {
  let comp: NationaliteUpdateComponent;
  let fixture: ComponentFixture<NationaliteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let nationaliteService: NationaliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NationaliteUpdateComponent],
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
      .overrideTemplate(NationaliteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NationaliteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    nationaliteService = TestBed.inject(NationaliteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const nationalite: INationalite = { id: 456 };

      activatedRoute.data = of({ nationalite });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(nationalite));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Nationalite>>();
      const nationalite = { id: 123 };
      jest.spyOn(nationaliteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nationalite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nationalite }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(nationaliteService.update).toHaveBeenCalledWith(nationalite);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Nationalite>>();
      const nationalite = new Nationalite();
      jest.spyOn(nationaliteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nationalite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: nationalite }));
      saveSubject.complete();

      // THEN
      expect(nationaliteService.create).toHaveBeenCalledWith(nationalite);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Nationalite>>();
      const nationalite = { id: 123 };
      jest.spyOn(nationaliteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ nationalite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(nationaliteService.update).toHaveBeenCalledWith(nationalite);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
