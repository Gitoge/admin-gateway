import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SituationAdministrativeDetailComponent } from './situation-administrative-detail.component';

describe('SituationAdministrative Management Detail Component', () => {
  let comp: SituationAdministrativeDetailComponent;
  let fixture: ComponentFixture<SituationAdministrativeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SituationAdministrativeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ situationAdministrative: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SituationAdministrativeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SituationAdministrativeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load situationAdministrative on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.situationAdministrative).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
