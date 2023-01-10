import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PriseEnCompteService } from '../service/prise-en-compte.service';
import { IPriseEnCompte, PriseEnCompte } from '../prise-en-compte.model';

import { PriseEnCompteSlideUpdateComponent } from './prise-en-compte-slide-update.component';

describe('PriseEnCompte Management Update Component', () => {
  let comp: PriseEnCompteSlideUpdateComponent;
  let fixture: ComponentFixture<PriseEnCompteSlideUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let priseEncompteService: PriseEnCompteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PriseEnCompteSlideUpdateComponent],
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
      .overrideTemplate(PriseEnCompteSlideUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PriseEnCompteSlideUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    priseEncompteService = TestBed.inject(PriseEnCompteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const priseEncompte: IPriseEnCompte = { id: 456 };

      activatedRoute.data = of({ priseEncompte });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(priseEncompte));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PriseEnCompte>>();
      const priseEncompte = { id: 123 };
      jest.spyOn(priseEncompteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ priseEncompte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: priseEncompte }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(priseEncompteService.update).toHaveBeenCalledWith(priseEncompte);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PriseEnCompte>>();
      const priseEncompte = new PriseEnCompte();
      jest.spyOn(priseEncompteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ priseEncompte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: priseEncompte }));
      saveSubject.complete();

      // THEN
      expect(priseEncompteService.create).toHaveBeenCalledWith(priseEncompte);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PriseEnCompte>>();
      const priseEncompte = { id: 123 };
      jest.spyOn(priseEncompteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ priseEncompte });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(priseEncompteService.update).toHaveBeenCalledWith(priseEncompte);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
