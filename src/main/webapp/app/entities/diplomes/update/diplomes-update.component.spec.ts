import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DiplomesService } from '../service/diplomes.service';
import { IDiplomes, Diplomes } from '../diplomes.model';

import { DiplomesUpdateComponent } from './diplomes-update.component';

describe('Diplomes Management Update Component', () => {
  let comp: DiplomesUpdateComponent;
  let fixture: ComponentFixture<DiplomesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let diplomesService: DiplomesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DiplomesUpdateComponent],
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
      .overrideTemplate(DiplomesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiplomesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    diplomesService = TestBed.inject(DiplomesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const diplomes: IDiplomes = { id: 456 };

      activatedRoute.data = of({ diplomes });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(diplomes));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Diplomes>>();
      const diplomes = { id: 123 };
      jest.spyOn(diplomesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diplomes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: diplomes }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(diplomesService.update).toHaveBeenCalledWith(diplomes);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Diplomes>>();
      const diplomes = new Diplomes();
      jest.spyOn(diplomesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diplomes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: diplomes }));
      saveSubject.complete();

      // THEN
      expect(diplomesService.create).toHaveBeenCalledWith(diplomes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Diplomes>>();
      const diplomes = { id: 123 };
      jest.spyOn(diplomesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ diplomes });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(diplomesService.update).toHaveBeenCalledWith(diplomes);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
