import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EchelonService } from '../service/echelon.service';
import { IEchelon, Echelon } from '../echelon.model';

import { EchelonUpdateComponent } from './echelon-update.component';

describe('Echelon Management Update Component', () => {
  let comp: EchelonUpdateComponent;
  let fixture: ComponentFixture<EchelonUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let echelonService: EchelonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EchelonUpdateComponent],
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
      .overrideTemplate(EchelonUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EchelonUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    echelonService = TestBed.inject(EchelonService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const echelon: IEchelon = { id: 456 };

      activatedRoute.data = of({ echelon });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(echelon));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Echelon>>();
      const echelon = { id: 123 };
      jest.spyOn(echelonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ echelon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: echelon }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(echelonService.update).toHaveBeenCalledWith(echelon);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Echelon>>();
      const echelon = new Echelon();
      jest.spyOn(echelonService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ echelon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: echelon }));
      saveSubject.complete();

      // THEN
      expect(echelonService.create).toHaveBeenCalledWith(echelon);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Echelon>>();
      const echelon = { id: 123 };
      jest.spyOn(echelonService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ echelon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(echelonService.update).toHaveBeenCalledWith(echelon);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
