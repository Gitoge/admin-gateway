import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypeGrilleService } from '../service/type-grille.service';
import { ITypeGrille, TypeGrille } from '../type-grille.model';

import { TypeGrilleUpdateComponent } from './type-grille-update.component';

describe('TypeGrille Management Update Component', () => {
  let comp: TypeGrilleUpdateComponent;
  let fixture: ComponentFixture<TypeGrilleUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typeGrilleService: TypeGrilleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypeGrilleUpdateComponent],
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
      .overrideTemplate(TypeGrilleUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypeGrilleUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typeGrilleService = TestBed.inject(TypeGrilleService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typeGrille: ITypeGrille = { id: 456 };

      activatedRoute.data = of({ typeGrille });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typeGrille));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeGrille>>();
      const typeGrille = { id: 123 };
      jest.spyOn(typeGrilleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeGrille });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeGrille }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typeGrilleService.update).toHaveBeenCalledWith(typeGrille);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeGrille>>();
      const typeGrille = new TypeGrille();
      jest.spyOn(typeGrilleService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeGrille });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typeGrille }));
      saveSubject.complete();

      // THEN
      expect(typeGrilleService.create).toHaveBeenCalledWith(typeGrille);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypeGrille>>();
      const typeGrille = { id: 123 };
      jest.spyOn(typeGrilleService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typeGrille });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typeGrilleService.update).toHaveBeenCalledWith(typeGrille);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
