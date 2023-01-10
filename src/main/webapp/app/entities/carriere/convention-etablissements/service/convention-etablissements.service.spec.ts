import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IConventionEtablissements, ConventionEtablissements } from '../convention-etablissements.model';

import { ConventionEtablissementsService } from './convention-etablissements.service';

describe('ConventionEtablissements Service', () => {
  let service: ConventionEtablissementsService;
  let httpMock: HttpTestingController;
  let elemDefault: IConventionEtablissements;
  let expectedResult: IConventionEtablissements | IConventionEtablissements[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ConventionEtablissementsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      etablissementId: 0,
      conventionId: 0,
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

    it('should create a ConventionEtablissements', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ConventionEtablissements()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ConventionEtablissements', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          etablissementId: 1,
          conventionId: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ConventionEtablissements', () => {
      const patchObject = Object.assign({}, new ConventionEtablissements());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ConventionEtablissements', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          etablissementId: 1,
          conventionId: 1,
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

    it('should delete a ConventionEtablissements', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addConventionEtablissementsToCollectionIfMissing', () => {
      it('should add a ConventionEtablissements to an empty array', () => {
        const conventionEtablissements: IConventionEtablissements = { id: 123 };
        expectedResult = service.addConventionEtablissementsToCollectionIfMissing([], conventionEtablissements);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(conventionEtablissements);
      });

      it('should not add a ConventionEtablissements to an array that contains it', () => {
        const conventionEtablissements: IConventionEtablissements = { id: 123 };
        const conventionEtablissementsCollection: IConventionEtablissements[] = [
          {
            ...conventionEtablissements,
          },
          { id: 456 },
        ];
        expectedResult = service.addConventionEtablissementsToCollectionIfMissing(
          conventionEtablissementsCollection,
          conventionEtablissements
        );
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ConventionEtablissements to an array that doesn't contain it", () => {
        const conventionEtablissements: IConventionEtablissements = { id: 123 };
        const conventionEtablissementsCollection: IConventionEtablissements[] = [{ id: 456 }];
        expectedResult = service.addConventionEtablissementsToCollectionIfMissing(
          conventionEtablissementsCollection,
          conventionEtablissements
        );
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(conventionEtablissements);
      });

      it('should add only unique ConventionEtablissements to an array', () => {
        const conventionEtablissementsArray: IConventionEtablissements[] = [{ id: 123 }, { id: 456 }, { id: 81407 }];
        const conventionEtablissementsCollection: IConventionEtablissements[] = [{ id: 123 }];
        expectedResult = service.addConventionEtablissementsToCollectionIfMissing(
          conventionEtablissementsCollection,
          ...conventionEtablissementsArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const conventionEtablissements: IConventionEtablissements = { id: 123 };
        const conventionEtablissements2: IConventionEtablissements = { id: 456 };
        expectedResult = service.addConventionEtablissementsToCollectionIfMissing([], conventionEtablissements, conventionEtablissements2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(conventionEtablissements);
        expect(expectedResult).toContain(conventionEtablissements2);
      });

      it('should accept null and undefined values', () => {
        const conventionEtablissements: IConventionEtablissements = { id: 123 };
        expectedResult = service.addConventionEtablissementsToCollectionIfMissing([], null, conventionEtablissements, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(conventionEtablissements);
      });

      it('should return initial array if no ConventionEtablissements is added', () => {
        const conventionEtablissementsCollection: IConventionEtablissements[] = [{ id: 123 }];
        expectedResult = service.addConventionEtablissementsToCollectionIfMissing(conventionEtablissementsCollection, undefined, null);
        expect(expectedResult).toEqual(conventionEtablissementsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
