import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITableTypeValeur, TableTypeValeur } from '../table-type-valeur.model';

import { TableTypeValeurService } from './table-type-valeur.service';

describe('TableTypeValeur Service', () => {
  let service: TableTypeValeurService;
  let httpMock: HttpTestingController;
  let elemDefault: ITableTypeValeur;
  let expectedResult: ITableTypeValeur | ITableTypeValeur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TableTypeValeurService);
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

    it('should create a TableTypeValeur', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TableTypeValeur()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TableTypeValeur', () => {
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

    it('should partial update a TableTypeValeur', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          libelle: 'BBBBBB',
        },
        new TableTypeValeur()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TableTypeValeur', () => {
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

    it('should delete a TableTypeValeur', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTableTypeValeurToCollectionIfMissing', () => {
      it('should add a TableTypeValeur to an empty array', () => {
        const tableTypeValeur: ITableTypeValeur = { id: 123 };
        expectedResult = service.addTableTypeValeurToCollectionIfMissing([], tableTypeValeur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tableTypeValeur);
      });

      it('should not add a TableTypeValeur to an array that contains it', () => {
        const tableTypeValeur: ITableTypeValeur = { id: 123 };
        const tableTypeValeurCollection: ITableTypeValeur[] = [
          {
            ...tableTypeValeur,
          },
          { id: 456 },
        ];
        expectedResult = service.addTableTypeValeurToCollectionIfMissing(tableTypeValeurCollection, tableTypeValeur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TableTypeValeur to an array that doesn't contain it", () => {
        const tableTypeValeur: ITableTypeValeur = { id: 123 };
        const tableTypeValeurCollection: ITableTypeValeur[] = [{ id: 456 }];
        expectedResult = service.addTableTypeValeurToCollectionIfMissing(tableTypeValeurCollection, tableTypeValeur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tableTypeValeur);
      });

      it('should add only unique TableTypeValeur to an array', () => {
        const tableTypeValeurArray: ITableTypeValeur[] = [{ id: 123 }, { id: 456 }, { id: 73995 }];
        const tableTypeValeurCollection: ITableTypeValeur[] = [{ id: 123 }];
        expectedResult = service.addTableTypeValeurToCollectionIfMissing(tableTypeValeurCollection, ...tableTypeValeurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tableTypeValeur: ITableTypeValeur = { id: 123 };
        const tableTypeValeur2: ITableTypeValeur = { id: 456 };
        expectedResult = service.addTableTypeValeurToCollectionIfMissing([], tableTypeValeur, tableTypeValeur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tableTypeValeur);
        expect(expectedResult).toContain(tableTypeValeur2);
      });

      it('should accept null and undefined values', () => {
        const tableTypeValeur: ITableTypeValeur = { id: 123 };
        expectedResult = service.addTableTypeValeurToCollectionIfMissing([], null, tableTypeValeur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tableTypeValeur);
      });

      it('should return initial array if no TableTypeValeur is added', () => {
        const tableTypeValeurCollection: ITableTypeValeur[] = [{ id: 123 }];
        expectedResult = service.addTableTypeValeurToCollectionIfMissing(tableTypeValeurCollection, undefined, null);
        expect(expectedResult).toEqual(tableTypeValeurCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
