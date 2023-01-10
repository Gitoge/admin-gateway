import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AugmentationDetailComponent } from './augmentation-detail.component';

describe('Augmentation Management Detail Component', () => {
  let comp: AugmentationDetailComponent;
  let fixture: ComponentFixture<AugmentationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AugmentationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ augmentation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AugmentationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AugmentationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load augmentation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.augmentation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
