import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CategorieAgentDetailComponent } from './categorie-agent-detail.component';

describe('CategorieAgent Management Detail Component', () => {
  let comp: CategorieAgentDetailComponent;
  let fixture: ComponentFixture<CategorieAgentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategorieAgentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ categorieAgent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CategorieAgentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CategorieAgentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load categorieAgent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.categorieAgent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
