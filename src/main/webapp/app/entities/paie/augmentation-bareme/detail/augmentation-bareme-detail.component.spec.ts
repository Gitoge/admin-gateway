import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AugmentationBaremeDetailComponent } from './augmentation-bareme-detail.component';

describe('AugmentationBareme Management Detail Component', () => {
  let comp: AugmentationBaremeDetailComponent;
  let fixture: ComponentFixture<AugmentationBaremeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AugmentationBaremeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ augmentationBareme: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AugmentationBaremeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AugmentationBaremeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load augmentationBareme on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.augmentationBareme).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
