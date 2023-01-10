import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITableValeur, TableValeur } from '../table-valeur.model';

import { TableValeurService } from './table-valeur.service';

describe('TableValeur Service', () => {
  let service: TableValeurService;
  let httpMock: HttpTestingController;
  let elemDefault: ITableValeur;
  let expectedResult: ITableValeur | ITableValeur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TableValeurService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a TableValeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TableValeur()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TableValeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TableValeur', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
        },
        new TableValeur()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TableValeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a TableValeur', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTableValeurToCollectionIfMissing', () => {
      it('should add a TableValeur to an empty array', () => {
        const tableValeur: ITableValeur = { id: 123 };
        expectedResult = service.addTableValeurToCollectionIfMissing([], tableValeur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tableValeur);
      });

      it('should not add a TableValeur to an array that contains it', () => {
        const tableValeur: ITableValeur = { id: 123 };
        const tableValeurCollection: ITableValeur[] = [
          {
            ...tableValeur,
          },
          { id: 456 },
        ];
        expectedResult = service.addTableValeurToCollectionIfMissing(tableValeurCollection, tableValeur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TableValeur to an array that doesn't contain it", () => {
        const tableValeur: ITableValeur = { id: 123 };
        const tableValeurCollection: ITableValeur[] = [{ id: 456 }];
        expectedResult = service.addTableValeurToCollectionIfMissing(tableValeurCollection, tableValeur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tableValeur);
      });

      it('should add only unique TableValeur to an array', () => {
        const tableValeurArray: ITableValeur[] = [{ id: 123 }, { id: 456 }, { id: 12796 }];
        const tableValeurCollection: ITableValeur[] = [{ id: 123 }];
        expectedResult = service.addTableValeurToCollectionIfMissing(tableValeurCollection, ...tableValeurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tableValeur: ITableValeur = { id: 123 };
        const tableValeur2: ITableValeur = { id: 456 };
        expectedResult = service.addTableValeurToCollectionIfMissing([], tableValeur, tableValeur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tableValeur);
        expect(expectedResult).toContain(tableValeur2);
      });

      it('should accept null and undefined values', () => {
        const tableValeur: ITableValeur = { id: 123 };
        expectedResult = service.addTableValeurToCollectionIfMissing([], null, tableValeur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tableValeur);
      });

      it('should return initial array if no TableValeur is added', () => {
        const tableValeurCollection: ITableValeur[] = [{ id: 123 }];
        expectedResult = service.addTableValeurToCollectionIfMissing(tableValeurCollection, undefined, null);
        expect(expectedResult).toEqual(tableValeurCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
