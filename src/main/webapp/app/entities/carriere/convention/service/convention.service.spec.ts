import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IConvention, Convention } from '../convention.model';

import { ConventionService } from './convention.service';

describe('Convention Service', () => {
  let service: ConventionService;
  let httpMock: HttpTestingController;
  let elemDefault: IConvention;
  let expectedResult: IConvention | IConvention[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConventionService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
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

    it('should create a Convention', () => {
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

      service.create(new Convention()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Convention', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should partial update a Convention', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        new Convention()
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

    it('should return a list of Convention', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should delete a Convention', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addConventionToCollectionIfMissing', () => {
      it('should add a Convention to an empty array', () => {
        const convention: IConvention = { id: 123 };
        expectedResult = service.addConventionToCollectionIfMissing([], convention);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(convention);
      });

      it('should not add a Convention to an array that contains it', () => {
        const convention: IConvention = { id: 123 };
        const conventionCollection: IConvention[] = [
          {
            ...convention,
          },
          { id: 456 },
        ];
        expectedResult = service.addConventionToCollectionIfMissing(conventionCollection, convention);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Convention to an array that doesn't contain it", () => {
        const convention: IConvention = { id: 123 };
        const conventionCollection: IConvention[] = [{ id: 456 }];
        expectedResult = service.addConventionToCollectionIfMissing(conventionCollection, convention);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(convention);
      });

      it('should add only unique Convention to an array', () => {
        const conventionArray: IConvention[] = [{ id: 123 }, { id: 456 }, { id: 98207 }];
        const conventionCollection: IConvention[] = [{ id: 123 }];
        expectedResult = service.addConventionToCollectionIfMissing(conventionCollection, ...conventionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const convention: IConvention = { id: 123 };
        const convention2: IConvention = { id: 456 };
        expectedResult = service.addConventionToCollectionIfMissing([], convention, convention2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(convention);
        expect(expectedResult).toContain(convention2);
      });

      it('should accept null and undefined values', () => {
        const convention: IConvention = { id: 123 };
        expectedResult = service.addConventionToCollectionIfMissing([], null, convention, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(convention);
      });

      it('should return initial array if no Convention is added', () => {
        const conventionCollection: IConvention[] = [{ id: 123 }];
        expectedResult = service.addConventionToCollectionIfMissing(conventionCollection, undefined, null);
        expect(expectedResult).toEqual(conventionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
