import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeReglementDetailComponent } from './type-reglement-detail.component';

describe('TypeReglement Management Detail Component', () => {
  let comp: TypeReglementDetailComponent;
  let fixture: ComponentFixture<TypeReglementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeReglementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeReglement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeReglementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeReglementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeReglement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeReglement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
