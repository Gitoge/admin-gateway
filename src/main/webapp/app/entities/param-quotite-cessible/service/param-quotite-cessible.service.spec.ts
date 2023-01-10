import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IParamQuotiteCessible, ParamQuotiteCessible } from '../param-quotite-cessible.model';

import { ParamQuotiteCessibleService } from './param-quotite-cessible.service';

describe('ParamQuotiteCessible Service', () => {
  let service: ParamQuotiteCessibleService;
  let httpMock: HttpTestingController;
  let elemDefault: IParamQuotiteCessible;
  let expectedResult: IParamQuotiteCessible | IParamQuotiteCessible[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParamQuotiteCessibleService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      salaireDebut: 0,
      salaireFin: 0,
      tauxTranche: 0,
      dateImpact: currentDate,
      userIdInsert: 0,
      userdateInsert: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateImpact: currentDate.format(DATE_FORMAT),
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ParamQuotiteCessible', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateImpact: currentDate.format(DATE_FORMAT),
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateImpact: currentDate,
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.create(new ParamQuotiteCessible()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParamQuotiteCessible', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          salaireDebut: 1,
          salaireFin: 1,
          tauxTranche: 1,
          dateImpact: currentDate.format(DATE_FORMAT),
          userIdInsert: 1,
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateImpact: currentDate,
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ParamQuotiteCessible', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          salaireDebut: 1,
          salaireFin: 1,
          tauxTranche: 1,
          userIdInsert: 1,
        },
        new ParamQuotiteCessible()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateImpact: currentDate,
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ParamQuotiteCessible', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          salaireDebut: 1,
          salaireFin: 1,
          tauxTranche: 1,
          dateImpact: currentDate.format(DATE_FORMAT),
          userIdInsert: 1,
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateImpact: currentDate,
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

    it('should delete a ParamQuotiteCessible', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParamQuotiteCessibleToCollectionIfMissing', () => {
      it('should add a ParamQuotiteCessible to an empty array', () => {
        const paramQuotiteCessible: IParamQuotiteCessible = { id: 123 };
        expectedResult = service.addParamQuotiteCessibleToCollectionIfMissing([], paramQuotiteCessible);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramQuotiteCessible);
      });

      it('should not add a ParamQuotiteCessible to an array that contains it', () => {
        const paramQuotiteCessible: IParamQuotiteCessible = { id: 123 };
        const paramQuotiteCessibleCollection: IParamQuotiteCessible[] = [
          {
            ...paramQuotiteCessible,
          },
          { id: 456 },
        ];
        expectedResult = service.addParamQuotiteCessibleToCollectionIfMissing(paramQuotiteCessibleCollection, paramQuotiteCessible);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParamQuotiteCessible to an array that doesn't contain it", () => {
        const paramQuotiteCessible: IParamQuotiteCessible = { id: 123 };
        const paramQuotiteCessibleCollection: IParamQuotiteCessible[] = [{ id: 456 }];
        expectedResult = service.addParamQuotiteCessibleToCollectionIfMissing(paramQuotiteCessibleCollection, paramQuotiteCessible);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramQuotiteCessible);
      });

      it('should add only unique ParamQuotiteCessible to an array', () => {
        const paramQuotiteCessibleArray: IParamQuotiteCessible[] = [{ id: 123 }, { id: 456 }, { id: 88382 }];
        const paramQuotiteCessibleCollection: IParamQuotiteCessible[] = [{ id: 123 }];
        expectedResult = service.addParamQuotiteCessibleToCollectionIfMissing(paramQuotiteCessibleCollection, ...paramQuotiteCessibleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paramQuotiteCessible: IParamQuotiteCessible = { id: 123 };
        const paramQuotiteCessible2: IParamQuotiteCessible = { id: 456 };
        expectedResult = service.addParamQuotiteCessibleToCollectionIfMissing([], paramQuotiteCessible, paramQuotiteCessible2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramQuotiteCessible);
        expect(expectedResult).toContain(paramQuotiteCessible2);
      });

      it('should accept null and undefined values', () => {
        const paramQuotiteCessible: IParamQuotiteCessible = { id: 123 };
        expectedResult = service.addParamQuotiteCessibleToCollectionIfMissing([], null, paramQuotiteCessible, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramQuotiteCessible);
      });

      it('should return initial array if no ParamQuotiteCessible is added', () => {
        const paramQuotiteCessibleCollection: IParamQuotiteCessible[] = [{ id: 123 }];
        expectedResult = service.addParamQuotiteCessibleToCollectionIfMissing(paramQuotiteCessibleCollection, undefined, null);
        expect(expectedResult).toEqual(paramQuotiteCessibleCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
