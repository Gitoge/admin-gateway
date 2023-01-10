import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EtablissementBancaireService } from '../service/etablissement-bancaire.service';
import { IEtablissementBancaire, EtablissementBancaire } from '../etablissement-bancaire.model';

import { EtablissementBancaireUpdateComponent } from './etablissement-bancaire-update.component';

describe('EtablissementBancaire Management Update Component', () => {
  let comp: EtablissementBancaireUpdateComponent;
  let fixture: ComponentFixture<EtablissementBancaireUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etablissementBancaireService: EtablissementBancaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EtablissementBancaireUpdateComponent],
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
      .overrideTemplate(EtablissementBancaireUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtablissementBancaireUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etablissementBancaireService = TestBed.inject(EtablissementBancaireService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const etablissementBancaire: IEtablissementBancaire = { id: 456 };

      activatedRoute.data = of({ etablissementBancaire });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(etablissementBancaire));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtablissementBancaire>>();
      const etablissementBancaire = { id: 123 };
      jest.spyOn(etablissementBancaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etablissementBancaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etablissementBancaire }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(etablissementBancaireService.update).toHaveBeenCalledWith(etablissementBancaire);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtablissementBancaire>>();
      const etablissementBancaire = new EtablissementBancaire();
      jest.spyOn(etablissementBancaireService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etablissementBancaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etablissementBancaire }));
      saveSubject.complete();

      // THEN
      expect(etablissementBancaireService.create).toHaveBeenCalledWith(etablissementBancaire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<EtablissementBancaire>>();
      const etablissementBancaire = { id: 123 };
      jest.spyOn(etablissementBancaireService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etablissementBancaire });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etablissementBancaireService.update).toHaveBeenCalledWith(etablissementBancaire);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
