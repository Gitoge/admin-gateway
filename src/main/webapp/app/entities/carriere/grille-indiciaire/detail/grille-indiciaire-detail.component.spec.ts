import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GrilleIndiciaireDetailComponent } from './grille-indiciaire-detail.component';

describe('GrilleIndiciaire Management Detail Component', () => {
  let comp: GrilleIndiciaireDetailComponent;
  let fixture: ComponentFixture<GrilleIndiciaireDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrilleIndiciaireDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grilleIndiciaire: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GrilleIndiciaireDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrilleIndiciaireDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grilleIndiciaire on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grilleIndiciaire).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
