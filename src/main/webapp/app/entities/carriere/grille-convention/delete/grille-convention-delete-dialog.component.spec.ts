jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { GrilleConventionService } from '../service/grille-convention.service';

import { GrilleConventionDeleteDialogComponent } from './grille-convention-delete-dialog.component';

describe('GrilleConvention Management Delete Component', () => {
  let comp: GrilleConventionDeleteDialogComponent;
  let fixture: ComponentFixture<GrilleConventionDeleteDialogComponent>;
  let service: GrilleConventionService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GrilleConventionDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(GrilleConventionDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrilleConventionDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GrilleConventionService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
