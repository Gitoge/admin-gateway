import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExclusionTaux, ExclusionTaux } from '../exclusion-taux.model';

import { ExclusionTauxService } from './exclusion-taux.service';

describe('ExclusionTaux Service', () => {
  let service: ExclusionTauxService;
  let httpMock: HttpTestingController;
  let elemDefault: IExclusionTaux;
  let expectedResult: IExclusionTaux | IExclusionTaux[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExclusionTauxService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      etablissementId: 0,
      valeur: 0,
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

    it('should create a ExclusionTaux', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ExclusionTaux()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExclusionTaux', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          etablissementId: 1,
          valeur: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ExclusionTaux', () => {
      const patchObject = Object.assign(
        {
          valeur: 1,
        },
        new ExclusionTaux()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ExclusionTaux', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          etablissementId: 1,
          valeur: 1,
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

    it('should delete a ExclusionTaux', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addExclusionTauxToCollectionIfMissing', () => {
      it('should add a ExclusionTaux to an empty array', () => {
        const exclusionTaux: IExclusionTaux = { id: 123 };
        expectedResult = service.addExclusionTauxToCollectionIfMissing([], exclusionTaux);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exclusionTaux);
      });

      it('should not add a ExclusionTaux to an array that contains it', () => {
        const exclusionTaux: IExclusionTaux = { id: 123 };
        const exclusionTauxCollection: IExclusionTaux[] = [
          {
            ...exclusionTaux,
          },
          { id: 456 },
        ];
        expectedResult = service.addExclusionTauxToCollectionIfMissing(exclusionTauxCollection, exclusionTaux);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExclusionTaux to an array that doesn't contain it", () => {
        const exclusionTaux: IExclusionTaux = { id: 123 };
        const exclusionTauxCollection: IExclusionTaux[] = [{ id: 456 }];
        expectedResult = service.addExclusionTauxToCollectionIfMissing(exclusionTauxCollection, exclusionTaux);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exclusionTaux);
      });

      it('should add only unique ExclusionTaux to an array', () => {
        const exclusionTauxArray: IExclusionTaux[] = [{ id: 123 }, { id: 456 }, { id: 94292 }];
        const exclusionTauxCollection: IExclusionTaux[] = [{ id: 123 }];
        expectedResult = service.addExclusionTauxToCollectionIfMissing(exclusionTauxCollection, ...exclusionTauxArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const exclusionTaux: IExclusionTaux = { id: 123 };
        const exclusionTaux2: IExclusionTaux = { id: 456 };
        expectedResult = service.addExclusionTauxToCollectionIfMissing([], exclusionTaux, exclusionTaux2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exclusionTaux);
        expect(expectedResult).toContain(exclusionTaux2);
      });

      it('should accept null and undefined values', () => {
        const exclusionTaux: IExclusionTaux = { id: 123 };
        expectedResult = service.addExclusionTauxToCollectionIfMissing([], null, exclusionTaux, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exclusionTaux);
      });

      it('should return initial array if no ExclusionTaux is added', () => {
        const exclusionTauxCollection: IExclusionTaux[] = [{ id: 123 }];
        expectedResult = service.addExclusionTauxToCollectionIfMissing(exclusionTauxCollection, undefined, null);
        expect(expectedResult).toEqual(exclusionTauxCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
