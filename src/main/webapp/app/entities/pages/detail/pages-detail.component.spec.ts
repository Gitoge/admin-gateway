import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PagesDetailComponent } from './pages-detail.component';

describe('Pages Management Detail Component', () => {
  let comp: PagesDetailComponent;
  let fixture: ComponentFixture<PagesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ pages: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PagesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PagesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load pages on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.pages).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
