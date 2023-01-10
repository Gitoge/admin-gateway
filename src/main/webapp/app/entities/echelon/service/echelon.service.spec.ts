import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEchelon, Echelon } from '../echelon.model';

import { EchelonService } from './echelon.service';

describe('Echelon Service', () => {
  let service: EchelonService;
  let httpMock: HttpTestingController;
  let elemDefault: IEchelon;
  let expectedResult: IEchelon | IEchelon[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EchelonService);
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

    it('should create a Echelon', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Echelon()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Echelon', () => {
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

    it('should partial update a Echelon', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          libelle: 'BBBBBB',
        },
        new Echelon()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Echelon', () => {
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

    it('should delete a Echelon', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEchelonToCollectionIfMissing', () => {
      it('should add a Echelon to an empty array', () => {
        const echelon: IEchelon = { id: 123 };
        expectedResult = service.addEchelonToCollectionIfMissing([], echelon);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(echelon);
      });

      it('should not add a Echelon to an array that contains it', () => {
        const echelon: IEchelon = { id: 123 };
        const echelonCollection: IEchelon[] = [
          {
            ...echelon,
          },
          { id: 456 },
        ];
        expectedResult = service.addEchelonToCollectionIfMissing(echelonCollection, echelon);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Echelon to an array that doesn't contain it", () => {
        const echelon: IEchelon = { id: 123 };
        const echelonCollection: IEchelon[] = [{ id: 456 }];
        expectedResult = service.addEchelonToCollectionIfMissing(echelonCollection, echelon);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(echelon);
      });

      it('should add only unique Echelon to an array', () => {
        const echelonArray: IEchelon[] = [{ id: 123 }, { id: 456 }, { id: 36870 }];
        const echelonCollection: IEchelon[] = [{ id: 123 }];
        expectedResult = service.addEchelonToCollectionIfMissing(echelonCollection, ...echelonArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const echelon: IEchelon = { id: 123 };
        const echelon2: IEchelon = { id: 456 };
        expectedResult = service.addEchelonToCollectionIfMissing([], echelon, echelon2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(echelon);
        expect(expectedResult).toContain(echelon2);
      });

      it('should accept null and undefined values', () => {
        const echelon: IEchelon = { id: 123 };
        expectedResult = service.addEchelonToCollectionIfMissing([], null, echelon, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(echelon);
      });

      it('should return initial array if no Echelon is added', () => {
        const echelonCollection: IEchelon[] = [{ id: 123 }];
        expectedResult = service.addEchelonToCollectionIfMissing(echelonCollection, undefined, null);
        expect(expectedResult).toEqual(echelonCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
