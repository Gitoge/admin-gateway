import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITypeDestinataires, TypeDestinataires } from '../type-destinataires.model';

import { TypeDestinatairesService } from './type-destinataires.service';

describe('TypeDestinataires Service', () => {
  let service: TypeDestinatairesService;
  let httpMock: HttpTestingController;
  let elemDefault: ITypeDestinataires;
  let expectedResult: ITypeDestinataires | ITypeDestinataires[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TypeDestinatairesService);
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

    it('should create a TypeDestinataires', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TypeDestinataires()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TypeDestinataires', () => {
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

    it('should partial update a TypeDestinataires', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          description: 'BBBBBB',
        },
        new TypeDestinataires()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TypeDestinataires', () => {
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

    it('should delete a TypeDestinataires', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTypeDestinatairesToCollectionIfMissing', () => {
      it('should add a TypeDestinataires to an empty array', () => {
        const typeDestinataires: ITypeDestinataires = { id: 123 };
        expectedResult = service.addTypeDestinatairesToCollectionIfMissing([], typeDestinataires);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeDestinataires);
      });

      it('should not add a TypeDestinataires to an array that contains it', () => {
        const typeDestinataires: ITypeDestinataires = { id: 123 };
        const typeDestinatairesCollection: ITypeDestinataires[] = [
          {
            ...typeDestinataires,
          },
          { id: 456 },
        ];
        expectedResult = service.addTypeDestinatairesToCollectionIfMissing(typeDestinatairesCollection, typeDestinataires);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TypeDestinataires to an array that doesn't contain it", () => {
        const typeDestinataires: ITypeDestinataires = { id: 123 };
        const typeDestinatairesCollection: ITypeDestinataires[] = [{ id: 456 }];
        expectedResult = service.addTypeDestinatairesToCollectionIfMissing(typeDestinatairesCollection, typeDestinataires);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeDestinataires);
      });

      it('should add only unique TypeDestinataires to an array', () => {
        const typeDestinatairesArray: ITypeDestinataires[] = [{ id: 123 }, { id: 456 }, { id: 33951 }];
        const typeDestinatairesCollection: ITypeDestinataires[] = [{ id: 123 }];
        expectedResult = service.addTypeDestinatairesToCollectionIfMissing(typeDestinatairesCollection, ...typeDestinatairesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const typeDestinataires: ITypeDestinataires = { id: 123 };
        const typeDestinataires2: ITypeDestinataires = { id: 456 };
        expectedResult = service.addTypeDestinatairesToCollectionIfMissing([], typeDestinataires, typeDestinataires2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(typeDestinataires);
        expect(expectedResult).toContain(typeDestinataires2);
      });

      it('should accept null and undefined values', () => {
        const typeDestinataires: ITypeDestinataires = { id: 123 };
        expectedResult = service.addTypeDestinatairesToCollectionIfMissing([], null, typeDestinataires, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(typeDestinataires);
      });

      it('should return initial array if no TypeDestinataires is added', () => {
        const typeDestinatairesCollection: ITypeDestinataires[] = [{ id: 123 }];
        expectedResult = service.addTypeDestinatairesToCollectionIfMissing(typeDestinatairesCollection, undefined, null);
        expect(expectedResult).toEqual(typeDestinatairesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
