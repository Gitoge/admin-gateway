import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EtablissementBancaireDetailComponent } from './etablissement-bancaire-detail.component';

describe('EtablissementBancaire Management Detail Component', () => {
  let comp: EtablissementBancaireDetailComponent;
  let fixture: ComponentFixture<EtablissementBancaireDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EtablissementBancaireDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ etablissementBancaire: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EtablissementBancaireDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EtablissementBancaireDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load etablissementBancaire on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.etablissementBancaire).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
