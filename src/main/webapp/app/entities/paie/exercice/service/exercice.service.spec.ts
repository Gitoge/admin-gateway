import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IExercice, Exercice } from '../exercice.model';

import { ExerciceService } from './exercice.service';

describe('Exercice Service', () => {
  let service: ExerciceService;
  let httpMock: HttpTestingController;
  let elemDefault: IExercice;
  let expectedResult: IExercice | IExercice[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExerciceService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      libelle: 'AAAAAAA',
      dateDebut: currentDate,
      dateFin: currentDate,
      dateOuverture: currentDate,
      dateFermeture: currentDate,
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
          dateOuverture: currentDate.format(DATE_FORMAT),
          dateFermeture: currentDate.format(DATE_FORMAT),
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

    it('should create a Exercice', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
          dateOuverture: currentDate.format(DATE_FORMAT),
          dateFermeture: currentDate.format(DATE_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
          dateOuverture: currentDate,
          dateFermeture: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new Exercice()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Exercice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
          dateOuverture: currentDate.format(DATE_FORMAT),
          dateFermeture: currentDate.format(DATE_FORMAT),
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
          dateOuverture: currentDate,
          dateFermeture: currentDate,
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

    it('should partial update a Exercice', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
          userInsertId: 1,
          userUpdateId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        new Exercice()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateDebut: currentDate,
          dateFin: currentDate,
          dateOuverture: currentDate,
          dateFermeture: currentDate,
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

    it('should return a list of Exercice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          dateDebut: currentDate.format(DATE_FORMAT),
          dateFin: currentDate.format(DATE_FORMAT),
          dateOuverture: currentDate.format(DATE_FORMAT),
          dateFermeture: currentDate.format(DATE_FORMAT),
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
          dateOuverture: currentDate,
          dateFermeture: currentDate,
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

    it('should delete a Exercice', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addExerciceToCollectionIfMissing', () => {
      it('should add a Exercice to an empty array', () => {
        const exercice: IExercice = { id: 123 };
        expectedResult = service.addExerciceToCollectionIfMissing([], exercice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exercice);
      });

      it('should not add a Exercice to an array that contains it', () => {
        const exercice: IExercice = { id: 123 };
        const exerciceCollection: IExercice[] = [
          {
            ...exercice,
          },
          { id: 456 },
        ];
        expectedResult = service.addExerciceToCollectionIfMissing(exerciceCollection, exercice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Exercice to an array that doesn't contain it", () => {
        const exercice: IExercice = { id: 123 };
        const exerciceCollection: IExercice[] = [{ id: 456 }];
        expectedResult = service.addExerciceToCollectionIfMissing(exerciceCollection, exercice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exercice);
      });

      it('should add only unique Exercice to an array', () => {
        const exerciceArray: IExercice[] = [{ id: 123 }, { id: 456 }, { id: 25500 }];
        const exerciceCollection: IExercice[] = [{ id: 123 }];
        expectedResult = service.addExerciceToCollectionIfMissing(exerciceCollection, ...exerciceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const exercice: IExercice = { id: 123 };
        const exercice2: IExercice = { id: 456 };
        expectedResult = service.addExerciceToCollectionIfMissing([], exercice, exercice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exercice);
        expect(expectedResult).toContain(exercice2);
      });

      it('should accept null and undefined values', () => {
        const exercice: IExercice = { id: 123 };
        expectedResult = service.addExerciceToCollectionIfMissing([], null, exercice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exercice);
      });

      it('should return initial array if no Exercice is added', () => {
        const exerciceCollection: IExercice[] = [{ id: 123 }];
        expectedResult = service.addExerciceToCollectionIfMissing(exerciceCollection, undefined, null);
        expect(expectedResult).toEqual(exerciceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
