import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TableTypeValeurDetailComponent } from './table-type-valeur-detail.component';

describe('TableTypeValeur Management Detail Component', () => {
  let comp: TableTypeValeurDetailComponent;
  let fixture: ComponentFixture<TableTypeValeurDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableTypeValeurDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tableTypeValeur: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TableTypeValeurDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TableTypeValeurDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tableTypeValeur on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tableTypeValeur).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
