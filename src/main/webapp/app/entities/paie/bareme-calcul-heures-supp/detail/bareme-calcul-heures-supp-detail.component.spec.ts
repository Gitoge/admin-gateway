import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BaremeCalculHeuresSuppDetailComponent } from './bareme-calcul-heures-supp-detail.component';

describe('BaremeCalculHeuresSupp Management Detail Component', () => {
  let comp: BaremeCalculHeuresSuppDetailComponent;
  let fixture: ComponentFixture<BaremeCalculHeuresSuppDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BaremeCalculHeuresSuppDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ baremeCalculHeuresSupp: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BaremeCalculHeuresSuppDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BaremeCalculHeuresSuppDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load baremeCalculHeuresSupp on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.baremeCalculHeuresSupp).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
