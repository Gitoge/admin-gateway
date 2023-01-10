import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TableValeurDetailComponent } from './table-valeur-detail.component';

describe('TableValeur Management Detail Component', () => {
  let comp: TableValeurDetailComponent;
  let fixture: ComponentFixture<TableValeurDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableValeurDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tableValeur: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TableValeurDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TableValeurDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tableValeur on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tableValeur).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
