import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PostesReferenceActesDetailComponent } from './postes-reference-actes-detail.component';

describe('PostesReferenceActes Management Detail Component', () => {
  let comp: PostesReferenceActesDetailComponent;
  let fixture: ComponentFixture<PostesReferenceActesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostesReferenceActesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ postesReferenceActes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PostesReferenceActesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PostesReferenceActesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load postesReferenceActes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.postesReferenceActes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
