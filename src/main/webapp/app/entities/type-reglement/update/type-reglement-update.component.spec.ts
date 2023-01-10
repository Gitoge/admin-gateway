import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeReglementService } from '../service/type-reglement.service';
import { ITypeReglement, TypeReglement } from '../type-reglement.model';

import { TypeReglementUpdateComponent } from './type-reglement-update.component';

describe('TypeReglement Management Update Component', () => {
  let comp: TypeReglementUpdateComponent;
  let fixture: ComponentFixture<TypeReglementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeReglementService: TypeReglementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeReglementUpdateComponent],
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
      .overrideTemplate(TypeReglementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeReglementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeReglementService = TestBed.inject(TypeReglementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeReglement: ITypeReglement = { id: 456 };

      activatedRoute.data = of({ typeReglement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typeReglement));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeReglement>>();
      const typeReglement = { id: 123 };
      jest.spyOn(typeReglementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeReglement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeReglement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeReglementService.update).toHaveBeenCalledWith(typeReglement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeReglement>>();
      const typeReglement = new TypeReglement();
      jest.spyOn(typeReglementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeReglement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeReglement }));
      saveSubject.complete();

      // THEN
      expect(typeReglementService.create).toHaveBeenCalledWith(typeReglement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeReglement>>();
      const typeReglement = { id: 123 };
      jest.spyOn(typeReglementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeReglement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeReglementService.update).toHaveBeenCalledWith(typeReglement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
