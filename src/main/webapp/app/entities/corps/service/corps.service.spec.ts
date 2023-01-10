import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICorps, Corps } from '../corps.model';

import { CorpsService } from './corps.service';

describe('Corps Service', () => {
  let service: CorpsService;
  let httpMock: HttpTestingController;
  let elemDefault: ICorps;
  let expectedResult: ICorps | ICorps[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CorpsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
      codHierarchie: 'AAAAAAA',
      ageRetraite: 0,
      classification: 'AAAAAAA',
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

    it('should create a Corps', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Corps()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Corps', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          codHierarchie: 'BBBBBB',
          ageRetraite: 1,
          classification: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Corps', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          codHierarchie: 'BBBBBB',
          ageRetraite: 1,
        },
        new Corps()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Corps', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          codHierarchie: 'BBBBBB',
          ageRetraite: 1,
          classification: 'BBBBBB',
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

    it('should delete a Corps', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCorpsToCollectionIfMissing', () => {
      it('should add a Corps to an empty array', () => {
        const corps: ICorps = { id: 123 };
        expectedResult = service.addCorpsToCollectionIfMissing([], corps);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(corps);
      });

      it('should not add a Corps to an array that contains it', () => {
        const corps: ICorps = { id: 123 };
        const corpsCollection: ICorps[] = [
          {
            ...corps,
          },
          { id: 456 },
        ];
        expectedResult = service.addCorpsToCollectionIfMissing(corpsCollection, corps);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Corps to an array that doesn't contain it", () => {
        const corps: ICorps = { id: 123 };
        const corpsCollection: ICorps[] = [{ id: 456 }];
        expectedResult = service.addCorpsToCollectionIfMissing(corpsCollection, corps);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(corps);
      });

      it('should add only unique Corps to an array', () => {
        const corpsArray: ICorps[] = [{ id: 123 }, { id: 456 }, { id: 47324 }];
        const corpsCollection: ICorps[] = [{ id: 123 }];
        expectedResult = service.addCorpsToCollectionIfMissing(corpsCollection, ...corpsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const corps: ICorps = { id: 123 };
        const corps2: ICorps = { id: 456 };
        expectedResult = service.addCorpsToCollectionIfMissing([], corps, corps2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(corps);
        expect(expectedResult).toContain(corps2);
      });

      it('should accept null and undefined values', () => {
        const corps: ICorps = { id: 123 };
        expectedResult = service.addCorpsToCollectionIfMissing([], null, corps, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(corps);
      });

      it('should return initial array if no Corps is added', () => {
        const corpsCollection: ICorps[] = [{ id: 123 }];
        expectedResult = service.addCorpsToCollectionIfMissing(corpsCollection, undefined, null);
        expect(expectedResult).toEqual(corpsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
