import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IParamBulletins, ParamBulletins } from '../param-bulletins.model';

import { ParamBulletinsService } from './param-bulletins.service';

describe('ParamBulletins Service', () => {
  let service: ParamBulletinsService;
  let httpMock: HttpTestingController;
  let elemDefault: IParamBulletins;
  let expectedResult: IParamBulletins | IParamBulletins[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParamBulletinsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      entete: 'AAAAAAA',
      signature: 'AAAAAAA',
      arrierePlan: 'AAAAAAA',
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

    it('should create a ParamBulletins', () => {
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

      service.create(new ParamBulletins()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParamBulletins', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          entete: 'BBBBBB',
          signature: 'BBBBBB',
          arrierePlan: 'BBBBBB',
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

    it('should partial update a ParamBulletins', () => {
      const patchObject = Object.assign(
        {
          signature: 'BBBBBB',
          arrierePlan: 'BBBBBB',
        },
        new ParamBulletins()
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

    it('should return a list of ParamBulletins', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          entete: 'BBBBBB',
          signature: 'BBBBBB',
          arrierePlan: 'BBBBBB',
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

    it('should delete a ParamBulletins', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParamBulletinsToCollectionIfMissing', () => {
      it('should add a ParamBulletins to an empty array', () => {
        const paramBulletins: IParamBulletins = { id: 123 };
        expectedResult = service.addParamBulletinsToCollectionIfMissing([], paramBulletins);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramBulletins);
      });

      it('should not add a ParamBulletins to an array that contains it', () => {
        const paramBulletins: IParamBulletins = { id: 123 };
        const paramBulletinsCollection: IParamBulletins[] = [
          {
            ...paramBulletins,
          },
          { id: 456 },
        ];
        expectedResult = service.addParamBulletinsToCollectionIfMissing(paramBulletinsCollection, paramBulletins);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParamBulletins to an array that doesn't contain it", () => {
        const paramBulletins: IParamBulletins = { id: 123 };
        const paramBulletinsCollection: IParamBulletins[] = [{ id: 456 }];
        expectedResult = service.addParamBulletinsToCollectionIfMissing(paramBulletinsCollection, paramBulletins);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramBulletins);
      });

      it('should add only unique ParamBulletins to an array', () => {
        const paramBulletinsArray: IParamBulletins[] = [{ id: 123 }, { id: 456 }, { id: 96594 }];
        const paramBulletinsCollection: IParamBulletins[] = [{ id: 123 }];
        expectedResult = service.addParamBulletinsToCollectionIfMissing(paramBulletinsCollection, ...paramBulletinsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paramBulletins: IParamBulletins = { id: 123 };
        const paramBulletins2: IParamBulletins = { id: 456 };
        expectedResult = service.addParamBulletinsToCollectionIfMissing([], paramBulletins, paramBulletins2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paramBulletins);
        expect(expectedResult).toContain(paramBulletins2);
      });

      it('should accept null and undefined values', () => {
        const paramBulletins: IParamBulletins = { id: 123 };
        expectedResult = service.addParamBulletinsToCollectionIfMissing([], null, paramBulletins, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paramBulletins);
      });

      it('should return initial array if no ParamBulletins is added', () => {
        const paramBulletinsCollection: IParamBulletins[] = [{ id: 123 }];
        expectedResult = service.addParamBulletinsToCollectionIfMissing(paramBulletinsCollection, undefined, null);
        expect(expectedResult).toEqual(paramBulletinsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
