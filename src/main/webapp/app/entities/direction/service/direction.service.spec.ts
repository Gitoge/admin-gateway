import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDirection, Direction } from '../direction.model';

import { DirectionService } from './direction.service';

describe('Direction Service', () => {
  let service: DirectionService;
  let httpMock: HttpTestingController;
  let elemDefault: IDirection;
  let expectedResult: IDirection | IDirection[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DirectionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      adresse: 'AAAAAAA',
      numTelephone: 'AAAAAAA',
      fax: 'AAAAAAA',
      email: 'AAAAAAA',
      contact: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Direction', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Direction()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Direction', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          adresse: 'BBBBBB',
          numTelephone: 'BBBBBB',
          fax: 'BBBBBB',
          email: 'BBBBBB',
          contact: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Direction', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          adresse: 'BBBBBB',
          fax: 'BBBBBB',
          email: 'BBBBBB',
        },
        new Direction()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Direction', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          adresse: 'BBBBBB',
          numTelephone: 'BBBBBB',
          fax: 'BBBBBB',
          email: 'BBBBBB',
          contact: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Direction', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDirectionToCollectionIfMissing', () => {
      it('should add a Direction to an empty array', () => {
        const direction: IDirection = { id: 123 };
        expectedResult = service.addDirectionToCollectionIfMissing([], direction);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(direction);
      });

      it('should not add a Direction to an array that contains it', () => {
        const direction: IDirection = { id: 123 };
        const directionCollection: IDirection[] = [
          {
            ...direction,
          },
          { id: 456 },
        ];
        expectedResult = service.addDirectionToCollectionIfMissing(directionCollection, direction);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Direction to an array that doesn't contain it", () => {
        const direction: IDirection = { id: 123 };
        const directionCollection: IDirection[] = [{ id: 456 }];
        expectedResult = service.addDirectionToCollectionIfMissing(directionCollection, direction);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(direction);
      });

      it('should add only unique Direction to an array', () => {
        const directionArray: IDirection[] = [{ id: 123 }, { id: 456 }, { id: 94442 }];
        const directionCollection: IDirection[] = [{ id: 123 }];
        expectedResult = service.addDirectionToCollectionIfMissing(directionCollection, ...directionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const direction: IDirection = { id: 123 };
        const direction2: IDirection = { id: 456 };
        expectedResult = service.addDirectionToCollectionIfMissing([], direction, direction2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(direction);
        expect(expectedResult).toContain(direction2);
      });

      it('should accept null and undefined values', () => {
        const direction: IDirection = { id: 123 };
        expectedResult = service.addDirectionToCollectionIfMissing([], null, direction, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(direction);
      });

      it('should return initial array if no Direction is added', () => {
        const directionCollection: IDirection[] = [{ id: 123 }];
        expectedResult = service.addDirectionToCollectionIfMissing(directionCollection, undefined, null);
        expect(expectedResult).toEqual(directionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
