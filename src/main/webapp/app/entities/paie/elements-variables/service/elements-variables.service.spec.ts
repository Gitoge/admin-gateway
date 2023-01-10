import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IElementsVariables, ElementsVariables } from '../elements-variables.model';

import { ElementsVariablesService } from './elements-variables.service';

describe('ElementsVariables Service', () => {
  let service: ElementsVariablesService;
  let httpMock: HttpTestingController;
  let elemDefault: IElementsVariables;
  let expectedResult: IElementsVariables | IElementsVariables[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ElementsVariablesService);
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

    it('should create a ElementsVariables', () => {
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

      service.create(new ElementsVariables()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ElementsVariables', () => {
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

    it('should partial update a ElementsVariables', () => {
      const patchObject = Object.assign(
        {
          codePoste: 'BBBBBB',
          montant: 1,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          periode: 'BBBBBB',
          statut: true,
          agentId: 1,
          etablissementId: 1,
        },
        new ElementsVariables()
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

    it('should return a list of ElementsVariables', () => {
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

    it('should delete a ElementsVariables', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addElementsVariablesToCollectionIfMissing', () => {
      it('should add a ElementsVariables to an empty array', () => {
        const elementsVariables: IElementsVariables = { id: 123 };
        expectedResult = service.addElementsVariablesToCollectionIfMissing([], elementsVariables);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(elementsVariables);
      });

      it('should not add a ElementsVariables to an array that contains it', () => {
        const elementsVariables: IElementsVariables = { id: 123 };
        const elementsVariablesCollection: IElementsVariables[] = [
          {
            ...elementsVariables,
          },
          { id: 456 },
        ];
        expectedResult = service.addElementsVariablesToCollectionIfMissing(elementsVariablesCollection, elementsVariables);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ElementsVariables to an array that doesn't contain it", () => {
        const elementsVariables: IElementsVariables = { id: 123 };
        const elementsVariablesCollection: IElementsVariables[] = [{ id: 456 }];
        expectedResult = service.addElementsVariablesToCollectionIfMissing(elementsVariablesCollection, elementsVariables);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(elementsVariables);
      });

      it('should add only unique ElementsVariables to an array', () => {
        const elementsVariablesArray: IElementsVariables[] = [{ id: 123 }, { id: 456 }, { id: 11980 }];
        const elementsVariablesCollection: IElementsVariables[] = [{ id: 123 }];
        expectedResult = service.addElementsVariablesToCollectionIfMissing(elementsVariablesCollection, ...elementsVariablesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const elementsVariables: IElementsVariables = { id: 123 };
        const elementsVariables2: IElementsVariables = { id: 456 };
        expectedResult = service.addElementsVariablesToCollectionIfMissing([], elementsVariables, elementsVariables2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(elementsVariables);
        expect(expectedResult).toContain(elementsVariables2);
      });

      it('should accept null and undefined values', () => {
        const elementsVariables: IElementsVariables = { id: 123 };
        expectedResult = service.addElementsVariablesToCollectionIfMissing([], null, elementsVariables, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(elementsVariables);
      });

      it('should return initial array if no ElementsVariables is added', () => {
        const elementsVariablesCollection: IElementsVariables[] = [{ id: 123 }];
        expectedResult = service.addElementsVariablesToCollectionIfMissing(elementsVariablesCollection, undefined, null);
        expect(expectedResult).toEqual(elementsVariablesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
