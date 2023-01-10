import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExclusionAugmentationDetailComponent } from './exclusion-augmentation-detail.component';

describe('ExclusionAugmentation Management Detail Component', () => {
  let comp: ExclusionAugmentationDetailComponent;
  let fixture: ComponentFixture<ExclusionAugmentationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExclusionAugmentationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ exclusionAugmentation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExclusionAugmentationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExclusionAugmentationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load exclusionAugmentation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.exclusionAugmentation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
