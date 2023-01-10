import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GrilleSoldeGlobalService } from '../service/grille-solde-global.service';
import { IGrilleSoldeGlobal, GrilleSoldeGlobal } from '../grille-solde-global.model';

import { GrilleSoldeGlobalUpdateComponent } from './grille-solde-global-update.component';

describe('GrilleSoldeGlobal Management Update Component', () => {
  let comp: GrilleSoldeGlobalUpdateComponent;
  let fixture: ComponentFixture<GrilleSoldeGlobalUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grilleSoldeGlobalService: GrilleSoldeGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GrilleSoldeGlobalUpdateComponent],
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
      .overrideTemplate(GrilleSoldeGlobalUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrilleSoldeGlobalUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grilleSoldeGlobalService = TestBed.inject(GrilleSoldeGlobalService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const grilleSoldeGlobal: IGrilleSoldeGlobal = { id: 456 };

      activatedRoute.data = of({ grilleSoldeGlobal });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(grilleSoldeGlobal));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrilleSoldeGlobal>>();
      const grilleSoldeGlobal = { id: 123 };
      jest.spyOn(grilleSoldeGlobalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grilleSoldeGlobal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grilleSoldeGlobal }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(grilleSoldeGlobalService.update).toHaveBeenCalledWith(grilleSoldeGlobal);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrilleSoldeGlobal>>();
      const grilleSoldeGlobal = new GrilleSoldeGlobal();
      jest.spyOn(grilleSoldeGlobalService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grilleSoldeGlobal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grilleSoldeGlobal }));
      saveSubject.complete();

      // THEN
      expect(grilleSoldeGlobalService.create).toHaveBeenCalledWith(grilleSoldeGlobal);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<GrilleSoldeGlobal>>();
      const grilleSoldeGlobal = { id: 123 };
      jest.spyOn(grilleSoldeGlobalService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grilleSoldeGlobal });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grilleSoldeGlobalService.update).toHaveBeenCalledWith(grilleSoldeGlobal);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
