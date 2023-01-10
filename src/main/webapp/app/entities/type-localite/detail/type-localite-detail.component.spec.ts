import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeLocaliteDetailComponent } from './type-localite-detail.component';

describe('TypeLocalite Management Detail Component', () => {
  let comp: TypeLocaliteDetailComponent;
  let fixture: ComponentFixture<TypeLocaliteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeLocaliteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeLocalite: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeLocaliteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeLocaliteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeLocalite on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeLocalite).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
