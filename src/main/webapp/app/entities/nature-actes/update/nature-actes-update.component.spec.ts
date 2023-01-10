import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NatureActesService } from '../service/nature-actes.service';
import { INatureActes, NatureActes } from '../nature-actes.model';

import { NatureActesUpdateComponent } from './nature-actes-update.component';

describe('NatureActes Management Update Component', () => {
  let comp: NatureActesUpdateComponent;
  let fixture: ComponentFixture<NatureActesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let natureActesService: NatureActesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NatureActesUpdateComponent],
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
      .overrideTemplate(NatureActesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NatureActesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    natureActesService = TestBed.inject(NatureActesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const natureActes: INatureActes = { id: 456 };

      activatedRoute.data = of({ natureActes });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(natureActes));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NatureActes>>();
      const natureActes = { id: 123 };
      jest.spyOn(natureActesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ natureActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: natureActes }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(natureActesService.update).toHaveBeenCalledWith(natureActes);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NatureActes>>();
      const natureActes = new NatureActes();
      jest.spyOn(natureActesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ natureActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: natureActes }));
      saveSubject.complete();

      // THEN
      expect(natureActesService.create).toHaveBeenCalledWith(natureActes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NatureActes>>();
      const natureActes = { id: 123 };
      jest.spyOn(natureActesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ natureActes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(natureActesService.update).toHaveBeenCalledWith(natureActes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
