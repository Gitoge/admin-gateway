import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGrilleSoldeGlobal, GrilleSoldeGlobal } from '../grille-solde-global.model';

import { GrilleSoldeGlobalService } from './grille-solde-global.service';

describe('GrilleSoldeGlobal Service', () => {
  let service: GrilleSoldeGlobalService;
  let httpMock: HttpTestingController;
  let elemDefault: IGrilleSoldeGlobal;
  let expectedResult: IGrilleSoldeGlobal | IGrilleSoldeGlobal[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrilleSoldeGlobalService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      soldeGlobal: 0,
      anciennete: 0,
      corpsId: 0,
      hierarchieId: 0,
      cadreId: 0,
      gradeId: 0,
      echelonId: 0,
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

    it('should create a GrilleSoldeGlobal', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new GrilleSoldeGlobal()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GrilleSoldeGlobal', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          soldeGlobal: 1,
          anciennete: 1,
          corpsId: 1,
          hierarchieId: 1,
          cadreId: 1,
          gradeId: 1,
          echelonId: 1,
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

    it('should partial update a GrilleSoldeGlobal', () => {
      const patchObject = Object.assign(
        {
          anciennete: 1,
          cadreId: 1,
        },
        new GrilleSoldeGlobal()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GrilleSoldeGlobal', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          soldeGlobal: 1,
          anciennete: 1,
          corpsId: 1,
          hierarchieId: 1,
          cadreId: 1,
          gradeId: 1,
          echelonId: 1,
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

    it('should delete a GrilleSoldeGlobal', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGrilleSoldeGlobalToCollectionIfMissing', () => {
      it('should add a GrilleSoldeGlobal to an empty array', () => {
        const grilleSoldeGlobal: IGrilleSoldeGlobal = { id: 123 };
        expectedResult = service.addGrilleSoldeGlobalToCollectionIfMissing([], grilleSoldeGlobal);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grilleSoldeGlobal);
      });

      it('should not add a GrilleSoldeGlobal to an array that contains it', () => {
        const grilleSoldeGlobal: IGrilleSoldeGlobal = { id: 123 };
        const grilleSoldeGlobalCollection: IGrilleSoldeGlobal[] = [
          {
            ...grilleSoldeGlobal,
          },
          { id: 456 },
        ];
        expectedResult = service.addGrilleSoldeGlobalToCollectionIfMissing(grilleSoldeGlobalCollection, grilleSoldeGlobal);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GrilleSoldeGlobal to an array that doesn't contain it", () => {
        const grilleSoldeGlobal: IGrilleSoldeGlobal = { id: 123 };
        const grilleSoldeGlobalCollection: IGrilleSoldeGlobal[] = [{ id: 456 }];
        expectedResult = service.addGrilleSoldeGlobalToCollectionIfMissing(grilleSoldeGlobalCollection, grilleSoldeGlobal);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grilleSoldeGlobal);
      });

      it('should add only unique GrilleSoldeGlobal to an array', () => {
        const grilleSoldeGlobalArray: IGrilleSoldeGlobal[] = [{ id: 123 }, { id: 456 }, { id: 91286 }];
        const grilleSoldeGlobalCollection: IGrilleSoldeGlobal[] = [{ id: 123 }];
        expectedResult = service.addGrilleSoldeGlobalToCollectionIfMissing(grilleSoldeGlobalCollection, ...grilleSoldeGlobalArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grilleSoldeGlobal: IGrilleSoldeGlobal = { id: 123 };
        const grilleSoldeGlobal2: IGrilleSoldeGlobal = { id: 456 };
        expectedResult = service.addGrilleSoldeGlobalToCollectionIfMissing([], grilleSoldeGlobal, grilleSoldeGlobal2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grilleSoldeGlobal);
        expect(expectedResult).toContain(grilleSoldeGlobal2);
      });

      it('should accept null and undefined values', () => {
        const grilleSoldeGlobal: IGrilleSoldeGlobal = { id: 123 };
        expectedResult = service.addGrilleSoldeGlobalToCollectionIfMissing([], null, grilleSoldeGlobal, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grilleSoldeGlobal);
      });

      it('should return initial array if no GrilleSoldeGlobal is added', () => {
        const grilleSoldeGlobalCollection: IGrilleSoldeGlobal[] = [{ id: 123 }];
        expectedResult = service.addGrilleSoldeGlobalToCollectionIfMissing(grilleSoldeGlobalCollection, undefined, null);
        expect(expectedResult).toEqual(grilleSoldeGlobalCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
