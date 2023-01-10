import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AssiettesDetailComponent } from './assiettes-detail.component';

describe('Assiettes Management Detail Component', () => {
  let comp: AssiettesDetailComponent;
  let fixture: ComponentFixture<AssiettesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssiettesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ assiettes: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AssiettesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AssiettesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load assiettes on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.assiettes).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
