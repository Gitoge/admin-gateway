import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPostesReferenceActes, PostesReferenceActes } from '../postes-reference-actes.model';

import { PostesReferenceActesService } from './postes-reference-actes.service';

describe('PostesReferenceActes Service', () => {
  let service: PostesReferenceActesService;
  let httpMock: HttpTestingController;
  let elemDefault: IPostesReferenceActes;
  let expectedResult: IPostesReferenceActes | IPostesReferenceActes[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PostesReferenceActesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      postes: 0,
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

    it('should create a PostesReferenceActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PostesReferenceActes()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PostesReferenceActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          postes: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PostesReferenceActes', () => {
      const patchObject = Object.assign(
        {
          postes: 1,
        },
        new PostesReferenceActes()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PostesReferenceActes', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          postes: 1,
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

    it('should delete a PostesReferenceActes', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPostesReferenceActesToCollectionIfMissing', () => {
      it('should add a PostesReferenceActes to an empty array', () => {
        const postesReferenceActes: IPostesReferenceActes = { id: 123 };
        expectedResult = service.addPostesReferenceActesToCollectionIfMissing([], postesReferenceActes);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(postesReferenceActes);
      });

      it('should not add a PostesReferenceActes to an array that contains it', () => {
        const postesReferenceActes: IPostesReferenceActes = { id: 123 };
        const postesReferenceActesCollection: IPostesReferenceActes[] = [
          {
            ...postesReferenceActes,
          },
          { id: 456 },
        ];
        expectedResult = service.addPostesReferenceActesToCollectionIfMissing(postesReferenceActesCollection, postesReferenceActes);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PostesReferenceActes to an array that doesn't contain it", () => {
        const postesReferenceActes: IPostesReferenceActes = { id: 123 };
        const postesReferenceActesCollection: IPostesReferenceActes[] = [{ id: 456 }];
        expectedResult = service.addPostesReferenceActesToCollectionIfMissing(postesReferenceActesCollection, postesReferenceActes);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(postesReferenceActes);
      });

      it('should add only unique PostesReferenceActes to an array', () => {
        const postesReferenceActesArray: IPostesReferenceActes[] = [{ id: 123 }, { id: 456 }, { id: 27524 }];
        const postesReferenceActesCollection: IPostesReferenceActes[] = [{ id: 123 }];
        expectedResult = service.addPostesReferenceActesToCollectionIfMissing(postesReferenceActesCollection, ...postesReferenceActesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const postesReferenceActes: IPostesReferenceActes = { id: 123 };
        const postesReferenceActes2: IPostesReferenceActes = { id: 456 };
        expectedResult = service.addPostesReferenceActesToCollectionIfMissing([], postesReferenceActes, postesReferenceActes2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(postesReferenceActes);
        expect(expectedResult).toContain(postesReferenceActes2);
      });

      it('should accept null and undefined values', () => {
        const postesReferenceActes: IPostesReferenceActes = { id: 123 };
        expectedResult = service.addPostesReferenceActesToCollectionIfMissing([], null, postesReferenceActes, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(postesReferenceActes);
      });

      it('should return initial array if no PostesReferenceActes is added', () => {
        const postesReferenceActesCollection: IPostesReferenceActes[] = [{ id: 123 }];
        expectedResult = service.addPostesReferenceActesToCollectionIfMissing(postesReferenceActesCollection, undefined, null);
        expect(expectedResult).toEqual(postesReferenceActesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
