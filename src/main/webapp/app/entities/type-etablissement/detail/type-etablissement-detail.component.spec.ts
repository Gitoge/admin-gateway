import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TypeEtablissementDetailComponent } from './type-etablissement-detail.component';

describe('TypeEtablissement Management Detail Component', () => {
  let comp: TypeEtablissementDetailComponent;
  let fixture: ComponentFixture<TypeEtablissementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeEtablissementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ typeEtablissement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TypeEtablissementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TypeEtablissementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load typeEtablissement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.typeEtablissement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
