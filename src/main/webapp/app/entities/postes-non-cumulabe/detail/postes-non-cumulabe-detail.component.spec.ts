import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PostesNonCumulabeDetailComponent } from './postes-non-cumulabe-detail.component';

describe('PostesNonCumulabe Management Detail Component', () => {
  let comp: PostesNonCumulabeDetailComponent;
  let fixture: ComponentFixture<PostesNonCumulabeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostesNonCumulabeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ postesNonCumulabe: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PostesNonCumulabeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PostesNonCumulabeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load postesNonCumulabe on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.postesNonCumulabe).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
