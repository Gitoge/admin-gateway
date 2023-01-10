import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INationalite, Nationalite } from '../nationalite.model';

import { NationaliteService } from './nationalite.service';

describe('Nationalite Service', () => {
  let service: NationaliteService;
  let httpMock: HttpTestingController;
  let elemDefault: INationalite;
  let expectedResult: INationalite | INationalite[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NationaliteService);
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

    it('should create a Nationalite', () => {
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

      service.create(new Nationalite()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Nationalite', () => {
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

    it('should partial update a Nationalite', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        new Nationalite()
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

    it('should return a list of Nationalite', () => {
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

    it('should delete a Nationalite', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNationaliteToCollectionIfMissing', () => {
      it('should add a Nationalite to an empty array', () => {
        const nationalite: INationalite = { id: 123 };
        expectedResult = service.addNationaliteToCollectionIfMissing([], nationalite);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nationalite);
      });

      it('should not add a Nationalite to an array that contains it', () => {
        const nationalite: INationalite = { id: 123 };
        const nationaliteCollection: INationalite[] = [
          {
            ...nationalite,
          },
          { id: 456 },
        ];
        expectedResult = service.addNationaliteToCollectionIfMissing(nationaliteCollection, nationalite);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Nationalite to an array that doesn't contain it", () => {
        const nationalite: INationalite = { id: 123 };
        const nationaliteCollection: INationalite[] = [{ id: 456 }];
        expectedResult = service.addNationaliteToCollectionIfMissing(nationaliteCollection, nationalite);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nationalite);
      });

      it('should add only unique Nationalite to an array', () => {
        const nationaliteArray: INationalite[] = [{ id: 123 }, { id: 456 }, { id: 29597 }];
        const nationaliteCollection: INationalite[] = [{ id: 123 }];
        expectedResult = service.addNationaliteToCollectionIfMissing(nationaliteCollection, ...nationaliteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const nationalite: INationalite = { id: 123 };
        const nationalite2: INationalite = { id: 456 };
        expectedResult = service.addNationaliteToCollectionIfMissing([], nationalite, nationalite2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(nationalite);
        expect(expectedResult).toContain(nationalite2);
      });

      it('should accept null and undefined values', () => {
        const nationalite: INationalite = { id: 123 };
        expectedResult = service.addNationaliteToCollectionIfMissing([], null, nationalite, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(nationalite);
      });

      it('should return initial array if no Nationalite is added', () => {
        const nationaliteCollection: INationalite[] = [{ id: 123 }];
        expectedResult = service.addNationaliteToCollectionIfMissing(nationaliteCollection, undefined, null);
        expect(expectedResult).toEqual(nationaliteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
