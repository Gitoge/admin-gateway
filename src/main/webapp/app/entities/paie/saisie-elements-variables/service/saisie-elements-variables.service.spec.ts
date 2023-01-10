import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISaisieElementsVariables, SaisieElementsVariables } from '../saisie-elements-variables.model';

import { SaisieElementsVariablesService } from './saisie-elements-variables.service';

describe('SaisieElementsVariables Service', () => {
  let service: SaisieElementsVariablesService;
  let httpMock: HttpTestingController;
  let elemDefault: ISaisieElementsVariables;
  let expectedResult: ISaisieElementsVariables | ISaisieElementsVariables[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SaisieElementsVariablesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      codePoste: 'AAAAAAA',
      matricule: 'AAAAAAA',
      reference: 'AAAAAAA',
      montant: 0,
      taux: 0,
      dateDebut: currentDate,
      dateEcheance: currentDate,
      periode: 'AAAAAAA',
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
          dateDebut: currentDate.format(DATE_FORMAT),
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

    it('should create a SaisieElementsVariables', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateEcheance: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new SaisieElementsVariables()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SaisieElementsVariables', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          reference: 'BBBBBB',
          montant: 1,
          taux: 1,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          periode: 'BBBBBB',
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
          dateDebut: currentDate,
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

    it('should partial update a SaisieElementsVariables', () => {
      const patchObject = Object.assign(
        {
          codePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          montant: 1,
          taux: 1,
          dateEcheance: currentDate.format(DATE_FORMAT),
          periode: 'BBBBBB',
          userUpdateId: 1,
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        new SaisieElementsVariables()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateDebut: currentDate,
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

    it('should return a list of SaisieElementsVariables', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          matricule: 'BBBBBB',
          reference: 'BBBBBB',
          montant: 1,
          taux: 1,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          periode: 'BBBBBB',
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
          dateDebut: currentDate,
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

    it('should delete a SaisieElementsVariables', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSaisieElementsVariablesToCollectionIfMissing', () => {
      it('should add a SaisieElementsVariables to an empty array', () => {
        const saisieElementsVariables: ISaisieElementsVariables = { id: 123 };
        expectedResult = service.addSaisieElementsVariablesToCollectionIfMissing([], saisieElementsVariables);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(saisieElementsVariables);
      });

      it('should not add a SaisieElementsVariables to an array that contains it', () => {
        const saisieElementsVariables: ISaisieElementsVariables = { id: 123 };
        const saisieElementsVariablesCollection: ISaisieElementsVariables[] = [
          {
            ...saisieElementsVariables,
          },
          { id: 456 },
        ];
        expectedResult = service.addSaisieElementsVariablesToCollectionIfMissing(
          saisieElementsVariablesCollection,
          saisieElementsVariables
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SaisieElementsVariables to an array that doesn't contain it", () => {
        const saisieElementsVariables: ISaisieElementsVariables = { id: 123 };
        const saisieElementsVariablesCollection: ISaisieElementsVariables[] = [{ id: 456 }];
        expectedResult = service.addSaisieElementsVariablesToCollectionIfMissing(
          saisieElementsVariablesCollection,
          saisieElementsVariables
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(saisieElementsVariables);
      });

      it('should add only unique SaisieElementsVariables to an array', () => {
        const saisieElementsVariablesArray: ISaisieElementsVariables[] = [{ id: 123 }, { id: 456 }, { id: 82260 }];
        const saisieElementsVariablesCollection: ISaisieElementsVariables[] = [{ id: 123 }];
        expectedResult = service.addSaisieElementsVariablesToCollectionIfMissing(
          saisieElementsVariablesCollection,
          ...saisieElementsVariablesArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const saisieElementsVariables: ISaisieElementsVariables = { id: 123 };
        const saisieElementsVariables2: ISaisieElementsVariables = { id: 456 };
        expectedResult = service.addSaisieElementsVariablesToCollectionIfMissing([], saisieElementsVariables, saisieElementsVariables2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(saisieElementsVariables);
        expect(expectedResult).toContain(saisieElementsVariables2);
      });

      it('should accept null and undefined values', () => {
        const saisieElementsVariables: ISaisieElementsVariables = { id: 123 };
        expectedResult = service.addSaisieElementsVariablesToCollectionIfMissing([], null, saisieElementsVariables, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(saisieElementsVariables);
      });

      it('should return initial array if no SaisieElementsVariables is added', () => {
        const saisieElementsVariablesCollection: ISaisieElementsVariables[] = [{ id: 123 }];
        expectedResult = service.addSaisieElementsVariablesToCollectionIfMissing(saisieElementsVariablesCollection, undefined, null);
        expect(expectedResult).toEqual(saisieElementsVariablesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
