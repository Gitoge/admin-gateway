import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PositionsService } from '../service/positions.service';
import { IPositions, Positions } from '../positions.model';
import { ITypePosition } from 'app/entities/type-position/type-position.model';
import { TypePositionService } from 'app/entities/type-position/service/type-position.service';

import { PositionsUpdateComponent } from './positions-update.component';

describe('Positions Management Update Component', () => {
  let comp: PositionsUpdateComponent;
  let fixture: ComponentFixture<PositionsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let positionsService: PositionsService;
  let typePositionService: TypePositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PositionsUpdateComponent],
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
      .overrideTemplate(PositionsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PositionsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    positionsService = TestBed.inject(PositionsService);
    typePositionService = TestBed.inject(TypePositionService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypePosition query and add missing value', () => {
      const positions: IPositions = { id: 456 };
      const typeposition: ITypePosition = { id: 52066 };
      positions.typeposition = typeposition;

      const typePositionCollection: ITypePosition[] = [{ id: 94550 }];
      jest.spyOn(typePositionService, 'query').mockReturnValue(of(new HttpResponse({ body: typePositionCollection })));
      const additionalTypePositions = [typeposition];
      const expectedCollection: ITypePosition[] = [...additionalTypePositions, ...typePositionCollection];
      jest.spyOn(typePositionService, 'addTypePositionToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ positions });
      comp.ngOnInit();

      expect(typePositionService.query).toHaveBeenCalled();
      expect(typePositionService.addTypePositionToCollectionIfMissing).toHaveBeenCalledWith(
        typePositionCollection,
        ...additionalTypePositions
      );
      expect(comp.typePositionsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const positions: IPositions = { id: 456 };
      const typeposition: ITypePosition = { id: 74520 };
      positions.typeposition = typeposition;

      activatedRoute.data = of({ positions });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(positions));
      expect(comp.typePositionsSharedCollection).toContain(typeposition);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Positions>>();
      const positions = { id: 123 };
      jest.spyOn(positionsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ positions });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: positions }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(positionsService.update).toHaveBeenCalledWith(positions);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Positions>>();
      const positions = new Positions();
      jest.spyOn(positionsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ positions });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: positions }));
      saveSubject.complete();

      // THEN
      expect(positionsService.create).toHaveBeenCalledWith(positions);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Positions>>();
      const positions = { id: 123 };
      jest.spyOn(positionsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ positions });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(positionsService.update).toHaveBeenCalledWith(positions);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTypePositionById', () => {
      it('Should return tracked TypePosition primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTypePositionById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
