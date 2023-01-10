import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PostesDetailComponent } from './postes-detail.component';

describe('Postes Management Detail Component', () => {
  let comp: PostesDetailComponent;
  let fixture: ComponentFixture<PostesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ postes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PostesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PostesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load postes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.postes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
