import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { FichePaieDetailComponent } from './fiche-paie-detail.component';

describe('FichePaie Management Detail Component', () => {
  let comp: FichePaieDetailComponent;
  let fixture: ComponentFixture<FichePaieDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FichePaieDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ fichePaie: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(FichePaieDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(FichePaieDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load fichePaie on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.fichePaie).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
