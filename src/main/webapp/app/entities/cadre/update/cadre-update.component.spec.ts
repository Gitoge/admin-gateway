import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CadreService } from '../service/cadre.service';
import { ICadre, Cadre } from '../cadre.model';

import { CadreUpdateComponent } from './cadre-update.component';

describe('Cadre Management Update Component', () => {
  let comp: CadreUpdateComponent;
  let fixture: ComponentFixture<CadreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cadreService: CadreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CadreUpdateComponent],
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
      .overrideTemplate(CadreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CadreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cadreService = TestBed.inject(CadreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const cadre: ICadre = { id: 456 };

      activatedRoute.data = of({ cadre });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(cadre));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cadre>>();
      const cadre = { id: 123 };
      jest.spyOn(cadreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cadre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cadre }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(cadreService.update).toHaveBeenCalledWith(cadre);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cadre>>();
      const cadre = new Cadre();
      jest.spyOn(cadreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cadre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cadre }));
      saveSubject.complete();

      // THEN
      expect(cadreService.create).toHaveBeenCalledWith(cadre);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Cadre>>();
      const cadre = { id: 123 };
      jest.spyOn(cadreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cadre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cadreService.update).toHaveBeenCalledWith(cadre);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
