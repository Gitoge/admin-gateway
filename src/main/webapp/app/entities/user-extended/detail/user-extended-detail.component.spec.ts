import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { UserExtendedDetailComponent } from './user-extended-detail.component';

describe('UserExtended Management Detail Component', () => {
  let comp: UserExtendedDetailComponent;
  let fixture: ComponentFixture<UserExtendedDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserExtendedDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ userExtended: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(UserExtendedDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(UserExtendedDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load userExtended on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.userExtended).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
