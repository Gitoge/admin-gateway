import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CorpsDetailComponent } from './corps-detail.component';

describe('Corps Management Detail Component', () => {
  let comp: CorpsDetailComponent;
  let fixture: ComponentFixture<CorpsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorpsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ corps: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CorpsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CorpsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load corps on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.corps).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
