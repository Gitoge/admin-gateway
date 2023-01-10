import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BilleteurService } from '../service/billeteur.service';
import { IBilleteur, Billeteur } from '../billeteur.model';

import { BilleteurUpdateComponent } from './billeteur-update.component';

describe('Billeteur Management Update Component', () => {
  let comp: BilleteurUpdateComponent;
  let fixture: ComponentFixture<BilleteurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let billeteurService: BilleteurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BilleteurUpdateComponent],
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
      .overrideTemplate(BilleteurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BilleteurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    billeteurService = TestBed.inject(BilleteurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const billeteur: IBilleteur = { id: 456 };

      activatedRoute.data = of({ billeteur });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(billeteur));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Billeteur>>();
      const billeteur = { id: 123 };
      jest.spyOn(billeteurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ billeteur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: billeteur }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(billeteurService.update).toHaveBeenCalledWith(billeteur);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Billeteur>>();
      const billeteur = new Billeteur();
      jest.spyOn(billeteurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ billeteur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: billeteur }));
      saveSubject.complete();

      // THEN
      expect(billeteurService.create).toHaveBeenCalledWith(billeteur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Billeteur>>();
      const billeteur = { id: 123 };
      jest.spyOn(billeteurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ billeteur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(billeteurService.update).toHaveBeenCalledWith(billeteur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
