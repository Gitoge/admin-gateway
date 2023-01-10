import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AugmentationIndiceDetailComponent } from './augmentation-indice-detail.component';

describe('AugmentationIndice Management Detail Component', () => {
  let comp: AugmentationIndiceDetailComponent;
  let fixture: ComponentFixture<AugmentationIndiceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AugmentationIndiceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ augmentationIndice: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AugmentationIndiceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AugmentationIndiceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load augmentationIndice on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.augmentationIndice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
