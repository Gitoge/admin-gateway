import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BilleteurDetailComponent } from './billeteur-detail.component';

describe('Billeteur Management Detail Component', () => {
  let comp: BilleteurDetailComponent;
  let fixture: ComponentFixture<BilleteurDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BilleteurDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ billeteur: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(BilleteurDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(BilleteurDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load billeteur on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.billeteur).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
