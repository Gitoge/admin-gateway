import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PosteCompoGradeDetailComponent } from './poste-compo-grade-detail.component';

describe('PosteCompoGrade Management Detail Component', () => {
  let comp: PosteCompoGradeDetailComponent;
  let fixture: ComponentFixture<PosteCompoGradeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosteCompoGradeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ posteCompoGrade: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PosteCompoGradeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PosteCompoGradeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load posteCompoGrade on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.posteCompoGrade).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
