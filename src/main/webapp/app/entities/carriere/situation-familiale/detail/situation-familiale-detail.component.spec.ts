import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SituationFamilialeDetailComponent } from './situation-familiale-detail.component';

describe('SituationFamiliale Management Detail Component', () => {
  let comp: SituationFamilialeDetailComponent;
  let fixture: ComponentFixture<SituationFamilialeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SituationFamilialeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ situationFamiliale: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SituationFamilialeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SituationFamilialeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load situationFamiliale on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.situationFamiliale).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
