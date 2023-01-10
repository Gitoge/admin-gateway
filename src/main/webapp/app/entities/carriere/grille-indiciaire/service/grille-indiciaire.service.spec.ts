import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGrilleIndiciaire, GrilleIndiciaire } from '../grille-indiciaire.model';

import { GrilleIndiciaireService } from './grille-indiciaire.service';

describe('GrilleIndiciaire Service', () => {
  let service: GrilleIndiciaireService;
  let httpMock: HttpTestingController;
  let elemDefault: IGrilleIndiciaire;
  let expectedResult: IGrilleIndiciaire | IGrilleIndiciaire[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrilleIndiciaireService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      salaireDeBase: 0,
      borneInferieure: 0,
      borneSuperieure: 0,
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

    it('should create a GrilleIndiciaire', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new GrilleIndiciaire()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GrilleIndiciaire', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          salaireDeBase: 1,
          borneInferieure: 1,
          borneSuperieure: 1,
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

    it('should partial update a GrilleIndiciaire', () => {
      const patchObject = Object.assign(
        {
          salaireDeBase: 1,
          borneInferieure: 1,
          echelonId: 1,
          classeId: 1,
        },
        new GrilleIndiciaire()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GrilleIndiciaire', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          salaireDeBase: 1,
          borneInferieure: 1,
          borneSuperieure: 1,
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

    it('should delete a GrilleIndiciaire', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGrilleIndiciaireToCollectionIfMissing', () => {
      it('should add a GrilleIndiciaire to an empty array', () => {
        const grilleIndiciaire: IGrilleIndiciaire = { id: 123 };
        expectedResult = service.addGrilleIndiciaireToCollectionIfMissing([], grilleIndiciaire);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grilleIndiciaire);
      });

      it('should not add a GrilleIndiciaire to an array that contains it', () => {
        const grilleIndiciaire: IGrilleIndiciaire = { id: 123 };
        const grilleIndiciaireCollection: IGrilleIndiciaire[] = [
          {
            ...grilleIndiciaire,
          },
          { id: 456 },
        ];
        expectedResult = service.addGrilleIndiciaireToCollectionIfMissing(grilleIndiciaireCollection, grilleIndiciaire);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GrilleIndiciaire to an array that doesn't contain it", () => {
        const grilleIndiciaire: IGrilleIndiciaire = { id: 123 };
        const grilleIndiciaireCollection: IGrilleIndiciaire[] = [{ id: 456 }];
        expectedResult = service.addGrilleIndiciaireToCollectionIfMissing(grilleIndiciaireCollection, grilleIndiciaire);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grilleIndiciaire);
      });

      it('should add only unique GrilleIndiciaire to an array', () => {
        const grilleIndiciaireArray: IGrilleIndiciaire[] = [{ id: 123 }, { id: 456 }, { id: 53539 }];
        const grilleIndiciaireCollection: IGrilleIndiciaire[] = [{ id: 123 }];
        expectedResult = service.addGrilleIndiciaireToCollectionIfMissing(grilleIndiciaireCollection, ...grilleIndiciaireArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grilleIndiciaire: IGrilleIndiciaire = { id: 123 };
        const grilleIndiciaire2: IGrilleIndiciaire = { id: 456 };
        expectedResult = service.addGrilleIndiciaireToCollectionIfMissing([], grilleIndiciaire, grilleIndiciaire2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grilleIndiciaire);
        expect(expectedResult).toContain(grilleIndiciaire2);
      });

      it('should accept null and undefined values', () => {
        const grilleIndiciaire: IGrilleIndiciaire = { id: 123 };
        expectedResult = service.addGrilleIndiciaireToCollectionIfMissing([], null, grilleIndiciaire, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grilleIndiciaire);
      });

      it('should return initial array if no GrilleIndiciaire is added', () => {
        const grilleIndiciaireCollection: IGrilleIndiciaire[] = [{ id: 123 }];
        expectedResult = service.addGrilleIndiciaireToCollectionIfMissing(grilleIndiciaireCollection, undefined, null);
        expect(expectedResult).toEqual(grilleIndiciaireCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
