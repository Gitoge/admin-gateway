import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TypePositionService } from '../service/type-position.service';
import { ITypePosition, TypePosition } from '../type-position.model';

import { TypePositionUpdateComponent } from './type-position-update.component';

describe('TypePosition Management Update Component', () => {
  let comp: TypePositionUpdateComponent;
  let fixture: ComponentFixture<TypePositionUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let typePositionService: TypePositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TypePositionUpdateComponent],
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
      .overrideTemplate(TypePositionUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TypePositionUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    typePositionService = TestBed.inject(TypePositionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const typePosition: ITypePosition = { id: 456 };

      activatedRoute.data = of({ typePosition });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(typePosition));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypePosition>>();
      const typePosition = { id: 123 };
      jest.spyOn(typePositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typePosition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typePosition }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(typePositionService.update).toHaveBeenCalledWith(typePosition);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypePosition>>();
      const typePosition = new TypePosition();
      jest.spyOn(typePositionService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typePosition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: typePosition }));
      saveSubject.complete();

      // THEN
      expect(typePositionService.create).toHaveBeenCalledWith(typePosition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TypePosition>>();
      const typePosition = { id: 123 };
      jest.spyOn(typePositionService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ typePosition });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(typePositionService.update).toHaveBeenCalledWith(typePosition);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
