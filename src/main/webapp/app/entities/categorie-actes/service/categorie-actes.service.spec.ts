import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ICategorieActes, CategorieActes } from '../categorie-actes.model';

import { CategorieActesService } from './categorie-actes.service';

describe('CategorieActes Service', () => {
  let service: CategorieActesService;
  let httpMock: HttpTestingController;
  let elemDefault: ICategorieActes;
  let expectedResult: ICategorieActes | ICategorieActes[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CategorieActesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
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

    it('should create a CategorieActes', () => {
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

      service.create(new CategorieActes()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CategorieActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should partial update a CategorieActes', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          userIdInsert: 1,
        },
        new CategorieActes()
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

    it('should return a list of CategorieActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should delete a CategorieActes', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCategorieActesToCollectionIfMissing', () => {
      it('should add a CategorieActes to an empty array', () => {
        const categorieActes: ICategorieActes = { id: 123 };
        expectedResult = service.addCategorieActesToCollectionIfMissing([], categorieActes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categorieActes);
      });

      it('should not add a CategorieActes to an array that contains it', () => {
        const categorieActes: ICategorieActes = { id: 123 };
        const categorieActesCollection: ICategorieActes[] = [
          {
            ...categorieActes,
          },
          { id: 456 },
        ];
        expectedResult = service.addCategorieActesToCollectionIfMissing(categorieActesCollection, categorieActes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CategorieActes to an array that doesn't contain it", () => {
        const categorieActes: ICategorieActes = { id: 123 };
        const categorieActesCollection: ICategorieActes[] = [{ id: 456 }];
        expectedResult = service.addCategorieActesToCollectionIfMissing(categorieActesCollection, categorieActes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categorieActes);
      });

      it('should add only unique CategorieActes to an array', () => {
        const categorieActesArray: ICategorieActes[] = [{ id: 123 }, { id: 456 }, { id: 49020 }];
        const categorieActesCollection: ICategorieActes[] = [{ id: 123 }];
        expectedResult = service.addCategorieActesToCollectionIfMissing(categorieActesCollection, ...categorieActesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const categorieActes: ICategorieActes = { id: 123 };
        const categorieActes2: ICategorieActes = { id: 456 };
        expectedResult = service.addCategorieActesToCollectionIfMissing([], categorieActes, categorieActes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(categorieActes);
        expect(expectedResult).toContain(categorieActes2);
      });

      it('should accept null and undefined values', () => {
        const categorieActes: ICategorieActes = { id: 123 };
        expectedResult = service.addCategorieActesToCollectionIfMissing([], null, categorieActes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(categorieActes);
      });

      it('should return initial array if no CategorieActes is added', () => {
        const categorieActesCollection: ICategorieActes[] = [{ id: 123 }];
        expectedResult = service.addCategorieActesToCollectionIfMissing(categorieActesCollection, undefined, null);
        expect(expectedResult).toEqual(categorieActesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
