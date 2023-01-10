import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeEtablissement, TypeEtablissement } from '../type-etablissement.model';

import { TypeEtablissementService } from './type-etablissement.service';

describe('TypeEtablissement Service', () => {
  let service: TypeEtablissementService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypeEtablissement;
  let expectedResult: ITypeEtablissement | ITypeEtablissement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeEtablissementService);
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

    it('should create a TypeEtablissement', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TypeEtablissement()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeEtablissement', () => {
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

    it('should partial update a TypeEtablissement', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          description: 'BBBBBB',
        },
        new TypeEtablissement()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeEtablissement', () => {
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

    it('should delete a TypeEtablissement', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypeEtablissementToCollectionIfMissing', () => {
      it('should add a TypeEtablissement to an empty array', () => {
        const typeEtablissement: ITypeEtablissement = { id: 123 };
        expectedResult = service.addTypeEtablissementToCollectionIfMissing([], typeEtablissement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeEtablissement);
      });

      it('should not add a TypeEtablissement to an array that contains it', () => {
        const typeEtablissement: ITypeEtablissement = { id: 123 };
        const typeEtablissementCollection: ITypeEtablissement[] = [
          {
            ...typeEtablissement,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypeEtablissementToCollectionIfMissing(typeEtablissementCollection, typeEtablissement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeEtablissement to an array that doesn't contain it", () => {
        const typeEtablissement: ITypeEtablissement = { id: 123 };
        const typeEtablissementCollection: ITypeEtablissement[] = [{ id: 456 }];
        expectedResult = service.addTypeEtablissementToCollectionIfMissing(typeEtablissementCollection, typeEtablissement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeEtablissement);
      });

      it('should add only unique TypeEtablissement to an array', () => {
        const typeEtablissementArray: ITypeEtablissement[] = [{ id: 123 }, { id: 456 }, { id: 62622 }];
        const typeEtablissementCollection: ITypeEtablissement[] = [{ id: 123 }];
        expectedResult = service.addTypeEtablissementToCollectionIfMissing(typeEtablissementCollection, ...typeEtablissementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeEtablissement: ITypeEtablissement = { id: 123 };
        const typeEtablissement2: ITypeEtablissement = { id: 456 };
        expectedResult = service.addTypeEtablissementToCollectionIfMissing([], typeEtablissement, typeEtablissement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeEtablissement);
        expect(expectedResult).toContain(typeEtablissement2);
      });

      it('should accept null and undefined values', () => {
        const typeEtablissement: ITypeEtablissement = { id: 123 };
        expectedResult = service.addTypeEtablissementToCollectionIfMissing([], null, typeEtablissement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeEtablissement);
      });

      it('should return initial array if no TypeEtablissement is added', () => {
        const typeEtablissementCollection: ITypeEtablissement[] = [{ id: 123 }];
        expectedResult = service.addTypeEtablissementToCollectionIfMissing(typeEtablissementCollection, undefined, null);
        expect(expectedResult).toEqual(typeEtablissementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
