import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParametreService } from '../service/parametre.service';
import { IParametre, Parametre } from '../parametre.model';

import { ParametreUpdateComponent } from './parametre-update.component';

describe('Parametre Management Update Component', () => {
  let comp: ParametreUpdateComponent;
  let fixture: ComponentFixture<ParametreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parametreService: ParametreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParametreUpdateComponent],
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
      .overrideTemplate(ParametreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParametreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parametreService = TestBed.inject(ParametreService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const parametre: IParametre = { id: 456 };

      activatedRoute.data = of({ parametre });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(parametre));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Parametre>>();
      const parametre = { id: 123 };
      jest.spyOn(parametreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parametre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parametre }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(parametreService.update).toHaveBeenCalledWith(parametre);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Parametre>>();
      const parametre = new Parametre();
      jest.spyOn(parametreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parametre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parametre }));
      saveSubject.complete();

      // THEN
      expect(parametreService.create).toHaveBeenCalledWith(parametre);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Parametre>>();
      const parametre = { id: 123 };
      jest.spyOn(parametreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parametre });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parametreService.update).toHaveBeenCalledWith(parametre);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
