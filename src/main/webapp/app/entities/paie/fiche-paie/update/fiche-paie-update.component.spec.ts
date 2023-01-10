import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FichePaieService } from '../service/fiche-paie.service';
import { IFichePaie, FichePaie } from '../fiche-paie.model';

import { FichePaieUpdateComponent } from './fiche-paie-update.component';

describe('FichePaie Management Update Component', () => {
  let comp: FichePaieUpdateComponent;
  let fixture: ComponentFixture<FichePaieUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let fichePaieService: FichePaieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FichePaieUpdateComponent],
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
      .overrideTemplate(FichePaieUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FichePaieUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fichePaieService = TestBed.inject(FichePaieService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const fichePaie: IFichePaie = { id: 456 };

      activatedRoute.data = of({ fichePaie });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(fichePaie));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FichePaie>>();
      const fichePaie = { id: 123 };
      jest.spyOn(fichePaieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fichePaie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fichePaie }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(fichePaieService.update).toHaveBeenCalledWith(fichePaie);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FichePaie>>();
      const fichePaie = new FichePaie();
      jest.spyOn(fichePaieService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fichePaie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: fichePaie }));
      saveSubject.complete();

      // THEN
      expect(fichePaieService.create).toHaveBeenCalledWith(fichePaie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<FichePaie>>();
      const fichePaie = { id: 123 };
      jest.spyOn(fichePaieService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ fichePaie });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(fichePaieService.update).toHaveBeenCalledWith(fichePaie);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
