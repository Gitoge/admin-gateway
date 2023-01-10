import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypePositionDetailComponent } from './type-position-detail.component';

describe('TypePosition Management Detail Component', () => {
  let comp: TypePositionDetailComponent;
  let fixture: ComponentFixture<TypePositionDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypePositionDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typePosition: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypePositionDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypePositionDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typePosition on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typePosition).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
