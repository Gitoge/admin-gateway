import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IBaremeCalculHeuresSupp, BaremeCalculHeuresSupp } from '../bareme-calcul-heures-supp.model';

import { BaremeCalculHeuresSuppService } from './bareme-calcul-heures-supp.service';

describe('BaremeCalculHeuresSupp Service', () => {
  let service: BaremeCalculHeuresSuppService;
  let httpMock: HttpTestingController;
  let elemDefault: IBaremeCalculHeuresSupp;
  let expectedResult: IBaremeCalculHeuresSupp | IBaremeCalculHeuresSupp[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BaremeCalculHeuresSuppService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      indiceDebut: 0,
      indiceFin: 0,
      soldeGlobalDebut: 0,
      soldeGlobalFin: 0,
      heuresOrdinaires: 0,
      dimanchesJoursFeries: 0,
      heuresNuit: 0,
      observation: 'AAAAAAA',
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

    it('should create a BaremeCalculHeuresSupp', () => {
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

      service.create(new BaremeCalculHeuresSupp()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BaremeCalculHeuresSupp', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          indiceDebut: 1,
          indiceFin: 1,
          soldeGlobalDebut: 1,
          soldeGlobalFin: 1,
          heuresOrdinaires: 1,
          dimanchesJoursFeries: 1,
          heuresNuit: 1,
          observation: 'BBBBBB',
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

    it('should partial update a BaremeCalculHeuresSupp', () => {
      const patchObject = Object.assign(
        {
          heuresNuit: 1,
          userUpdateId: 1,
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        new BaremeCalculHeuresSupp()
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

    it('should return a list of BaremeCalculHeuresSupp', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          indiceDebut: 1,
          indiceFin: 1,
          soldeGlobalDebut: 1,
          soldeGlobalFin: 1,
          heuresOrdinaires: 1,
          dimanchesJoursFeries: 1,
          heuresNuit: 1,
          observation: 'BBBBBB',
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

    it('should delete a BaremeCalculHeuresSupp', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBaremeCalculHeuresSuppToCollectionIfMissing', () => {
      it('should add a BaremeCalculHeuresSupp to an empty array', () => {
        const baremeCalculHeuresSupp: IBaremeCalculHeuresSupp = { id: 123 };
        expectedResult = service.addBaremeCalculHeuresSuppToCollectionIfMissing([], baremeCalculHeuresSupp);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(baremeCalculHeuresSupp);
      });

      it('should not add a BaremeCalculHeuresSupp to an array that contains it', () => {
        const baremeCalculHeuresSupp: IBaremeCalculHeuresSupp = { id: 123 };
        const baremeCalculHeuresSuppCollection: IBaremeCalculHeuresSupp[] = [
          {
            ...baremeCalculHeuresSupp,
          },
          { id: 456 },
        ];
        expectedResult = service.addBaremeCalculHeuresSuppToCollectionIfMissing(baremeCalculHeuresSuppCollection, baremeCalculHeuresSupp);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BaremeCalculHeuresSupp to an array that doesn't contain it", () => {
        const baremeCalculHeuresSupp: IBaremeCalculHeuresSupp = { id: 123 };
        const baremeCalculHeuresSuppCollection: IBaremeCalculHeuresSupp[] = [{ id: 456 }];
        expectedResult = service.addBaremeCalculHeuresSuppToCollectionIfMissing(baremeCalculHeuresSuppCollection, baremeCalculHeuresSupp);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(baremeCalculHeuresSupp);
      });

      it('should add only unique BaremeCalculHeuresSupp to an array', () => {
        const baremeCalculHeuresSuppArray: IBaremeCalculHeuresSupp[] = [{ id: 123 }, { id: 456 }, { id: 90262 }];
        const baremeCalculHeuresSuppCollection: IBaremeCalculHeuresSupp[] = [{ id: 123 }];
        expectedResult = service.addBaremeCalculHeuresSuppToCollectionIfMissing(
          baremeCalculHeuresSuppCollection,
          ...baremeCalculHeuresSuppArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const baremeCalculHeuresSupp: IBaremeCalculHeuresSupp = { id: 123 };
        const baremeCalculHeuresSupp2: IBaremeCalculHeuresSupp = { id: 456 };
        expectedResult = service.addBaremeCalculHeuresSuppToCollectionIfMissing([], baremeCalculHeuresSupp, baremeCalculHeuresSupp2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(baremeCalculHeuresSupp);
        expect(expectedResult).toContain(baremeCalculHeuresSupp2);
      });

      it('should accept null and undefined values', () => {
        const baremeCalculHeuresSupp: IBaremeCalculHeuresSupp = { id: 123 };
        expectedResult = service.addBaremeCalculHeuresSuppToCollectionIfMissing([], null, baremeCalculHeuresSupp, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(baremeCalculHeuresSupp);
      });

      it('should return initial array if no BaremeCalculHeuresSupp is added', () => {
        const baremeCalculHeuresSuppCollection: IBaremeCalculHeuresSupp[] = [{ id: 123 }];
        expectedResult = service.addBaremeCalculHeuresSuppToCollectionIfMissing(baremeCalculHeuresSuppCollection, undefined, null);
        expect(expectedResult).toEqual(baremeCalculHeuresSuppCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
