import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IParamBaremeImposable, ParamBaremeImposable } from '../param-bareme-imposable.model';

import { ParamBaremeImposableService } from './param-bareme-imposable.service';

describe('ParamBaremeImposable Service', () => {
  let service: ParamBaremeImposableService;
  let httpMock: HttpTestingController;
  let elemDefault: IParamBaremeImposable;
  let expectedResult: IParamBaremeImposable | IParamBaremeImposable[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParamBaremeImposableService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      salaireDebut: 0,
      salaireFin: 0,
      tauxTranche: 0,
      tauxCumule: 0,
      montant: 0,
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

    it('should create a ParamBaremeImposable', () => {
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

      service.create(new ParamBaremeImposable()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParamBaremeImposable', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          salaireDebut: 1,
          salaireFin: 1,
          tauxTranche: 1,
          tauxCumule: 1,
          montant: 1,
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

    it('should partial update a ParamBaremeImposable', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          montant: 1,
          userIdInsert: 1,
        },
        new ParamBaremeImposable()
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

    it('should return a list of ParamBaremeImposable', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          salaireDebut: 1,
          salaireFin: 1,
          tauxTranche: 1,
          tauxCumule: 1,
          montant: 1,
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

    it('should delete a ParamBaremeImposable', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParamBaremeImposableToCollectionIfMissing', () => {
      it('should add a ParamBaremeImposable to an empty array', () => {
        const paramBaremeImposable: IParamBaremeImposable = { id: 123 };
        expectedResult = service.addParamBaremeImposableToCollectionIfMissing([], paramBaremeImposable);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramBaremeImposable);
      });

      it('should not add a ParamBaremeImposable to an array that contains it', () => {
        const paramBaremeImposable: IParamBaremeImposable = { id: 123 };
        const paramBaremeImposableCollection: IParamBaremeImposable[] = [
          {
            ...paramBaremeImposable,
          },
          { id: 456 },
        ];
        expectedResult = service.addParamBaremeImposableToCollectionIfMissing(paramBaremeImposableCollection, paramBaremeImposable);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParamBaremeImposable to an array that doesn't contain it", () => {
        const paramBaremeImposable: IParamBaremeImposable = { id: 123 };
        const paramBaremeImposableCollection: IParamBaremeImposable[] = [{ id: 456 }];
        expectedResult = service.addParamBaremeImposableToCollectionIfMissing(paramBaremeImposableCollection, paramBaremeImposable);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramBaremeImposable);
      });

      it('should add only unique ParamBaremeImposable to an array', () => {
        const paramBaremeImposableArray: IParamBaremeImposable[] = [{ id: 123 }, { id: 456 }, { id: 40082 }];
        const paramBaremeImposableCollection: IParamBaremeImposable[] = [{ id: 123 }];
        expectedResult = service.addParamBaremeImposableToCollectionIfMissing(paramBaremeImposableCollection, ...paramBaremeImposableArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paramBaremeImposable: IParamBaremeImposable = { id: 123 };
        const paramBaremeImposable2: IParamBaremeImposable = { id: 456 };
        expectedResult = service.addParamBaremeImposableToCollectionIfMissing([], paramBaremeImposable, paramBaremeImposable2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramBaremeImposable);
        expect(expectedResult).toContain(paramBaremeImposable2);
      });

      it('should accept null and undefined values', () => {
        const paramBaremeImposable: IParamBaremeImposable = { id: 123 };
        expectedResult = service.addParamBaremeImposableToCollectionIfMissing([], null, paramBaremeImposable, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramBaremeImposable);
      });

      it('should return initial array if no ParamBaremeImposable is added', () => {
        const paramBaremeImposableCollection: IParamBaremeImposable[] = [{ id: 123 }];
        expectedResult = service.addParamBaremeImposableToCollectionIfMissing(paramBaremeImposableCollection, undefined, null);
        expect(expectedResult).toEqual(paramBaremeImposableCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
