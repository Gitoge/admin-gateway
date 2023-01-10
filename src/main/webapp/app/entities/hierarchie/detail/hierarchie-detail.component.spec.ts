import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HierarchieDetailComponent } from './hierarchie-detail.component';

describe('Hierarchie Management Detail Component', () => {
  let comp: HierarchieDetailComponent;
  let fixture: ComponentFixture<HierarchieDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HierarchieDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ hierarchie: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HierarchieDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HierarchieDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load hierarchie on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.hierarchie).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
