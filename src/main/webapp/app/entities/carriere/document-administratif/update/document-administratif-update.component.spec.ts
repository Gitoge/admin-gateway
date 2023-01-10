jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { DocumentAdministratifService } from '../service/document-administratif.service';
import { IDocumentAdministratif, DocumentAdministratif } from '../document-administratif.model';

import { DocumentAdministratifUpdateComponent } from './document-administratif-update.component';

describe('Component Tests', () => {
  describe('DocumentAdministratif Management Update Component', () => {
    let comp: DocumentAdministratifUpdateComponent;
    let fixture: ComponentFixture<DocumentAdministratifUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let documentAdministratifService: DocumentAdministratifService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [DocumentAdministratifUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(DocumentAdministratifUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(DocumentAdministratifUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      documentAdministratifService = TestBed.inject(DocumentAdministratifService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Employe query and add missing value', () => {
        const documentAdministratif: IDocumentAdministratif = { id: 456 };
      });

      it('Should update editForm', () => {
        const documentAdministratif: IDocumentAdministratif = { id: 456 };

        activatedRoute.data = of({ documentAdministratif });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(documentAdministratif));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const documentAdministratif = { id: 123 };
        spyOn(documentAdministratifService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ documentAdministratif });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: documentAdministratif }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(documentAdministratifService.update).toHaveBeenCalledWith(documentAdministratif);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const documentAdministratif = new DocumentAdministratif();
        spyOn(documentAdministratifService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ documentAdministratif });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: documentAdministratif }));
        saveSubject.complete();

        // THEN
        expect(documentAdministratifService.create).toHaveBeenCalledWith(documentAdministratif);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const documentAdministratif = { id: 123 };
        spyOn(documentAdministratifService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ documentAdministratif });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(documentAdministratifService.update).toHaveBeenCalledWith(documentAdministratif);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEmployeById', () => {
        it('Should return tracked Employe primary key', () => {
          const entity = { id: 123 };
        });
      });
    });
  });
});
