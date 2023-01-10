import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeDestinatairesDetailComponent } from './type-destinataires-detail.component';

describe('TypeDestinataires Management Detail Component', () => {
  let comp: TypeDestinatairesDetailComponent;
  let fixture: ComponentFixture<TypeDestinatairesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeDestinatairesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeDestinataires: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeDestinatairesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeDestinatairesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeDestinataires on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeDestinataires).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
