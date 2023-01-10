jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ExclusionTauxService } from '../service/exclusion-taux.service';

import { ExclusionTauxDeleteDialogComponent } from './exclusion-taux-delete-dialog.component';

describe('ExclusionTaux Management Delete Component', () => {
  let comp: ExclusionTauxDeleteDialogComponent;
  let fixture: ComponentFixture<ExclusionTauxDeleteDialogComponent>;
  let service: ExclusionTauxService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ExclusionTauxDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(ExclusionTauxDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExclusionTauxDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ExclusionTauxService);
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
