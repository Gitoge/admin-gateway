import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PositionsDetailComponent } from './positions-detail.component';

describe('Positions Management Detail Component', () => {
  let comp: PositionsDetailComponent;
  let fixture: ComponentFixture<PositionsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PositionsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ positions: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PositionsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PositionsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load positions on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.positions).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
