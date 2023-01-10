import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PosteGradeDetailComponent } from './poste-grade-detail.component';

describe('PosteGrade Management Detail Component', () => {
  let comp: PosteGradeDetailComponent;
  let fixture: ComponentFixture<PosteGradeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosteGradeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ posteGrade: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PosteGradeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PosteGradeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load posteGrade on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.posteGrade).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
