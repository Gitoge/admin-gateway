import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DirectionDetailComponent } from './direction-detail.component';

describe('Direction Management Detail Component', () => {
  let comp: DirectionDetailComponent;
  let fixture: ComponentFixture<DirectionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ direction: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DirectionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DirectionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load direction on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.direction).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
