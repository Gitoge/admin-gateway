import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IArrondissement, Arrondissement } from '../arrondissement.model';

import { ArrondissementService } from './arrondissement.service';

describe('Service Tests', () => {
  describe('Arrondissement Service', () => {
    let service: ArrondissementService;
    let httpMock: HttpTestingController;
    let elemDefault: IArrondissement;
    let expectedResult: IArrondissement | IArrondissement[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ArrondissementService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        code: 'AAAAAAA',
        libelle: 'AAAAAAA',
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

      it('should create a Arrondissement', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Arrondissement()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Arrondissement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            code: 'BBBBBB',
            libelle: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Arrondissement', () => {
        const patchObject = Object.assign({}, new Arrondissement());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Arrondissement', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            code: 'BBBBBB',
            libelle: 'BBBBBB',
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

      it('should delete a Arrondissement', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addArrondissementToCollectionIfMissing', () => {
        it('should add a Arrondissement to an empty array', () => {
          const arrondissement: IArrondissement = { id: 123 };
          expectedResult = service.addArrondissementToCollectionIfMissing([], arrondissement);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(arrondissement);
        });

        it('should not add a Arrondissement to an array that contains it', () => {
          const arrondissement: IArrondissement = { id: 123 };
          const arrondissementCollection: IArrondissement[] = [
            {
              ...arrondissement,
            },
            { id: 456 },
          ];
          expectedResult = service.addArrondissementToCollectionIfMissing(arrondissementCollection, arrondissement);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Arrondissement to an array that doesn't contain it", () => {
          const arrondissement: IArrondissement = { id: 123 };
          const arrondissementCollection: IArrondissement[] = [{ id: 456 }];
          expectedResult = service.addArrondissementToCollectionIfMissing(arrondissementCollection, arrondissement);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(arrondissement);
        });

        it('should add only unique Arrondissement to an array', () => {
          const arrondissementArray: IArrondissement[] = [{ id: 123 }, { id: 456 }, { id: 36765 }];
          const arrondissementCollection: IArrondissement[] = [{ id: 123 }];
          expectedResult = service.addArrondissementToCollectionIfMissing(arrondissementCollection, ...arrondissementArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const arrondissement: IArrondissement = { id: 123 };
          const arrondissement2: IArrondissement = { id: 456 };
          expectedResult = service.addArrondissementToCollectionIfMissing([], arrondissement, arrondissement2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(arrondissement);
          expect(expectedResult).toContain(arrondissement2);
        });

        it('should accept null and undefined values', () => {
          const arrondissement: IArrondissement = { id: 123 };
          expectedResult = service.addArrondissementToCollectionIfMissing([], null, arrondissement, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(arrondissement);
        });

        it('should return initial array if no Arrondissement is added', () => {
          const arrondissementCollection: IArrondissement[] = [{ id: 123 }];
          expectedResult = service.addArrondissementToCollectionIfMissing(arrondissementCollection, undefined, null);
          expect(expectedResult).toEqual(arrondissementCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
