import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeReglement, TypeReglement } from '../type-reglement.model';

import { TypeReglementService } from './type-reglement.service';

describe('TypeReglement Service', () => {
  let service: TypeReglementService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypeReglement;
  let expectedResult: ITypeReglement | ITypeReglement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeReglementService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
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

    it('should create a TypeReglement', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TypeReglement()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeReglement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TypeReglement', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
        },
        new TypeReglement()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeReglement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should delete a TypeReglement', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypeReglementToCollectionIfMissing', () => {
      it('should add a TypeReglement to an empty array', () => {
        const typeReglement: ITypeReglement = { id: 123 };
        expectedResult = service.addTypeReglementToCollectionIfMissing([], typeReglement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeReglement);
      });

      it('should not add a TypeReglement to an array that contains it', () => {
        const typeReglement: ITypeReglement = { id: 123 };
        const typeReglementCollection: ITypeReglement[] = [
          {
            ...typeReglement,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypeReglementToCollectionIfMissing(typeReglementCollection, typeReglement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeReglement to an array that doesn't contain it", () => {
        const typeReglement: ITypeReglement = { id: 123 };
        const typeReglementCollection: ITypeReglement[] = [{ id: 456 }];
        expectedResult = service.addTypeReglementToCollectionIfMissing(typeReglementCollection, typeReglement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeReglement);
      });

      it('should add only unique TypeReglement to an array', () => {
        const typeReglementArray: ITypeReglement[] = [{ id: 123 }, { id: 456 }, { id: 22308 }];
        const typeReglementCollection: ITypeReglement[] = [{ id: 123 }];
        expectedResult = service.addTypeReglementToCollectionIfMissing(typeReglementCollection, ...typeReglementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeReglement: ITypeReglement = { id: 123 };
        const typeReglement2: ITypeReglement = { id: 456 };
        expectedResult = service.addTypeReglementToCollectionIfMissing([], typeReglement, typeReglement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeReglement);
        expect(expectedResult).toContain(typeReglement2);
      });

      it('should accept null and undefined values', () => {
        const typeReglement: ITypeReglement = { id: 123 };
        expectedResult = service.addTypeReglementToCollectionIfMissing([], null, typeReglement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeReglement);
      });

      it('should return initial array if no TypeReglement is added', () => {
        const typeReglementCollection: ITypeReglement[] = [{ id: 123 }];
        expectedResult = service.addTypeReglementToCollectionIfMissing(typeReglementCollection, undefined, null);
        expect(expectedResult).toEqual(typeReglementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
