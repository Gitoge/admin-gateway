import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IParamPartsFiscales, ParamPartsFiscales } from '../param-parts-fiscales.model';

import { ParamPartsFiscalesService } from './param-parts-fiscales.service';

describe('ParamPartsFiscales Service', () => {
  let service: ParamPartsFiscalesService;
  let httpMock: HttpTestingController;
  let elemDefault: IParamPartsFiscales;
  let expectedResult: IParamPartsFiscales | IParamPartsFiscales[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParamPartsFiscalesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      composition: 'AAAAAAA',
      nombreParts: 0,
      description: 'AAAAAAA',
      userIdInsert: 0,
      userdateInsert: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ParamPartsFiscales', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.create(new ParamPartsFiscales()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParamPartsFiscales', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          composition: 'BBBBBB',
          nombreParts: 1,
          description: 'BBBBBB',
          userIdInsert: 1,
          userdateInsert: currentDate.format(DATE_FORMAT),
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

    it('should partial update a ParamPartsFiscales', () => {
      const patchObject = Object.assign(
        {
          composition: 'BBBBBB',
          description: 'BBBBBB',
          userIdInsert: 1,
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        new ParamPartsFiscales()
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

    it('should return a list of ParamPartsFiscales', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          composition: 'BBBBBB',
          nombreParts: 1,
          description: 'BBBBBB',
          userIdInsert: 1,
          userdateInsert: currentDate.format(DATE_FORMAT),
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

    it('should delete a ParamPartsFiscales', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParamPartsFiscalesToCollectionIfMissing', () => {
      it('should add a ParamPartsFiscales to an empty array', () => {
        const paramPartsFiscales: IParamPartsFiscales = { id: 123 };
        expectedResult = service.addParamPartsFiscalesToCollectionIfMissing([], paramPartsFiscales);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramPartsFiscales);
      });

      it('should not add a ParamPartsFiscales to an array that contains it', () => {
        const paramPartsFiscales: IParamPartsFiscales = { id: 123 };
        const paramPartsFiscalesCollection: IParamPartsFiscales[] = [
          {
            ...paramPartsFiscales,
          },
          { id: 456 },
        ];
        expectedResult = service.addParamPartsFiscalesToCollectionIfMissing(paramPartsFiscalesCollection, paramPartsFiscales);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParamPartsFiscales to an array that doesn't contain it", () => {
        const paramPartsFiscales: IParamPartsFiscales = { id: 123 };
        const paramPartsFiscalesCollection: IParamPartsFiscales[] = [{ id: 456 }];
        expectedResult = service.addParamPartsFiscalesToCollectionIfMissing(paramPartsFiscalesCollection, paramPartsFiscales);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramPartsFiscales);
      });

      it('should add only unique ParamPartsFiscales to an array', () => {
        const paramPartsFiscalesArray: IParamPartsFiscales[] = [{ id: 123 }, { id: 456 }, { id: 16635 }];
        const paramPartsFiscalesCollection: IParamPartsFiscales[] = [{ id: 123 }];
        expectedResult = service.addParamPartsFiscalesToCollectionIfMissing(paramPartsFiscalesCollection, ...paramPartsFiscalesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paramPartsFiscales: IParamPartsFiscales = { id: 123 };
        const paramPartsFiscales2: IParamPartsFiscales = { id: 456 };
        expectedResult = service.addParamPartsFiscalesToCollectionIfMissing([], paramPartsFiscales, paramPartsFiscales2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramPartsFiscales);
        expect(expectedResult).toContain(paramPartsFiscales2);
      });

      it('should accept null and undefined values', () => {
        const paramPartsFiscales: IParamPartsFiscales = { id: 123 };
        expectedResult = service.addParamPartsFiscalesToCollectionIfMissing([], null, paramPartsFiscales, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramPartsFiscales);
      });

      it('should return initial array if no ParamPartsFiscales is added', () => {
        const paramPartsFiscalesCollection: IParamPartsFiscales[] = [{ id: 123 }];
        expectedResult = service.addParamPartsFiscalesToCollectionIfMissing(paramPartsFiscalesCollection, undefined, null);
        expect(expectedResult).toEqual(paramPartsFiscalesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
