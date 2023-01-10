import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeGrille, TypeGrille } from '../type-grille.model';

import { TypeGrilleService } from './type-grille.service';

describe('TypeGrille Service', () => {
  let service: TypeGrilleService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypeGrille;
  let expectedResult: ITypeGrille | ITypeGrille[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeGrilleService);
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

    it('should create a TypeGrille', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TypeGrille()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeGrille', () => {
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

    it('should partial update a TypeGrille', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
        },
        new TypeGrille()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeGrille', () => {
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

    it('should delete a TypeGrille', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypeGrilleToCollectionIfMissing', () => {
      it('should add a TypeGrille to an empty array', () => {
        const typeGrille: ITypeGrille = { id: 123 };
        expectedResult = service.addTypeGrilleToCollectionIfMissing([], typeGrille);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeGrille);
      });

      it('should not add a TypeGrille to an array that contains it', () => {
        const typeGrille: ITypeGrille = { id: 123 };
        const typeGrilleCollection: ITypeGrille[] = [
          {
            ...typeGrille,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypeGrilleToCollectionIfMissing(typeGrilleCollection, typeGrille);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeGrille to an array that doesn't contain it", () => {
        const typeGrille: ITypeGrille = { id: 123 };
        const typeGrilleCollection: ITypeGrille[] = [{ id: 456 }];
        expectedResult = service.addTypeGrilleToCollectionIfMissing(typeGrilleCollection, typeGrille);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeGrille);
      });

      it('should add only unique TypeGrille to an array', () => {
        const typeGrilleArray: ITypeGrille[] = [{ id: 123 }, { id: 456 }, { id: 23483 }];
        const typeGrilleCollection: ITypeGrille[] = [{ id: 123 }];
        expectedResult = service.addTypeGrilleToCollectionIfMissing(typeGrilleCollection, ...typeGrilleArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeGrille: ITypeGrille = { id: 123 };
        const typeGrille2: ITypeGrille = { id: 456 };
        expectedResult = service.addTypeGrilleToCollectionIfMissing([], typeGrille, typeGrille2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeGrille);
        expect(expectedResult).toContain(typeGrille2);
      });

      it('should accept null and undefined values', () => {
        const typeGrille: ITypeGrille = { id: 123 };
        expectedResult = service.addTypeGrilleToCollectionIfMissing([], null, typeGrille, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeGrille);
      });

      it('should return initial array if no TypeGrille is added', () => {
        const typeGrilleCollection: ITypeGrille[] = [{ id: 123 }];
        expectedResult = service.addTypeGrilleToCollectionIfMissing(typeGrilleCollection, undefined, null);
        expect(expectedResult).toEqual(typeGrilleCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
