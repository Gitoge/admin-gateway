import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITypePosition, TypePosition } from '../type-position.model';

import { TypePositionService } from './type-position.service';

describe('TypePosition Service', () => {
  let service: TypePositionService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypePosition;
  let expectedResult: ITypePosition | ITypePosition[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypePositionService);
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

    it('should create a TypePosition', () => {
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

      service.create(new TypePosition()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypePosition', () => {
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

    it('should partial update a TypePosition', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          userIdInsert: 1,
          userdateInsert: currentDate.format(DATE_FORMAT),
        },
        new TypePosition()
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

    it('should return a list of TypePosition', () => {
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

    it('should delete a TypePosition', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypePositionToCollectionIfMissing', () => {
      it('should add a TypePosition to an empty array', () => {
        const typePosition: ITypePosition = { id: 123 };
        expectedResult = service.addTypePositionToCollectionIfMissing([], typePosition);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typePosition);
      });

      it('should not add a TypePosition to an array that contains it', () => {
        const typePosition: ITypePosition = { id: 123 };
        const typePositionCollection: ITypePosition[] = [
          {
            ...typePosition,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypePositionToCollectionIfMissing(typePositionCollection, typePosition);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypePosition to an array that doesn't contain it", () => {
        const typePosition: ITypePosition = { id: 123 };
        const typePositionCollection: ITypePosition[] = [{ id: 456 }];
        expectedResult = service.addTypePositionToCollectionIfMissing(typePositionCollection, typePosition);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typePosition);
      });

      it('should add only unique TypePosition to an array', () => {
        const typePositionArray: ITypePosition[] = [{ id: 123 }, { id: 456 }, { id: 97255 }];
        const typePositionCollection: ITypePosition[] = [{ id: 123 }];
        expectedResult = service.addTypePositionToCollectionIfMissing(typePositionCollection, ...typePositionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typePosition: ITypePosition = { id: 123 };
        const typePosition2: ITypePosition = { id: 456 };
        expectedResult = service.addTypePositionToCollectionIfMissing([], typePosition, typePosition2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typePosition);
        expect(expectedResult).toContain(typePosition2);
      });

      it('should accept null and undefined values', () => {
        const typePosition: ITypePosition = { id: 123 };
        expectedResult = service.addTypePositionToCollectionIfMissing([], null, typePosition, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typePosition);
      });

      it('should return initial array if no TypePosition is added', () => {
        const typePositionCollection: ITypePosition[] = [{ id: 123 }];
        expectedResult = service.addTypePositionToCollectionIfMissing(typePositionCollection, undefined, null);
        expect(expectedResult).toEqual(typePositionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
