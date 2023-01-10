import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPages, Pages } from '../pages.model';

import { PagesService } from './pages.service';

describe('Pages Service', () => {
  let service: PagesService;
  let httpMock: HttpTestingController;
  let elemDefault: IPages;
  let expectedResult: IPages | IPages[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PagesService);
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

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Pages', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Pages()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Pages', () => {
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

    it('should partial update a Pages', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          description: 'BBBBBB',
        },
        new Pages()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Pages', () => {
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

    it('should delete a Pages', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPagesToCollectionIfMissing', () => {
      it('should add a Pages to an empty array', () => {
        const pages: IPages = { id: 123 };
        expectedResult = service.addPagesToCollectionIfMissing([], pages);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pages);
      });

      it('should not add a Pages to an array that contains it', () => {
        const pages: IPages = { id: 123 };
        const pagesCollection: IPages[] = [
          {
            ...pages,
          },
          { id: 456 },
        ];
        expectedResult = service.addPagesToCollectionIfMissing(pagesCollection, pages);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Pages to an array that doesn't contain it", () => {
        const pages: IPages = { id: 123 };
        const pagesCollection: IPages[] = [{ id: 456 }];
        expectedResult = service.addPagesToCollectionIfMissing(pagesCollection, pages);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pages);
      });

      it('should add only unique Pages to an array', () => {
        const pagesArray: IPages[] = [{ id: 123 }, { id: 456 }, { id: 91618 }];
        const pagesCollection: IPages[] = [{ id: 123 }];
        expectedResult = service.addPagesToCollectionIfMissing(pagesCollection, ...pagesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pages: IPages = { id: 123 };
        const pages2: IPages = { id: 456 };
        expectedResult = service.addPagesToCollectionIfMissing([], pages, pages2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pages);
        expect(expectedResult).toContain(pages2);
      });

      it('should accept null and undefined values', () => {
        const pages: IPages = { id: 123 };
        expectedResult = service.addPagesToCollectionIfMissing([], null, pages, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pages);
      });

      it('should return initial array if no Pages is added', () => {
        const pagesCollection: IPages[] = [{ id: 123 }];
        expectedResult = service.addPagesToCollectionIfMissing(pagesCollection, undefined, null);
        expect(expectedResult).toEqual(pagesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
