import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HierarchieCategorieDetailComponent } from './hierarchie-categorie-detail.component';

describe('HierarchieCategorie Management Detail Component', () => {
  let comp: HierarchieCategorieDetailComponent;
  let fixture: ComponentFixture<HierarchieCategorieDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HierarchieCategorieDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ hierarchieCategorie: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HierarchieCategorieDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HierarchieCategorieDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load hierarchieCategorie on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.hierarchieCategorie).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
