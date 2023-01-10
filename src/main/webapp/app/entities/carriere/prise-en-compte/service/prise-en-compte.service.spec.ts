import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPriseEnCompte, PriseEnCompte } from '../prise-en-compte.model';

import { PriseEnCompteService } from './prise-en-compte.service';

describe('PriseEnCompte Service', () => {
  let service: PriseEnCompteService;
  let httpMock: HttpTestingController;
  let elemDefault: IPriseEnCompte;
  let expectedResult: IPriseEnCompte | IPriseEnCompte[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PriseEnCompteService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      userInsertId: 0,
      userUpdateId: 0,
      dateInsert: currentDate,
      dateUpdate: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PriseEnCompte', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new PriseEnCompte()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PriseEnCompte', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PriseEnCompte', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        new PriseEnCompte()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PriseEnCompte', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PriseEnCompte', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPriseEnCompteToCollectionIfMissing', () => {
      it('should add a PriseEnCompte to an empty array', () => {
        const priseEncompte: IPriseEnCompte = { id: 123 };
        expectedResult = service.addPriseEnCompteToCollectionIfMissing([], priseEncompte);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(priseEncompte);
      });

      it('should not add a PriseEnCompte to an array that contains it', () => {
        const priseEncompte: IPriseEnCompte = { id: 123 };
        const priseEncompteCollection: IPriseEnCompte[] = [
          {
            ...priseEncompte,
          },
          { id: 456 },
        ];
        expectedResult = service.addPriseEnCompteToCollectionIfMissing(priseEncompteCollection, priseEncompte);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PriseEnCompte to an array that doesn't contain it", () => {
        const priseEncompte: IPriseEnCompte = { id: 123 };
        const priseEncompteCollection: IPriseEnCompte[] = [{ id: 456 }];
        expectedResult = service.addPriseEnCompteToCollectionIfMissing(priseEncompteCollection, priseEncompte);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(priseEncompte);
      });

      it('should add only unique PriseEnCompte to an array', () => {
        const priseEncompteArray: IPriseEnCompte[] = [{ id: 123 }, { id: 456 }, { id: 29597 }];
        const priseEncompteCollection: IPriseEnCompte[] = [{ id: 123 }];
        expectedResult = service.addPriseEnCompteToCollectionIfMissing(priseEncompteCollection, ...priseEncompteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const priseEncompte: IPriseEnCompte = { id: 123 };
        const priseEncompte2: IPriseEnCompte = { id: 456 };
        expectedResult = service.addPriseEnCompteToCollectionIfMissing([], priseEncompte, priseEncompte2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(priseEncompte);
        expect(expectedResult).toContain(priseEncompte2);
      });

      it('should accept null and undefined values', () => {
        const priseEncompte: IPriseEnCompte = { id: 123 };
        expectedResult = service.addPriseEnCompteToCollectionIfMissing([], null, priseEncompte, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(priseEncompte);
      });

      it('should return initial array if no PriseEnCompte is added', () => {
        const priseEncompteCollection: IPriseEnCompte[] = [{ id: 123 }];
        expectedResult = service.addPriseEnCompteToCollectionIfMissing(priseEncompteCollection, undefined, null);
        expect(expectedResult).toEqual(priseEncompteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
