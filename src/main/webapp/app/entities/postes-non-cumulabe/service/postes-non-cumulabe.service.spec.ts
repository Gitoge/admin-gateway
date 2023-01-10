import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPostesNonCumulabe, PostesNonCumulabe } from '../postes-non-cumulabe.model';

import { PostesNonCumulabeService } from './postes-non-cumulabe.service';

describe('PostesNonCumulabe Service', () => {
  let service: PostesNonCumulabeService;
  let httpMock: HttpTestingController;
  let elemDefault: IPostesNonCumulabe;
  let expectedResult: IPostesNonCumulabe | IPostesNonCumulabe[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PostesNonCumulabeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      codePoste1: 'AAAAAAA',
      codePoste2: 'AAAAAAA',
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

    it('should create a PostesNonCumulabe', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PostesNonCumulabe()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PostesNonCumulabe', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste1: 'BBBBBB',
          codePoste2: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PostesNonCumulabe', () => {
      const patchObject = Object.assign(
        {
          codePoste2: 'BBBBBB',
        },
        new PostesNonCumulabe()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PostesNonCumulabe', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste1: 'BBBBBB',
          codePoste2: 'BBBBBB',
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

    it('should delete a PostesNonCumulabe', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPostesNonCumulabeToCollectionIfMissing', () => {
      it('should add a PostesNonCumulabe to an empty array', () => {
        const postesNonCumulabe: IPostesNonCumulabe = { id: 123 };
        expectedResult = service.addPostesNonCumulabeToCollectionIfMissing([], postesNonCumulabe);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(postesNonCumulabe);
      });

      it('should not add a PostesNonCumulabe to an array that contains it', () => {
        const postesNonCumulabe: IPostesNonCumulabe = { id: 123 };
        const postesNonCumulabeCollection: IPostesNonCumulabe[] = [
          {
            ...postesNonCumulabe,
          },
          { id: 456 },
        ];
        expectedResult = service.addPostesNonCumulabeToCollectionIfMissing(postesNonCumulabeCollection, postesNonCumulabe);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PostesNonCumulabe to an array that doesn't contain it", () => {
        const postesNonCumulabe: IPostesNonCumulabe = { id: 123 };
        const postesNonCumulabeCollection: IPostesNonCumulabe[] = [{ id: 456 }];
        expectedResult = service.addPostesNonCumulabeToCollectionIfMissing(postesNonCumulabeCollection, postesNonCumulabe);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(postesNonCumulabe);
      });

      it('should add only unique PostesNonCumulabe to an array', () => {
        const postesNonCumulabeArray: IPostesNonCumulabe[] = [{ id: 123 }, { id: 456 }, { id: 78267 }];
        const postesNonCumulabeCollection: IPostesNonCumulabe[] = [{ id: 123 }];
        expectedResult = service.addPostesNonCumulabeToCollectionIfMissing(postesNonCumulabeCollection, ...postesNonCumulabeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const postesNonCumulabe: IPostesNonCumulabe = { id: 123 };
        const postesNonCumulabe2: IPostesNonCumulabe = { id: 456 };
        expectedResult = service.addPostesNonCumulabeToCollectionIfMissing([], postesNonCumulabe, postesNonCumulabe2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(postesNonCumulabe);
        expect(expectedResult).toContain(postesNonCumulabe2);
      });

      it('should accept null and undefined values', () => {
        const postesNonCumulabe: IPostesNonCumulabe = { id: 123 };
        expectedResult = service.addPostesNonCumulabeToCollectionIfMissing([], null, postesNonCumulabe, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(postesNonCumulabe);
      });

      it('should return initial array if no PostesNonCumulabe is added', () => {
        const postesNonCumulabeCollection: IPostesNonCumulabe[] = [{ id: 123 }];
        expectedResult = service.addPostesNonCumulabeToCollectionIfMissing(postesNonCumulabeCollection, undefined, null);
        expect(expectedResult).toEqual(postesNonCumulabeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
