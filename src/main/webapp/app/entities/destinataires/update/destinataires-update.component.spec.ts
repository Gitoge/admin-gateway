import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DestinatairesService } from '../service/destinataires.service';
import { IDestinataires, Destinataires } from '../destinataires.model';
import { ITypeDestinataires } from 'app/entities/type-destinataires/type-destinataires.model';
import { TypeDestinatairesService } from 'app/entities/type-destinataires/service/type-destinataires.service';

import { DestinatairesUpdateComponent } from './destinataires-update.component';

describe('Destinataires Management Update Component', () => {
  let comp: DestinatairesUpdateComponent;
  let fixture: ComponentFixture<DestinatairesUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let destinatairesService: DestinatairesService;
  let typeDestinatairesService: TypeDestinatairesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DestinatairesUpdateComponent],
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
      .overrideTemplate(DestinatairesUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DestinatairesUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    destinatairesService = TestBed.inject(DestinatairesService);
    typeDestinatairesService = TestBed.inject(TypeDestinatairesService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call TypeDestinataires query and add missing value', () => {
      const destinataires: IDestinataires = { id: 456 };
      const typedestinataires: ITypeDestinataires = { id: 84370 };
      destinataires.typedestinataires = typedestinataires;

      const typeDestinatairesCollection: ITypeDestinataires[] = [{ id: 5120 }];
      jest.spyOn(typeDestinatairesService, 'query').mockReturnValue(of(new HttpResponse({ body: typeDestinatairesCollection })));
      const additionalTypeDestinataires = [typedestinataires];
      const expectedCollection: ITypeDestinataires[] = [...additionalTypeDestinataires, ...typeDestinatairesCollection];
      jest.spyOn(typeDestinatairesService, 'addTypeDestinatairesToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ destinataires });
      comp.ngOnInit();

      expect(typeDestinatairesService.query).toHaveBeenCalled();
      expect(typeDestinatairesService.addTypeDestinatairesToCollectionIfMissing).toHaveBeenCalledWith(
        typeDestinatairesCollection,
        ...additionalTypeDestinataires
      );
      expect(comp.typeDestinatairesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const destinataires: IDestinataires = { id: 456 };
      const typedestinataires: ITypeDestinataires = { id: 81508 };
      destinataires.typedestinataires = typedestinataires;

      activatedRoute.data = of({ destinataires });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(destinataires));
      expect(comp.typeDestinatairesSharedCollection).toContain(typedestinataires);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Destinataires>>();
      const destinataires = { id: 123 };
      jest.spyOn(destinatairesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ destinataires });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: destinataires }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(destinatairesService.update).toHaveBeenCalledWith(destinataires);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Destinataires>>();
      const destinataires = new Destinataires();
      jest.spyOn(destinatairesService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ destinataires });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: destinataires }));
      saveSubject.complete();

      // THEN
      expect(destinatairesService.create).toHaveBeenCalledWith(destinataires);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Destinataires>>();
      const destinataires = { id: 123 };
      jest.spyOn(destinatairesService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ destinataires });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(destinatairesService.update).toHaveBeenCalledWith(destinataires);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTypeDestinatairesById', () => {
      it('Should return tracked TypeDestinataires primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTypeDestinatairesById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
