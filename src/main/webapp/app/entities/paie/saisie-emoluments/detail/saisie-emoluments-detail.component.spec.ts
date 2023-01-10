import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SaisieEmolumentsDetailComponent } from './saisie-emoluments-detail.component';

describe('SaisieEmoluments Management Detail Component', () => {
  let comp: SaisieEmolumentsDetailComponent;
  let fixture: ComponentFixture<SaisieEmolumentsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaisieEmolumentsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ saisieEmoluments: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SaisieEmolumentsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SaisieEmolumentsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load saisieEmoluments on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.saisieEmoluments).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
