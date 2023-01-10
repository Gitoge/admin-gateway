import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISituationAdministrative, SituationAdministrative } from '../situation-administrative.model';

import { SituationAdministrativeService } from './situation-administrative.service';

describe('SituationAdministrative Service', () => {
  let service: SituationAdministrativeService;
  let httpMock: HttpTestingController;
  let elemDefault: ISituationAdministrative;
  let expectedResult: ISituationAdministrative | ISituationAdministrative[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SituationAdministrativeService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      dateRecrutement: currentDate,
      numeroRecrutement: 'AAAAAAA',
      datePriseRang: currentDate,
      numeroOrdreService: 'AAAAAAA',
      dateOrdreService: currentDate,
      loge: false,
      logementFonction: false,
      datedebut: currentDate,
      datefin: currentDate,
      numeroCompte: 'AAAAAAA',
      status: 'AAAAAAA',
      corpsId: 0,
      hierarchieId: 0,
      cadreId: 0,
      gradeId: 0,
      echelonId: 0,
      classeId: 0,
      reglementId: 0,
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
          dateRecrutement: currentDate.format(DATE_FORMAT),
          datePriseRang: currentDate.format(DATE_FORMAT),
          dateOrdreService: currentDate.format(DATE_FORMAT),
          datedebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
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

    it('should create a SituationAdministrative', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateRecrutement: currentDate.format(DATE_FORMAT),
          datePriseRang: currentDate.format(DATE_FORMAT),
          dateOrdreService: currentDate.format(DATE_FORMAT),
          datedebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateRecrutement: currentDate,
          datePriseRang: currentDate,
          dateOrdreService: currentDate,
          datedebut: currentDate,
          datefin: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new SituationAdministrative()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SituationAdministrative', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateRecrutement: currentDate.format(DATE_FORMAT),
          numeroRecrutement: 'BBBBBB',
          datePriseRang: currentDate.format(DATE_FORMAT),
          numeroOrdreService: 'BBBBBB',
          dateOrdreService: currentDate.format(DATE_FORMAT),
          loge: true,
          logementFonction: true,
          datedebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
          numeroCompte: 'BBBBBB',
          status: 'BBBBBB',
          corpsId: 1,
          hierarchieId: 1,
          cadreId: 1,
          gradeId: 1,
          echelonId: 1,
          classeId: 1,
          reglementId: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateRecrutement: currentDate,
          datePriseRang: currentDate,
          dateOrdreService: currentDate,
          datedebut: currentDate,
          datefin: currentDate,
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

    it('should partial update a SituationAdministrative', () => {
      const patchObject = Object.assign(
        {
          numeroRecrutement: 'BBBBBB',
          datePriseRang: currentDate.format(DATE_FORMAT),
          datedebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
          numeroCompte: 'BBBBBB',
          status: 'BBBBBB',
          gradeId: 1,
          classeId: 1,
          reglementId: 1,
          userInsertId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        new SituationAdministrative()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateRecrutement: currentDate,
          datePriseRang: currentDate,
          dateOrdreService: currentDate,
          datedebut: currentDate,
          datefin: currentDate,
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

    it('should return a list of SituationAdministrative', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          dateRecrutement: currentDate.format(DATE_FORMAT),
          numeroRecrutement: 'BBBBBB',
          datePriseRang: currentDate.format(DATE_FORMAT),
          numeroOrdreService: 'BBBBBB',
          dateOrdreService: currentDate.format(DATE_FORMAT),
          loge: true,
          logementFonction: true,
          datedebut: currentDate.format(DATE_FORMAT),
          datefin: currentDate.format(DATE_FORMAT),
          numeroCompte: 'BBBBBB',
          status: 'BBBBBB',
          corpsId: 1,
          hierarchieId: 1,
          cadreId: 1,
          gradeId: 1,
          echelonId: 1,
          classeId: 1,
          reglementId: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateRecrutement: currentDate,
          datePriseRang: currentDate,
          dateOrdreService: currentDate,
          datedebut: currentDate,
          datefin: currentDate,
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

    it('should delete a SituationAdministrative', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSituationAdministrativeToCollectionIfMissing', () => {
      it('should add a SituationAdministrative to an empty array', () => {
        const situationAdministrative: ISituationAdministrative = { id: 123 };
        expectedResult = service.addSituationAdministrativeToCollectionIfMissing([], situationAdministrative);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(situationAdministrative);
      });

      it('should not add a SituationAdministrative to an array that contains it', () => {
        const situationAdministrative: ISituationAdministrative = { id: 123 };
        const situationAdministrativeCollection: ISituationAdministrative[] = [
          {
            ...situationAdministrative,
          },
          { id: 456 },
        ];
        expectedResult = service.addSituationAdministrativeToCollectionIfMissing(
          situationAdministrativeCollection,
          situationAdministrative
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SituationAdministrative to an array that doesn't contain it", () => {
        const situationAdministrative: ISituationAdministrative = { id: 123 };
        const situationAdministrativeCollection: ISituationAdministrative[] = [{ id: 456 }];
        expectedResult = service.addSituationAdministrativeToCollectionIfMissing(
          situationAdministrativeCollection,
          situationAdministrative
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(situationAdministrative);
      });

      it('should add only unique SituationAdministrative to an array', () => {
        const situationAdministrativeArray: ISituationAdministrative[] = [{ id: 123 }, { id: 456 }, { id: 15287 }];
        const situationAdministrativeCollection: ISituationAdministrative[] = [{ id: 123 }];
        expectedResult = service.addSituationAdministrativeToCollectionIfMissing(
          situationAdministrativeCollection,
          ...situationAdministrativeArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const situationAdministrative: ISituationAdministrative = { id: 123 };
        const situationAdministrative2: ISituationAdministrative = { id: 456 };
        expectedResult = service.addSituationAdministrativeToCollectionIfMissing([], situationAdministrative, situationAdministrative2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(situationAdministrative);
        expect(expectedResult).toContain(situationAdministrative2);
      });

      it('should accept null and undefined values', () => {
        const situationAdministrative: ISituationAdministrative = { id: 123 };
        expectedResult = service.addSituationAdministrativeToCollectionIfMissing([], null, situationAdministrative, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(situationAdministrative);
      });

      it('should return initial array if no SituationAdministrative is added', () => {
        const situationAdministrativeCollection: ISituationAdministrative[] = [{ id: 123 }];
        expectedResult = service.addSituationAdministrativeToCollectionIfMissing(situationAdministrativeCollection, undefined, null);
        expect(expectedResult).toEqual(situationAdministrativeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
