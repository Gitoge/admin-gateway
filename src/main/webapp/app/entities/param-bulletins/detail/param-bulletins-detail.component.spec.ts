import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParamBulletinsDetailComponent } from './param-bulletins-detail.component';

describe('ParamBulletins Management Detail Component', () => {
  let comp: ParamBulletinsDetailComponent;
  let fixture: ComponentFixture<ParamBulletinsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParamBulletinsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paramBulletins: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParamBulletinsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParamBulletinsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paramBulletins on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paramBulletins).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
