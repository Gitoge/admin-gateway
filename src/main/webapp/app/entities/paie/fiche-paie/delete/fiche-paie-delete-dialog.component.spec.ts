jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { FichePaieService } from '../service/fiche-paie.service';

import { FichePaieDeleteDialogComponent } from './fiche-paie-delete-dialog.component';

describe('FichePaie Management Delete Component', () => {
  let comp: FichePaieDeleteDialogComponent;
  let fixture: ComponentFixture<FichePaieDeleteDialogComponent>;
  let service: FichePaieService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FichePaieDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(FichePaieDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FichePaieDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(FichePaieService);
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
