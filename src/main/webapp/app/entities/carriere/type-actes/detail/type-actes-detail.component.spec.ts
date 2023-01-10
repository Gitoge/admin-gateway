import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeActesDetailComponent } from './type-actes-detail.component';

describe('TypeActes Management Detail Component', () => {
  let comp: TypeActesDetailComponent;
  let fixture: ComponentFixture<TypeActesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeActesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeActes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeActesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeActesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeActes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeActes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
