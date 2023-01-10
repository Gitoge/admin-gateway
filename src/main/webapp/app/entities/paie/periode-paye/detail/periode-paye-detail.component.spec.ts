import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PeriodePayeDetailComponent } from './periode-paye-detail.component';

describe('PeriodePaye Management Detail Component', () => {
  let comp: PeriodePayeDetailComponent;
  let fixture: ComponentFixture<PeriodePayeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PeriodePayeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ periodePaye: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PeriodePayeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PeriodePayeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load periodePaye on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.periodePaye).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
