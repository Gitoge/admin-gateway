import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeLocaliteService } from '../service/type-localite.service';
import { ITypeLocalite, TypeLocalite } from '../type-localite.model';

import { TypeLocaliteUpdateComponent } from './type-localite-update.component';

describe('TypeLocalite Management Update Component', () => {
  let comp: TypeLocaliteUpdateComponent;
  let fixture: ComponentFixture<TypeLocaliteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeLocaliteService: TypeLocaliteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeLocaliteUpdateComponent],
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
      .overrideTemplate(TypeLocaliteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeLocaliteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeLocaliteService = TestBed.inject(TypeLocaliteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeLocalite: ITypeLocalite = { id: 456 };

      activatedRoute.data = of({ typeLocalite });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typeLocalite));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeLocalite>>();
      const typeLocalite = { id: 123 };
      jest.spyOn(typeLocaliteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeLocalite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeLocalite }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeLocaliteService.update).toHaveBeenCalledWith(typeLocalite);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeLocalite>>();
      const typeLocalite = new TypeLocalite();
      jest.spyOn(typeLocaliteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeLocalite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeLocalite }));
      saveSubject.complete();

      // THEN
      expect(typeLocaliteService.create).toHaveBeenCalledWith(typeLocalite);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeLocalite>>();
      const typeLocalite = { id: 123 };
      jest.spyOn(typeLocaliteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeLocalite });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeLocaliteService.update).toHaveBeenCalledWith(typeLocalite);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
