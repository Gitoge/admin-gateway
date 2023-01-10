import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HistoAugmentationDetailComponent } from './histo-augmentation-detail.component';

describe('HistoAugmentation Management Detail Component', () => {
  let comp: HistoAugmentationDetailComponent;
  let fixture: ComponentFixture<HistoAugmentationDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoAugmentationDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ histoAugmentation: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(HistoAugmentationDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(HistoAugmentationDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load histoAugmentation on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.histoAugmentation).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
