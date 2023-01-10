import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ExclusionTauxDetailComponent } from './exclusion-taux-detail.component';

describe('ExclusionTaux Management Detail Component', () => {
  let comp: ExclusionTauxDetailComponent;
  let fixture: ComponentFixture<ExclusionTauxDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExclusionTauxDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ exclusionTaux: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ExclusionTauxDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ExclusionTauxDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load exclusionTaux on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.exclusionTaux).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
