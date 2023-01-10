import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NationaliteDetailComponent } from './nationalite-detail.component';

describe('Nationalite Management Detail Component', () => {
  let comp: NationaliteDetailComponent;
  let fixture: ComponentFixture<NationaliteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NationaliteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ nationalite: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NationaliteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NationaliteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load nationalite on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.nationalite).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
