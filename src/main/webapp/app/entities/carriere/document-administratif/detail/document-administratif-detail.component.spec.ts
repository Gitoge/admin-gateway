import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DocumentAdministratifDetailComponent } from './document-administratif-detail.component';

describe('Component Tests', () => {
  describe('DocumentAdministratif Management Detail Component', () => {
    let comp: DocumentAdministratifDetailComponent;
    let fixture: ComponentFixture<DocumentAdministratifDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [DocumentAdministratifDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ documentAdministratif: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(DocumentAdministratifDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(DocumentAdministratifDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load documentAdministratif on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.documentAdministratif).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
