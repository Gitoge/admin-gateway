import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BaremeCalculHeuresSuppService } from '../service/bareme-calcul-heures-supp.service';
import { IBaremeCalculHeuresSupp, BaremeCalculHeuresSupp } from '../bareme-calcul-heures-supp.model';

import { BaremeCalculHeuresSuppUpdateComponent } from './bareme-calcul-heures-supp-update.component';

describe('BaremeCalculHeuresSupp Management Update Component', () => {
  let comp: BaremeCalculHeuresSuppUpdateComponent;
  let fixture: ComponentFixture<BaremeCalculHeuresSuppUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let baremeCalculHeuresSuppService: BaremeCalculHeuresSuppService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BaremeCalculHeuresSuppUpdateComponent],
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
      .overrideTemplate(BaremeCalculHeuresSuppUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BaremeCalculHeuresSuppUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    baremeCalculHeuresSuppService = TestBed.inject(BaremeCalculHeuresSuppService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const baremeCalculHeuresSupp: IBaremeCalculHeuresSupp = { id: 456 };

      activatedRoute.data = of({ baremeCalculHeuresSupp });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(baremeCalculHeuresSupp));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BaremeCalculHeuresSupp>>();
      const baremeCalculHeuresSupp = { id: 123 };
      jest.spyOn(baremeCalculHeuresSuppService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ baremeCalculHeuresSupp });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: baremeCalculHeuresSupp }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(baremeCalculHeuresSuppService.update).toHaveBeenCalledWith(baremeCalculHeuresSupp);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BaremeCalculHeuresSupp>>();
      const baremeCalculHeuresSupp = new BaremeCalculHeuresSupp();
      jest.spyOn(baremeCalculHeuresSuppService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ baremeCalculHeuresSupp });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: baremeCalculHeuresSupp }));
      saveSubject.complete();

      // THEN
      expect(baremeCalculHeuresSuppService.create).toHaveBeenCalledWith(baremeCalculHeuresSupp);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BaremeCalculHeuresSupp>>();
      const baremeCalculHeuresSupp = { id: 123 };
      jest.spyOn(baremeCalculHeuresSuppService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ baremeCalculHeuresSupp });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(baremeCalculHeuresSuppService.update).toHaveBeenCalledWith(baremeCalculHeuresSupp);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
