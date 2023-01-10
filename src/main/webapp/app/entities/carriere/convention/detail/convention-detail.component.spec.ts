import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConventionDetailComponent } from './convention-detail.component';

describe('Convention Management Detail Component', () => {
  let comp: ConventionDetailComponent;
  let fixture: ComponentFixture<ConventionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConventionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ convention: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ConventionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ConventionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load convention on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.convention).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
