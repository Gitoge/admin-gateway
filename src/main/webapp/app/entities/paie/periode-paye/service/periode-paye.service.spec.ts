import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPeriodePaye, PeriodePaye } from '../periode-paye.model';

import { PeriodePayeService } from './periode-paye.service';

describe('PeriodePaye Service', () => {
  let service: PeriodePayeService;
  let httpMock: HttpTestingController;
  let elemDefault: IPeriodePaye;
  let expectedResult: IPeriodePaye | IPeriodePaye[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PeriodePayeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      libelle: 'AAAAAAA',
      dateDebut: currentDate,
      dateFin: currentDate,
      dateDebutSaisie: currentDate,
      dateFinSaisie: currentDate,
      dateDebutCalculSal: currentDate,
      dateFinCalculSal: currentDate,
      statut: 'AAAAAAA',
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
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
          dateDebutSaisie: currentDate.format(DATE_FORMAT),
          dateFinSaisie: currentDate.format(DATE_FORMAT),
          dateDebutCalculSal: currentDate.format(DATE_FORMAT),
          dateFinCalculSal: currentDate.format(DATE_FORMAT),
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

    it('should create a PeriodePaye', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
          dateDebutSaisie: currentDate.format(DATE_FORMAT),
          dateFinSaisie: currentDate.format(DATE_FORMAT),
          dateDebutCalculSal: currentDate.format(DATE_FORMAT),
          dateFinCalculSal: currentDate.format(DATE_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
          dateDebutSaisie: currentDate,
          dateFinSaisie: currentDate,
          dateDebutCalculSal: currentDate,
          dateFinCalculSal: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new PeriodePaye()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PeriodePaye', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
          dateDebutSaisie: currentDate.format(DATE_FORMAT),
          dateFinSaisie: currentDate.format(DATE_FORMAT),
          dateDebutCalculSal: currentDate.format(DATE_FORMAT),
          dateFinCalculSal: currentDate.format(DATE_FORMAT),
          statut: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
          dateDebutSaisie: currentDate,
          dateFinSaisie: currentDate,
          dateDebutCalculSal: currentDate,
          dateFinCalculSal: currentDate,
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

    it('should partial update a PeriodePaye', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
          dateFinSaisie: currentDate.format(DATE_FORMAT),
          dateFinCalculSal: currentDate.format(DATE_FORMAT),
          statut: 'BBBBBB',
          userInsertId: 1,
        },
        new PeriodePaye()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
          dateDebutSaisie: currentDate,
          dateFinSaisie: currentDate,
          dateDebutCalculSal: currentDate,
          dateFinCalculSal: currentDate,
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

    it('should return a list of PeriodePaye', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
          dateDebutSaisie: currentDate.format(DATE_FORMAT),
          dateFinSaisie: currentDate.format(DATE_FORMAT),
          dateDebutCalculSal: currentDate.format(DATE_FORMAT),
          dateFinCalculSal: currentDate.format(DATE_FORMAT),
          statut: 'BBBBBB',
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
          dateDebutSaisie: currentDate,
          dateFinSaisie: currentDate,
          dateDebutCalculSal: currentDate,
          dateFinCalculSal: currentDate,
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

    it('should delete a PeriodePaye', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPeriodePayeToCollectionIfMissing', () => {
      it('should add a PeriodePaye to an empty array', () => {
        const periodePaye: IPeriodePaye = { id: 123 };
        expectedResult = service.addPeriodePayeToCollectionIfMissing([], periodePaye);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(periodePaye);
      });

      it('should not add a PeriodePaye to an array that contains it', () => {
        const periodePaye: IPeriodePaye = { id: 123 };
        const periodePayeCollection: IPeriodePaye[] = [
          {
            ...periodePaye,
          },
          { id: 456 },
        ];
        expectedResult = service.addPeriodePayeToCollectionIfMissing(periodePayeCollection, periodePaye);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PeriodePaye to an array that doesn't contain it", () => {
        const periodePaye: IPeriodePaye = { id: 123 };
        const periodePayeCollection: IPeriodePaye[] = [{ id: 456 }];
        expectedResult = service.addPeriodePayeToCollectionIfMissing(periodePayeCollection, periodePaye);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(periodePaye);
      });

      it('should add only unique PeriodePaye to an array', () => {
        const periodePayeArray: IPeriodePaye[] = [{ id: 123 }, { id: 456 }, { id: 5753 }];
        const periodePayeCollection: IPeriodePaye[] = [{ id: 123 }];
        expectedResult = service.addPeriodePayeToCollectionIfMissing(periodePayeCollection, ...periodePayeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const periodePaye: IPeriodePaye = { id: 123 };
        const periodePaye2: IPeriodePaye = { id: 456 };
        expectedResult = service.addPeriodePayeToCollectionIfMissing([], periodePaye, periodePaye2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(periodePaye);
        expect(expectedResult).toContain(periodePaye2);
      });

      it('should accept null and undefined values', () => {
        const periodePaye: IPeriodePaye = { id: 123 };
        expectedResult = service.addPeriodePayeToCollectionIfMissing([], null, periodePaye, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(periodePaye);
      });

      it('should return initial array if no PeriodePaye is added', () => {
        const periodePayeCollection: IPeriodePaye[] = [{ id: 123 }];
        expectedResult = service.addPeriodePayeToCollectionIfMissing(periodePayeCollection, undefined, null);
        expect(expectedResult).toEqual(periodePayeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
