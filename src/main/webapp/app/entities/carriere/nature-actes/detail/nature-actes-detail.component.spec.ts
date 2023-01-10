import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { NatureActesDetailComponent } from './nature-actes-detail.component';

describe('NatureActes Management Detail Component', () => {
  let comp: NatureActesDetailComponent;
  let fixture: ComponentFixture<NatureActesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NatureActesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ natureActes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(NatureActesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(NatureActesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load natureActes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.natureActes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
