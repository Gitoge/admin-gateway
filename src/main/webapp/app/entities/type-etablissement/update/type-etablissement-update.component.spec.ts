import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeEtablissementService } from '../service/type-etablissement.service';
import { ITypeEtablissement, TypeEtablissement } from '../type-etablissement.model';

import { TypeEtablissementUpdateComponent } from './type-etablissement-update.component';

describe('TypeEtablissement Management Update Component', () => {
  let comp: TypeEtablissementUpdateComponent;
  let fixture: ComponentFixture<TypeEtablissementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeEtablissementService: TypeEtablissementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeEtablissementUpdateComponent],
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
      .overrideTemplate(TypeEtablissementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeEtablissementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeEtablissementService = TestBed.inject(TypeEtablissementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeEtablissement: ITypeEtablissement = { id: 456 };

      activatedRoute.data = of({ typeEtablissement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typeEtablissement));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeEtablissement>>();
      const typeEtablissement = { id: 123 };
      jest.spyOn(typeEtablissementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeEtablissement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeEtablissement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeEtablissementService.update).toHaveBeenCalledWith(typeEtablissement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeEtablissement>>();
      const typeEtablissement = new TypeEtablissement();
      jest.spyOn(typeEtablissementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeEtablissement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeEtablissement }));
      saveSubject.complete();

      // THEN
      expect(typeEtablissementService.create).toHaveBeenCalledWith(typeEtablissement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeEtablissement>>();
      const typeEtablissement = { id: 123 };
      jest.spyOn(typeEtablissementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeEtablissement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeEtablissementService.update).toHaveBeenCalledWith(typeEtablissement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
