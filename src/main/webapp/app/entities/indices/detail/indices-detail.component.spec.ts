import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { IndicesDetailComponent } from './indices-detail.component';

describe('Indices Management Detail Component', () => {
  let comp: IndicesDetailComponent;
  let fixture: ComponentFixture<IndicesDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndicesDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ indices: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(IndicesDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(IndicesDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load indices on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.indices).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
