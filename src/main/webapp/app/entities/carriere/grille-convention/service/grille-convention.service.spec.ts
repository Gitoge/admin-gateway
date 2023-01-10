import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGrilleConvention, GrilleConvention } from '../grille-convention.model';

import { GrilleConventionService } from './grille-convention.service';

describe('GrilleConvention Service', () => {
  let service: GrilleConventionService;
  let httpMock: HttpTestingController;
  let elemDefault: IGrilleConvention;
  let expectedResult: IGrilleConvention | IGrilleConvention[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrilleConventionService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      salaireBase: 0,
      tauxPrimeDeTechnicite: 0,
      gradeId: 0,
      classeId: 0,
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

    it('should create a GrilleConvention', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new GrilleConvention()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GrilleConvention', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          salaireBase: 1,
          tauxPrimeDeTechnicite: 1,
          gradeId: 1,
          classeId: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GrilleConvention', () => {
      const patchObject = Object.assign(
        {
          tauxPrimeDeTechnicite: 1,
          gradeId: 1,
        },
        new GrilleConvention()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GrilleConvention', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          salaireBase: 1,
          tauxPrimeDeTechnicite: 1,
          gradeId: 1,
          classeId: 1,
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

    it('should delete a GrilleConvention', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGrilleConventionToCollectionIfMissing', () => {
      it('should add a GrilleConvention to an empty array', () => {
        const grilleConvention: IGrilleConvention = { id: 123 };
        expectedResult = service.addGrilleConventionToCollectionIfMissing([], grilleConvention);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grilleConvention);
      });

      it('should not add a GrilleConvention to an array that contains it', () => {
        const grilleConvention: IGrilleConvention = { id: 123 };
        const grilleConventionCollection: IGrilleConvention[] = [
          {
            ...grilleConvention,
          },
          { id: 456 },
        ];
        expectedResult = service.addGrilleConventionToCollectionIfMissing(grilleConventionCollection, grilleConvention);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GrilleConvention to an array that doesn't contain it", () => {
        const grilleConvention: IGrilleConvention = { id: 123 };
        const grilleConventionCollection: IGrilleConvention[] = [{ id: 456 }];
        expectedResult = service.addGrilleConventionToCollectionIfMissing(grilleConventionCollection, grilleConvention);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grilleConvention);
      });

      it('should add only unique GrilleConvention to an array', () => {
        const grilleConventionArray: IGrilleConvention[] = [{ id: 123 }, { id: 456 }, { id: 95065 }];
        const grilleConventionCollection: IGrilleConvention[] = [{ id: 123 }];
        expectedResult = service.addGrilleConventionToCollectionIfMissing(grilleConventionCollection, ...grilleConventionArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grilleConvention: IGrilleConvention = { id: 123 };
        const grilleConvention2: IGrilleConvention = { id: 456 };
        expectedResult = service.addGrilleConventionToCollectionIfMissing([], grilleConvention, grilleConvention2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grilleConvention);
        expect(expectedResult).toContain(grilleConvention2);
      });

      it('should accept null and undefined values', () => {
        const grilleConvention: IGrilleConvention = { id: 123 };
        expectedResult = service.addGrilleConventionToCollectionIfMissing([], null, grilleConvention, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grilleConvention);
      });

      it('should return initial array if no GrilleConvention is added', () => {
        const grilleConventionCollection: IGrilleConvention[] = [{ id: 123 }];
        expectedResult = service.addGrilleConventionToCollectionIfMissing(grilleConventionCollection, undefined, null);
        expect(expectedResult).toEqual(grilleConventionCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
