import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PriseEnCompteDetailComponent } from './prise-en-compte-detail.component';

describe('PriseEnCompte Management Detail Component', () => {
  let comp: PriseEnCompteDetailComponent;
  let fixture: ComponentFixture<PriseEnCompteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PriseEnCompteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ priseencompte: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PriseEnCompteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PriseEnCompteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load priseencompte on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.priseencompte).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
