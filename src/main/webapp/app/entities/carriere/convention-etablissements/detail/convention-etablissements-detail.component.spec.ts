import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConventionEtablissementsDetailComponent } from './convention-etablissements-detail.component';

describe('ConventionEtablissements Management Detail Component', () => {
  let comp: ConventionEtablissementsDetailComponent;
  let fixture: ComponentFixture<ConventionEtablissementsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConventionEtablissementsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ conventionEtablissements: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ConventionEtablissementsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ConventionEtablissementsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load conventionEtablissements on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.conventionEtablissements).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
