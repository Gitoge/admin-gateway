import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EvenementService } from '../service/evenement.service';
import { IEvenement, Evenement } from '../evenement.model';

import { EvenementUpdateComponent } from './evenement-update.component';

describe('Evenement Management Update Component', () => {
  let comp: EvenementUpdateComponent;
  let fixture: ComponentFixture<EvenementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let evenementService: EvenementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EvenementUpdateComponent],
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
      .overrideTemplate(EvenementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EvenementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    evenementService = TestBed.inject(EvenementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const evenement: IEvenement = { id: 456 };

      activatedRoute.data = of({ evenement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(evenement));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Evenement>>();
      const evenement = { id: 123 };
      jest.spyOn(evenementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ evenement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: evenement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(evenementService.update).toHaveBeenCalledWith(evenement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Evenement>>();
      const evenement = new Evenement();
      jest.spyOn(evenementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ evenement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: evenement }));
      saveSubject.complete();

      // THEN
      expect(evenementService.create).toHaveBeenCalledWith(evenement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Evenement>>();
      const evenement = { id: 123 };
      jest.spyOn(evenementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ evenement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(evenementService.update).toHaveBeenCalledWith(evenement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
