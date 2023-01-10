import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT, DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IPostes, Postes } from '../postes.model';

import { PostesService } from './postes.service';

describe('Postes Service', () => {
  let service: PostesService;
  let httpMock: HttpTestingController;
  let elemDefault: IPostes;
  let expectedResult: IPostes | IPostes[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PostesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
      sens: false,
      dateEffet: currentDate,
      dateEcheance: currentDate,
      formule: currentDate,
      dansAssiette: false,
      montant: 0,
      capital: 0,
      cumuleRetenue: 0,
      typePosteId: 0,
      typePosteLibelle: 'AAAAAAA',
      frequenceId: 0,
      frequenceLibelle: 'AAAAAAA',
      categoriePosteId: 0,
      categoriePosteLibelle: 'AAAAAAA',
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
          formule: currentDate.format(DATE_FORMAT),
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

    it('should create a Postes', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          formule: currentDate.format(DATE_FORMAT),
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
          formule: currentDate,
          dateInsert: currentDate,
          dateUpdate: currentDate,
        },
        returnedFromService
      );

      service.create(new Postes()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Postes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          sens: true,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          formule: currentDate.format(DATE_FORMAT),
          dansAssiette: true,
          montant: 1,
          capital: 1,
          cumuleRetenue: 1,
          typePosteId: 1,
          typePosteLibelle: 'BBBBBB',
          frequenceId: 1,
          frequenceLibelle: 'BBBBBB',
          categoriePosteId: 1,
          categoriePosteLibelle: 'BBBBBB',
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
          formule: currentDate,
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

    it('should partial update a Postes', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          description: 'BBBBBB',
          sens: true,
          dateEcheance: currentDate.format(DATE_FORMAT),
          dansAssiette: true,
          typePosteId: 1,
          frequenceId: 1,
          frequenceLibelle: 'BBBBBB',
          categoriePosteId: 1,
          userInsertId: 1,
          dateUpdate: currentDate.format(DATE_TIME_FORMAT),
        },
        new Postes()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateEffet: currentDate,
          dateEcheance: currentDate,
          formule: currentDate,
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

    it('should return a list of Postes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          sens: true,
          dateEffet: currentDate.format(DATE_FORMAT),
          dateEcheance: currentDate.format(DATE_FORMAT),
          formule: currentDate.format(DATE_FORMAT),
          dansAssiette: true,
          montant: 1,
          capital: 1,
          cumuleRetenue: 1,
          typePosteId: 1,
          typePosteLibelle: 'BBBBBB',
          frequenceId: 1,
          frequenceLibelle: 'BBBBBB',
          categoriePosteId: 1,
          categoriePosteLibelle: 'BBBBBB',
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
          formule: currentDate,
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

    it('should delete a Postes', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPostesToCollectionIfMissing', () => {
      it('should add a Postes to an empty array', () => {
        const postes: IPostes = { id: 123 };
        expectedResult = service.addPostesToCollectionIfMissing([], postes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(postes);
      });

      it('should not add a Postes to an array that contains it', () => {
        const postes: IPostes = { id: 123 };
        const postesCollection: IPostes[] = [
          {
            ...postes,
          },
          { id: 456 },
        ];
        expectedResult = service.addPostesToCollectionIfMissing(postesCollection, postes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Postes to an array that doesn't contain it", () => {
        const postes: IPostes = { id: 123 };
        const postesCollection: IPostes[] = [{ id: 456 }];
        expectedResult = service.addPostesToCollectionIfMissing(postesCollection, postes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(postes);
      });

      it('should add only unique Postes to an array', () => {
        const postesArray: IPostes[] = [{ id: 123 }, { id: 456 }, { id: 44926 }];
        const postesCollection: IPostes[] = [{ id: 123 }];
        expectedResult = service.addPostesToCollectionIfMissing(postesCollection, ...postesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const postes: IPostes = { id: 123 };
        const postes2: IPostes = { id: 456 };
        expectedResult = service.addPostesToCollectionIfMissing([], postes, postes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(postes);
        expect(expectedResult).toContain(postes2);
      });

      it('should accept null and undefined values', () => {
        const postes: IPostes = { id: 123 };
        expectedResult = service.addPostesToCollectionIfMissing([], null, postes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(postes);
      });

      it('should return initial array if no Postes is added', () => {
        const postesCollection: IPostes[] = [{ id: 123 }];
        expectedResult = service.addPostesToCollectionIfMissing(postesCollection, undefined, null);
        expect(expectedResult).toEqual(postesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
