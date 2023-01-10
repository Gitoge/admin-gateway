import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EmploisService } from '../service/emplois.service';
import { IEmplois, Emplois } from '../emplois.model';

import { EmploisUpdateComponent } from './emplois-update.component';

describe('Emplois Management Update Component', () => {
  let comp: EmploisUpdateComponent;
  let fixture: ComponentFixture<EmploisUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let emploisService: EmploisService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EmploisUpdateComponent],
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
      .overrideTemplate(EmploisUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EmploisUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    emploisService = TestBed.inject(EmploisService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const emplois: IEmplois = { id: 456 };

      activatedRoute.data = of({ emplois });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(emplois));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Emplois>>();
      const emplois = { id: 123 };
      jest.spyOn(emploisService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emplois });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emplois }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(emploisService.update).toHaveBeenCalledWith(emplois);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Emplois>>();
      const emplois = new Emplois();
      jest.spyOn(emploisService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emplois });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: emplois }));
      saveSubject.complete();

      // THEN
      expect(emploisService.create).toHaveBeenCalledWith(emplois);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Emplois>>();
      const emplois = { id: 123 };
      jest.spyOn(emploisService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ emplois });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(emploisService.update).toHaveBeenCalledWith(emplois);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
