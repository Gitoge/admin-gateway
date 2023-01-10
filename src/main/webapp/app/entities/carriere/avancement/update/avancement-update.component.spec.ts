import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AvancementService } from '../service/avancement.service';
import { IAvancement, Avancement } from '../avancement.model';

import { AvancementUpdateComponent } from './avancement-update.component';

describe('Avancement Management Update Component', () => {
  let comp: AvancementUpdateComponent;
  let fixture: ComponentFixture<AvancementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let avancementService: AvancementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AvancementUpdateComponent],
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
      .overrideTemplate(AvancementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AvancementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    avancementService = TestBed.inject(AvancementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const avancement: IAvancement = { id: 456 };

      activatedRoute.data = of({ avancement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(avancement));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Avancement>>();
      const avancement = { id: 123 };
      jest.spyOn(avancementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ avancement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: avancement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(avancementService.update).toHaveBeenCalledWith(avancement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Avancement>>();
      const avancement = new Avancement();
      jest.spyOn(avancementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ avancement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: avancement }));
      saveSubject.complete();

      // THEN
      expect(avancementService.create).toHaveBeenCalledWith(avancement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Avancement>>();
      const avancement = { id: 123 };
      jest.spyOn(avancementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ avancement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(avancementService.update).toHaveBeenCalledWith(avancement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
