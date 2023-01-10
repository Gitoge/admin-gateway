import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IndicesService } from '../service/indices.service';
import { IIndices, Indices } from '../indices.model';

import { IndicesUpdateComponent } from './indices-update.component';

describe('Indices Management Update Component', () => {
  let comp: IndicesUpdateComponent;
  let fixture: ComponentFixture<IndicesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let indicesService: IndicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [IndicesUpdateComponent],
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
      .overrideTemplate(IndicesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(IndicesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    indicesService = TestBed.inject(IndicesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const indices: IIndices = { id: 456 };

      activatedRoute.data = of({ indices });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(indices));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Indices>>();
      const indices = { id: 123 };
      jest.spyOn(indicesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ indices });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: indices }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(indicesService.update).toHaveBeenCalledWith(indices);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Indices>>();
      const indices = new Indices();
      jest.spyOn(indicesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ indices });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: indices }));
      saveSubject.complete();

      // THEN
      expect(indicesService.create).toHaveBeenCalledWith(indices);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Indices>>();
      const indices = { id: 123 };
      jest.spyOn(indicesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ indices });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(indicesService.update).toHaveBeenCalledWith(indices);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
