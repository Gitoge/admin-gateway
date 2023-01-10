import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GrilleConventionDetailComponent } from './grille-convention-detail.component';

describe('GrilleConvention Management Detail Component', () => {
  let comp: GrilleConventionDetailComponent;
  let fixture: ComponentFixture<GrilleConventionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrilleConventionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grilleConvention: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GrilleConventionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrilleConventionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grilleConvention on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grilleConvention).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
