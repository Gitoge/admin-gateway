import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IActes, Actes } from '../actes.model';

import { ActesService } from './actes.service';

describe('Actes Service', () => {
  let service: ActesService;
  let httpMock: HttpTestingController;
  let elemDefault: IActes;
  let expectedResult: IActes | IActes[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ActesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      numeroActe: 0,
      dateActe: currentDate,
      dateEffet: currentDate,
      origineId: 0,
      userInsertId: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateActe: currentDate.format(DATE_FORMAT),
          dateEffet: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Actes', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateActe: currentDate.format(DATE_FORMAT),
          dateEffet: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateActe: currentDate,
          dateEffet: currentDate,
        },
        returnedFromService
      );

      service.create(new Actes()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Actes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroActe: 1,
          dateActe: currentDate.format(DATE_FORMAT),
          dateEffet: currentDate.format(DATE_FORMAT),
          origineId: 1,
          userInsertId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateActe: currentDate,
          dateEffet: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Actes', () => {
      const patchObject = Object.assign(
        {
          numeroActe: 1,
          dateEffet: currentDate.format(DATE_FORMAT),
        },
        new Actes()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateActe: currentDate,
          dateEffet: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Actes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroActe: 1,
          dateActe: currentDate.format(DATE_FORMAT),
          dateEffet: currentDate.format(DATE_FORMAT),
          origineId: 1,
          userInsertId: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateActe: currentDate,
          dateEffet: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Actes', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addActesToCollectionIfMissing', () => {
      it('should add a Actes to an empty array', () => {
        const actes: IActes = { id: 123 };
        expectedResult = service.addActesToCollectionIfMissing([], actes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actes);
      });

      it('should not add a Actes to an array that contains it', () => {
        const actes: IActes = { id: 123 };
        const actesCollection: IActes[] = [
          {
            ...actes,
          },
          { id: 456 },
        ];
        expectedResult = service.addActesToCollectionIfMissing(actesCollection, actes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Actes to an array that doesn't contain it", () => {
        const actes: IActes = { id: 123 };
        const actesCollection: IActes[] = [{ id: 456 }];
        expectedResult = service.addActesToCollectionIfMissing(actesCollection, actes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actes);
      });

      it('should add only unique Actes to an array', () => {
        const actesArray: IActes[] = [{ id: 123 }, { id: 456 }, { id: 99284 }];
        const actesCollection: IActes[] = [{ id: 123 }];
        expectedResult = service.addActesToCollectionIfMissing(actesCollection, ...actesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const actes: IActes = { id: 123 };
        const actes2: IActes = { id: 456 };
        expectedResult = service.addActesToCollectionIfMissing([], actes, actes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(actes);
        expect(expectedResult).toContain(actes2);
      });

      it('should accept null and undefined values', () => {
        const actes: IActes = { id: 123 };
        expectedResult = service.addActesToCollectionIfMissing([], null, actes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(actes);
      });

      it('should return initial array if no Actes is added', () => {
        const actesCollection: IActes[] = [{ id: 123 }];
        expectedResult = service.addActesToCollectionIfMissing(actesCollection, undefined, null);
        expect(expectedResult).toEqual(actesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
