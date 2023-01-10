import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DestinatairesDetailComponent } from './destinataires-detail.component';

describe('Destinataires Management Detail Component', () => {
  let comp: DestinatairesDetailComponent;
  let fixture: ComponentFixture<DestinatairesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DestinatairesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ destinataires: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DestinatairesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DestinatairesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load destinataires on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.destinataires).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
