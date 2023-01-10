import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AgenceService } from '../service/agence.service';
import { IAgence, Agence } from '../agence.model';

import { AgenceUpdateComponent } from './agence-update.component';

describe('Agence Management Update Component', () => {
  let comp: AgenceUpdateComponent;
  let fixture: ComponentFixture<AgenceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let agenceService: AgenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AgenceUpdateComponent],
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
      .overrideTemplate(AgenceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AgenceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    agenceService = TestBed.inject(AgenceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const agence: IAgence = { id: 456 };

      activatedRoute.data = of({ agence });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(agence));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Agence>>();
      const agence = { id: 123 };
      jest.spyOn(agenceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agence });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agence }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(agenceService.update).toHaveBeenCalledWith(agence);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Agence>>();
      const agence = new Agence();
      jest.spyOn(agenceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agence });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: agence }));
      saveSubject.complete();

      // THEN
      expect(agenceService.create).toHaveBeenCalledWith(agence);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Agence>>();
      const agence = { id: 123 };
      jest.spyOn(agenceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ agence });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(agenceService.update).toHaveBeenCalledWith(agence);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
