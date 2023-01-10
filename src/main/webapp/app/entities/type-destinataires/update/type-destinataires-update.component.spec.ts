import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeDestinatairesService } from '../service/type-destinataires.service';
import { ITypeDestinataires, TypeDestinataires } from '../type-destinataires.model';

import { TypeDestinatairesUpdateComponent } from './type-destinataires-update.component';

describe('TypeDestinataires Management Update Component', () => {
  let comp: TypeDestinatairesUpdateComponent;
  let fixture: ComponentFixture<TypeDestinatairesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeDestinatairesService: TypeDestinatairesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeDestinatairesUpdateComponent],
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
      .overrideTemplate(TypeDestinatairesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeDestinatairesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeDestinatairesService = TestBed.inject(TypeDestinatairesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeDestinataires: ITypeDestinataires = { id: 456 };

      activatedRoute.data = of({ typeDestinataires });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typeDestinataires));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeDestinataires>>();
      const typeDestinataires = { id: 123 };
      jest.spyOn(typeDestinatairesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeDestinataires });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeDestinataires }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeDestinatairesService.update).toHaveBeenCalledWith(typeDestinataires);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeDestinataires>>();
      const typeDestinataires = new TypeDestinataires();
      jest.spyOn(typeDestinatairesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeDestinataires });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeDestinataires }));
      saveSubject.complete();

      // THEN
      expect(typeDestinatairesService.create).toHaveBeenCalledWith(typeDestinataires);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeDestinataires>>();
      const typeDestinataires = { id: 123 };
      jest.spyOn(typeDestinatairesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeDestinataires });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeDestinatairesService.update).toHaveBeenCalledWith(typeDestinataires);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
