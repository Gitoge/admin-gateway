import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IParamMatricules, ParamMatricules } from '../param-matricules.model';

import { ParamMatriculesService } from './param-matricules.service';

describe('ParamMatricules Service', () => {
  let service: ParamMatriculesService;
  let httpMock: HttpTestingController;
  let elemDefault: IParamMatricules;
  let expectedResult: IParamMatricules | IParamMatricules[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParamMatriculesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      numeroMatricule: 0,
      datePriseEnCompte: currentDate,
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
          datePriseEnCompte: currentDate.format(DATE_FORMAT),
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

    it('should create a ParamMatricules', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          datePriseEnCompte: currentDate.format(DATE_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          datePriseEnCompte: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new ParamMatricules()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParamMatricules', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroMatricule: 1,
          datePriseEnCompte: currentDate.format(DATE_FORMAT),
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          datePriseEnCompte: currentDate,
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

    it('should partial update a ParamMatricules', () => {
      const patchObject = Object.assign(
        {
          datePriseEnCompte: currentDate.format(DATE_FORMAT),
        },
        new ParamMatricules()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          datePriseEnCompte: currentDate,
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

    it('should return a list of ParamMatricules', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numeroMatricule: 1,
          datePriseEnCompte: currentDate.format(DATE_FORMAT),
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          datePriseEnCompte: currentDate,
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

    it('should delete a ParamMatricules', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParamMatriculesToCollectionIfMissing', () => {
      it('should add a ParamMatricules to an empty array', () => {
        const paramMatricules: IParamMatricules = { id: 123 };
        expectedResult = service.addParamMatriculesToCollectionIfMissing([], paramMatricules);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramMatricules);
      });

      it('should not add a ParamMatricules to an array that contains it', () => {
        const paramMatricules: IParamMatricules = { id: 123 };
        const paramMatriculesCollection: IParamMatricules[] = [
          {
            ...paramMatricules,
          },
          { id: 456 },
        ];
        expectedResult = service.addParamMatriculesToCollectionIfMissing(paramMatriculesCollection, paramMatricules);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParamMatricules to an array that doesn't contain it", () => {
        const paramMatricules: IParamMatricules = { id: 123 };
        const paramMatriculesCollection: IParamMatricules[] = [{ id: 456 }];
        expectedResult = service.addParamMatriculesToCollectionIfMissing(paramMatriculesCollection, paramMatricules);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramMatricules);
      });

      it('should add only unique ParamMatricules to an array', () => {
        const paramMatriculesArray: IParamMatricules[] = [{ id: 123 }, { id: 456 }, { id: 4456 }];
        const paramMatriculesCollection: IParamMatricules[] = [{ id: 123 }];
        expectedResult = service.addParamMatriculesToCollectionIfMissing(paramMatriculesCollection, ...paramMatriculesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paramMatricules: IParamMatricules = { id: 123 };
        const paramMatricules2: IParamMatricules = { id: 456 };
        expectedResult = service.addParamMatriculesToCollectionIfMissing([], paramMatricules, paramMatricules2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramMatricules);
        expect(expectedResult).toContain(paramMatricules2);
      });

      it('should accept null and undefined values', () => {
        const paramMatricules: IParamMatricules = { id: 123 };
        expectedResult = service.addParamMatriculesToCollectionIfMissing([], null, paramMatricules, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramMatricules);
      });

      it('should return initial array if no ParamMatricules is added', () => {
        const paramMatriculesCollection: IParamMatricules[] = [{ id: 123 }];
        expectedResult = service.addParamMatriculesToCollectionIfMissing(paramMatriculesCollection, undefined, null);
        expect(expectedResult).toEqual(paramMatriculesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
