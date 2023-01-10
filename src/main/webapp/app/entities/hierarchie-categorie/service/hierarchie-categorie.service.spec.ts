import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHierarchieCategorie, HierarchieCategorie } from '../hierarchie-categorie.model';

import { HierarchieCategorieService } from './hierarchie-categorie.service';

describe('HierarchieCategorie Service', () => {
  let service: HierarchieCategorieService;
  let httpMock: HttpTestingController;
  let elemDefault: IHierarchieCategorie;
  let expectedResult: IHierarchieCategorie | IHierarchieCategorie[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HierarchieCategorieService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      hierarchieId: 0,
      categorieId: 0,
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

    it('should create a HierarchieCategorie', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new HierarchieCategorie()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a HierarchieCategorie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          hierarchieId: 1,
          categorieId: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a HierarchieCategorie', () => {
      const patchObject = Object.assign(
        {
          hierarchieId: 1,
          categorieId: 1,
        },
        new HierarchieCategorie()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of HierarchieCategorie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          hierarchieId: 1,
          categorieId: 1,
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

    it('should delete a HierarchieCategorie', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addHierarchieCategorieToCollectionIfMissing', () => {
      it('should add a HierarchieCategorie to an empty array', () => {
        const hierarchieCategorie: IHierarchieCategorie = { id: 123 };
        expectedResult = service.addHierarchieCategorieToCollectionIfMissing([], hierarchieCategorie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hierarchieCategorie);
      });

      it('should not add a HierarchieCategorie to an array that contains it', () => {
        const hierarchieCategorie: IHierarchieCategorie = { id: 123 };
        const hierarchieCategorieCollection: IHierarchieCategorie[] = [
          {
            ...hierarchieCategorie,
          },
          { id: 456 },
        ];
        expectedResult = service.addHierarchieCategorieToCollectionIfMissing(hierarchieCategorieCollection, hierarchieCategorie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a HierarchieCategorie to an array that doesn't contain it", () => {
        const hierarchieCategorie: IHierarchieCategorie = { id: 123 };
        const hierarchieCategorieCollection: IHierarchieCategorie[] = [{ id: 456 }];
        expectedResult = service.addHierarchieCategorieToCollectionIfMissing(hierarchieCategorieCollection, hierarchieCategorie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hierarchieCategorie);
      });

      it('should add only unique HierarchieCategorie to an array', () => {
        const hierarchieCategorieArray: IHierarchieCategorie[] = [{ id: 123 }, { id: 456 }, { id: 76519 }];
        const hierarchieCategorieCollection: IHierarchieCategorie[] = [{ id: 123 }];
        expectedResult = service.addHierarchieCategorieToCollectionIfMissing(hierarchieCategorieCollection, ...hierarchieCategorieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const hierarchieCategorie: IHierarchieCategorie = { id: 123 };
        const hierarchieCategorie2: IHierarchieCategorie = { id: 456 };
        expectedResult = service.addHierarchieCategorieToCollectionIfMissing([], hierarchieCategorie, hierarchieCategorie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hierarchieCategorie);
        expect(expectedResult).toContain(hierarchieCategorie2);
      });

      it('should accept null and undefined values', () => {
        const hierarchieCategorie: IHierarchieCategorie = { id: 123 };
        expectedResult = service.addHierarchieCategorieToCollectionIfMissing([], null, hierarchieCategorie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hierarchieCategorie);
      });

      it('should return initial array if no HierarchieCategorie is added', () => {
        const hierarchieCategorieCollection: IHierarchieCategorie[] = [{ id: 123 }];
        expectedResult = service.addHierarchieCategorieToCollectionIfMissing(hierarchieCategorieCollection, undefined, null);
        expect(expectedResult).toEqual(hierarchieCategorieCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
