import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITypeActes, TypeActes } from '../type-actes.model';

import { TypeActesService } from './type-actes.service';

describe('TypeActes Service', () => {
  let service: TypeActesService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypeActes;
  let expectedResult: ITypeActes | ITypeActes[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeActesService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      userInsertId: 0,
      userdateInsert: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          userdateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a TypeActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          userdateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          userdateInsert: currentDate,
        },
        returnedFromService
      );

      service.create(new TypeActes()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          userInsertId: 1,
          userdateInsert: currentDate.format(DATE_TIME_FORMAT),
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

    it('should partial update a TypeActes', () => {
      const patchObject = Object.assign(
        {
          userInsertId: 1,
          userdateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        new TypeActes()
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

    it('should return a list of TypeActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          userInsertId: 1,
          userdateInsert: currentDate.format(DATE_TIME_FORMAT),
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

    it('should delete a TypeActes', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypeActesToCollectionIfMissing', () => {
      it('should add a TypeActes to an empty array', () => {
        const typeActes: ITypeActes = { id: 123 };
        expectedResult = service.addTypeActesToCollectionIfMissing([], typeActes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeActes);
      });

      it('should not add a TypeActes to an array that contains it', () => {
        const typeActes: ITypeActes = { id: 123 };
        const typeActesCollection: ITypeActes[] = [
          {
            ...typeActes,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypeActesToCollectionIfMissing(typeActesCollection, typeActes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeActes to an array that doesn't contain it", () => {
        const typeActes: ITypeActes = { id: 123 };
        const typeActesCollection: ITypeActes[] = [{ id: 456 }];
        expectedResult = service.addTypeActesToCollectionIfMissing(typeActesCollection, typeActes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeActes);
      });

      it('should add only unique TypeActes to an array', () => {
        const typeActesArray: ITypeActes[] = [{ id: 123 }, { id: 456 }, { id: 41690 }];
        const typeActesCollection: ITypeActes[] = [{ id: 123 }];
        expectedResult = service.addTypeActesToCollectionIfMissing(typeActesCollection, ...typeActesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeActes: ITypeActes = { id: 123 };
        const typeActes2: ITypeActes = { id: 456 };
        expectedResult = service.addTypeActesToCollectionIfMissing([], typeActes, typeActes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeActes);
        expect(expectedResult).toContain(typeActes2);
      });

      it('should accept null and undefined values', () => {
        const typeActes: ITypeActes = { id: 123 };
        expectedResult = service.addTypeActesToCollectionIfMissing([], null, typeActes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeActes);
      });

      it('should return initial array if no TypeActes is added', () => {
        const typeActesCollection: ITypeActes[] = [{ id: 123 }];
        expectedResult = service.addTypeActesToCollectionIfMissing(typeActesCollection, undefined, null);
        expect(expectedResult).toEqual(typeActesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
