import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PositionsAgentDetailComponent } from './positions-agent-detail.component';

describe('PositionsAgent Management Detail Component', () => {
  let comp: PositionsAgentDetailComponent;
  let fixture: ComponentFixture<PositionsAgentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PositionsAgentDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ positionsAgent: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PositionsAgentDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PositionsAgentDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load positionsAgent on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.positionsAgent).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
