import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AugmentationHierarchieDetailComponent } from './augmentation-hierarchie-detail.component';

describe('AugmentationHierarchie Management Detail Component', () => {
  let comp: AugmentationHierarchieDetailComponent;
  let fixture: ComponentFixture<AugmentationHierarchieDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AugmentationHierarchieDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ augmentationHierarchie: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AugmentationHierarchieDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AugmentationHierarchieDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load augmentationHierarchie on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.augmentationHierarchie).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
