import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeLocalite, TypeLocalite } from '../type-localite.model';

import { TypeLocaliteService } from './type-localite.service';

describe('TypeLocalite Service', () => {
  let service: TypeLocaliteService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypeLocalite;
  let expectedResult: ITypeLocalite | ITypeLocalite[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeLocaliteService);
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

    it('should create a TypeLocalite', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TypeLocalite()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeLocalite', () => {
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

    it('should partial update a TypeLocalite', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
        },
        new TypeLocalite()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeLocalite', () => {
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

    it('should delete a TypeLocalite', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypeLocaliteToCollectionIfMissing', () => {
      it('should add a TypeLocalite to an empty array', () => {
        const typeLocalite: ITypeLocalite = { id: 123 };
        expectedResult = service.addTypeLocaliteToCollectionIfMissing([], typeLocalite);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeLocalite);
      });

      it('should not add a TypeLocalite to an array that contains it', () => {
        const typeLocalite: ITypeLocalite = { id: 123 };
        const typeLocaliteCollection: ITypeLocalite[] = [
          {
            ...typeLocalite,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypeLocaliteToCollectionIfMissing(typeLocaliteCollection, typeLocalite);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeLocalite to an array that doesn't contain it", () => {
        const typeLocalite: ITypeLocalite = { id: 123 };
        const typeLocaliteCollection: ITypeLocalite[] = [{ id: 456 }];
        expectedResult = service.addTypeLocaliteToCollectionIfMissing(typeLocaliteCollection, typeLocalite);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeLocalite);
      });

      it('should add only unique TypeLocalite to an array', () => {
        const typeLocaliteArray: ITypeLocalite[] = [{ id: 123 }, { id: 456 }, { id: 42261 }];
        const typeLocaliteCollection: ITypeLocalite[] = [{ id: 123 }];
        expectedResult = service.addTypeLocaliteToCollectionIfMissing(typeLocaliteCollection, ...typeLocaliteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeLocalite: ITypeLocalite = { id: 123 };
        const typeLocalite2: ITypeLocalite = { id: 456 };
        expectedResult = service.addTypeLocaliteToCollectionIfMissing([], typeLocalite, typeLocalite2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeLocalite);
        expect(expectedResult).toContain(typeLocalite2);
      });

      it('should accept null and undefined values', () => {
        const typeLocalite: ITypeLocalite = { id: 123 };
        expectedResult = service.addTypeLocaliteToCollectionIfMissing([], null, typeLocalite, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeLocalite);
      });

      it('should return initial array if no TypeLocalite is added', () => {
        const typeLocaliteCollection: ITypeLocalite[] = [{ id: 123 }];
        expectedResult = service.addTypeLocaliteToCollectionIfMissing(typeLocaliteCollection, undefined, null);
        expect(expectedResult).toEqual(typeLocaliteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
