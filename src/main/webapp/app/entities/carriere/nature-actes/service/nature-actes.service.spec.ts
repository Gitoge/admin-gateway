import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { INatureActes, NatureActes } from '../nature-actes.model';

import { NatureActesService } from './nature-actes.service';

describe('NatureActes Service', () => {
  let service: NatureActesService;
  let httpMock: HttpTestingController;
  let elemDefault: INatureActes;
  let expectedResult: INatureActes | INatureActes[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NatureActesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      userInsertId: 0,
      userdateInsert: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          userdateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a NatureActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          userdateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.create(new NatureActes()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NatureActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          userInsertId: 1,
          userdateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a NatureActes', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          userInsertId: 1,
        },
        new NatureActes()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of NatureActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          userInsertId: 1,
          userdateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a NatureActes', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNatureActesToCollectionIfMissing', () => {
      it('should add a NatureActes to an empty array', () => {
        const natureActes: INatureActes = { id: 123 };
        expectedResult = service.addNatureActesToCollectionIfMissing([], natureActes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(natureActes);
      });

      it('should not add a NatureActes to an array that contains it', () => {
        const natureActes: INatureActes = { id: 123 };
        const natureActesCollection: INatureActes[] = [
          {
            ...natureActes,
          },
          { id: 456 },
        ];
        expectedResult = service.addNatureActesToCollectionIfMissing(natureActesCollection, natureActes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NatureActes to an array that doesn't contain it", () => {
        const natureActes: INatureActes = { id: 123 };
        const natureActesCollection: INatureActes[] = [{ id: 456 }];
        expectedResult = service.addNatureActesToCollectionIfMissing(natureActesCollection, natureActes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(natureActes);
      });

      it('should add only unique NatureActes to an array', () => {
        const natureActesArray: INatureActes[] = [{ id: 123 }, { id: 456 }, { id: 22488 }];
        const natureActesCollection: INatureActes[] = [{ id: 123 }];
        expectedResult = service.addNatureActesToCollectionIfMissing(natureActesCollection, ...natureActesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const natureActes: INatureActes = { id: 123 };
        const natureActes2: INatureActes = { id: 456 };
        expectedResult = service.addNatureActesToCollectionIfMissing([], natureActes, natureActes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(natureActes);
        expect(expectedResult).toContain(natureActes2);
      });

      it('should accept null and undefined values', () => {
        const natureActes: INatureActes = { id: 123 };
        expectedResult = service.addNatureActesToCollectionIfMissing([], null, natureActes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(natureActes);
      });

      it('should return initial array if no NatureActes is added', () => {
        const natureActesCollection: INatureActes[] = [{ id: 123 }];
        expectedResult = service.addNatureActesToCollectionIfMissing(natureActesCollection, undefined, null);
        expect(expectedResult).toEqual(natureActesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
