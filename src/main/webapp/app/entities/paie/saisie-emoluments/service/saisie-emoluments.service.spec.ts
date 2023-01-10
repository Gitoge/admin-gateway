import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISaisieEmoluments, SaisieEmoluments } from '../saisie-emoluments.model';

import { SaisieEmolumentsService } from './saisie-emoluments.service';

describe('SaisieEmoluments Service', () => {
  let service: SaisieEmolumentsService;
  let httpMock: HttpTestingController;
  let elemDefault: ISaisieEmoluments;
  let expectedResult: ISaisieEmoluments | ISaisieEmoluments[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SaisieEmolumentsService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      codePoste: 'AAAAAAA',
      matricule: 'AAAAAAA',
      reference: 'AAAAAAA',
      montant: 0,
      taux: 0,
      dateEffet: currentDate,
      dateEcheance: currentDate,
      statut: false,
      agentId: 0,
      etablissementId: 0,
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
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
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

    it('should create a SaisieEmoluments', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new SaisieEmoluments()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SaisieEmoluments', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          reference: 'BBBBBB',
          montant: 1,
          taux: 1,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          statut: true,
          agentId: 1,
          etablissementId: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
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

    it('should partial update a SaisieEmoluments', () => {
      const patchObject = Object.assign(
        {
          codePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          montant: 1,
          taux: 1,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          agentId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        new SaisieEmoluments()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
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

    it('should return a list of SaisieEmoluments', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          reference: 'BBBBBB',
          montant: 1,
          taux: 1,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          statut: true,
          agentId: 1,
          etablissementId: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
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

    it('should delete a SaisieEmoluments', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSaisieEmolumentsToCollectionIfMissing', () => {
      it('should add a SaisieEmoluments to an empty array', () => {
        const saisieEmoluments: ISaisieEmoluments = { id: 123 };
        expectedResult = service.addSaisieEmolumentsToCollectionIfMissing([], saisieEmoluments);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(saisieEmoluments);
      });

      it('should not add a SaisieEmoluments to an array that contains it', () => {
        const saisieEmoluments: ISaisieEmoluments = { id: 123 };
        const saisieEmolumentsCollection: ISaisieEmoluments[] = [
          {
            ...saisieEmoluments,
          },
          { id: 456 },
        ];
        expectedResult = service.addSaisieEmolumentsToCollectionIfMissing(saisieEmolumentsCollection, saisieEmoluments);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SaisieEmoluments to an array that doesn't contain it", () => {
        const saisieEmoluments: ISaisieEmoluments = { id: 123 };
        const saisieEmolumentsCollection: ISaisieEmoluments[] = [{ id: 456 }];
        expectedResult = service.addSaisieEmolumentsToCollectionIfMissing(saisieEmolumentsCollection, saisieEmoluments);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(saisieEmoluments);
      });

      it('should add only unique SaisieEmoluments to an array', () => {
        const saisieEmolumentsArray: ISaisieEmoluments[] = [{ id: 123 }, { id: 456 }, { id: 36307 }];
        const saisieEmolumentsCollection: ISaisieEmoluments[] = [{ id: 123 }];
        expectedResult = service.addSaisieEmolumentsToCollectionIfMissing(saisieEmolumentsCollection, ...saisieEmolumentsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const saisieEmoluments: ISaisieEmoluments = { id: 123 };
        const saisieEmoluments2: ISaisieEmoluments = { id: 456 };
        expectedResult = service.addSaisieEmolumentsToCollectionIfMissing([], saisieEmoluments, saisieEmoluments2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(saisieEmoluments);
        expect(expectedResult).toContain(saisieEmoluments2);
      });

      it('should accept null and undefined values', () => {
        const saisieEmoluments: ISaisieEmoluments = { id: 123 };
        expectedResult = service.addSaisieEmolumentsToCollectionIfMissing([], null, saisieEmoluments, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(saisieEmoluments);
      });

      it('should return initial array if no SaisieEmoluments is added', () => {
        const saisieEmolumentsCollection: ISaisieEmoluments[] = [{ id: 123 }];
        expectedResult = service.addSaisieEmolumentsToCollectionIfMissing(saisieEmolumentsCollection, undefined, null);
        expect(expectedResult).toEqual(saisieEmolumentsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
