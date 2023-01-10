import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IParamBaremeMinimumFiscal, ParamBaremeMinimumFiscal } from '../param-bareme-minimum-fiscal.model';

import { ParamBaremeMinimumFiscalService } from './param-bareme-minimum-fiscal.service';

describe('ParamBaremeMinimumFiscal Service', () => {
  let service: ParamBaremeMinimumFiscalService;
  let httpMock: HttpTestingController;
  let elemDefault: IParamBaremeMinimumFiscal;
  let expectedResult: IParamBaremeMinimumFiscal | IParamBaremeMinimumFiscal[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParamBaremeMinimumFiscalService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      montantPlafond: 0,
      montantAPrelever: 0,
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

    it('should create a ParamBaremeMinimumFiscal', () => {
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

      service.create(new ParamBaremeMinimumFiscal()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParamBaremeMinimumFiscal', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          montantPlafond: 1,
          montantAPrelever: 1,
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

    it('should partial update a ParamBaremeMinimumFiscal', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          montantPlafond: 1,
          montantAPrelever: 1,
        },
        new ParamBaremeMinimumFiscal()
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

    it('should return a list of ParamBaremeMinimumFiscal', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          montantPlafond: 1,
          montantAPrelever: 1,
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

    it('should delete a ParamBaremeMinimumFiscal', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParamBaremeMinimumFiscalToCollectionIfMissing', () => {
      it('should add a ParamBaremeMinimumFiscal to an empty array', () => {
        const paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal = { id: 123 };
        expectedResult = service.addParamBaremeMinimumFiscalToCollectionIfMissing([], paramBaremeMinimumFiscal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramBaremeMinimumFiscal);
      });

      it('should not add a ParamBaremeMinimumFiscal to an array that contains it', () => {
        const paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal = { id: 123 };
        const paramBaremeMinimumFiscalCollection: IParamBaremeMinimumFiscal[] = [
          {
            ...paramBaremeMinimumFiscal,
          },
          { id: 456 },
        ];
        expectedResult = service.addParamBaremeMinimumFiscalToCollectionIfMissing(
          paramBaremeMinimumFiscalCollection,
          paramBaremeMinimumFiscal
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParamBaremeMinimumFiscal to an array that doesn't contain it", () => {
        const paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal = { id: 123 };
        const paramBaremeMinimumFiscalCollection: IParamBaremeMinimumFiscal[] = [{ id: 456 }];
        expectedResult = service.addParamBaremeMinimumFiscalToCollectionIfMissing(
          paramBaremeMinimumFiscalCollection,
          paramBaremeMinimumFiscal
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramBaremeMinimumFiscal);
      });

      it('should add only unique ParamBaremeMinimumFiscal to an array', () => {
        const paramBaremeMinimumFiscalArray: IParamBaremeMinimumFiscal[] = [{ id: 123 }, { id: 456 }, { id: 49970 }];
        const paramBaremeMinimumFiscalCollection: IParamBaremeMinimumFiscal[] = [{ id: 123 }];
        expectedResult = service.addParamBaremeMinimumFiscalToCollectionIfMissing(
          paramBaremeMinimumFiscalCollection,
          ...paramBaremeMinimumFiscalArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal = { id: 123 };
        const paramBaremeMinimumFiscal2: IParamBaremeMinimumFiscal = { id: 456 };
        expectedResult = service.addParamBaremeMinimumFiscalToCollectionIfMissing([], paramBaremeMinimumFiscal, paramBaremeMinimumFiscal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramBaremeMinimumFiscal);
        expect(expectedResult).toContain(paramBaremeMinimumFiscal2);
      });

      it('should accept null and undefined values', () => {
        const paramBaremeMinimumFiscal: IParamBaremeMinimumFiscal = { id: 123 };
        expectedResult = service.addParamBaremeMinimumFiscalToCollectionIfMissing([], null, paramBaremeMinimumFiscal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramBaremeMinimumFiscal);
      });

      it('should return initial array if no ParamBaremeMinimumFiscal is added', () => {
        const paramBaremeMinimumFiscalCollection: IParamBaremeMinimumFiscal[] = [{ id: 123 }];
        expectedResult = service.addParamBaremeMinimumFiscalToCollectionIfMissing(paramBaremeMinimumFiscalCollection, undefined, null);
        expect(expectedResult).toEqual(paramBaremeMinimumFiscalCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
