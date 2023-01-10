import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IIndices, Indices } from '../indices.model';

import { IndicesService } from './indices.service';

describe('Indices Service', () => {
  let service: IndicesService;
  let httpMock: HttpTestingController;
  let elemDefault: IIndices;
  let expectedResult: IIndices | IIndices[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(IndicesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      soldeIndiciaire: 0,
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

    it('should create a Indices', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Indices()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Indices', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          soldeIndiciaire: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Indices', () => {
      const patchObject = Object.assign(
        {
          soldeIndiciaire: 1,
        },
        new Indices()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Indices', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          soldeIndiciaire: 1,
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

    it('should delete a Indices', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addIndicesToCollectionIfMissing', () => {
      it('should add a Indices to an empty array', () => {
        const indices: IIndices = { id: 123 };
        expectedResult = service.addIndicesToCollectionIfMissing([], indices);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(indices);
      });

      it('should not add a Indices to an array that contains it', () => {
        const indices: IIndices = { id: 123 };
        const indicesCollection: IIndices[] = [
          {
            ...indices,
          },
          { id: 456 },
        ];
        expectedResult = service.addIndicesToCollectionIfMissing(indicesCollection, indices);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Indices to an array that doesn't contain it", () => {
        const indices: IIndices = { id: 123 };
        const indicesCollection: IIndices[] = [{ id: 456 }];
        expectedResult = service.addIndicesToCollectionIfMissing(indicesCollection, indices);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(indices);
      });

      it('should add only unique Indices to an array', () => {
        const indicesArray: IIndices[] = [{ id: 123 }, { id: 456 }, { id: 88659 }];
        const indicesCollection: IIndices[] = [{ id: 123 }];
        expectedResult = service.addIndicesToCollectionIfMissing(indicesCollection, ...indicesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const indices: IIndices = { id: 123 };
        const indices2: IIndices = { id: 456 };
        expectedResult = service.addIndicesToCollectionIfMissing([], indices, indices2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(indices);
        expect(expectedResult).toContain(indices2);
      });

      it('should accept null and undefined values', () => {
        const indices: IIndices = { id: 123 };
        expectedResult = service.addIndicesToCollectionIfMissing([], null, indices, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(indices);
      });

      it('should return initial array if no Indices is added', () => {
        const indicesCollection: IIndices[] = [{ id: 123 }];
        expectedResult = service.addIndicesToCollectionIfMissing(indicesCollection, undefined, null);
        expect(expectedResult).toEqual(indicesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
