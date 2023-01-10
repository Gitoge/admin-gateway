import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IHierarchie, Hierarchie } from '../hierarchie.model';

import { HierarchieService } from './hierarchie.service';

describe('Hierarchie Service', () => {
  let service: HierarchieService;
  let httpMock: HttpTestingController;
  let elemDefault: IHierarchie;
  let expectedResult: IHierarchie | IHierarchie[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(HierarchieService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      borneInferieure: 'AAAAAAA',
      borneSuperieure: 'AAAAAAA',
      codEchelonIndiciare: 'AAAAAAA',
      hcadre: 'AAAAAAA',
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

    it('should create a Hierarchie', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Hierarchie()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Hierarchie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          borneInferieure: 'BBBBBB',
          borneSuperieure: 'BBBBBB',
          codEchelonIndiciare: 'BBBBBB',
          hcadre: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Hierarchie', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          borneSuperieure: 'BBBBBB',
          codEchelonIndiciare: 'BBBBBB',
        },
        new Hierarchie()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Hierarchie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          borneInferieure: 'BBBBBB',
          borneSuperieure: 'BBBBBB',
          codEchelonIndiciare: 'BBBBBB',
          hcadre: 'BBBBBB',
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

    it('should delete a Hierarchie', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addHierarchieToCollectionIfMissing', () => {
      it('should add a Hierarchie to an empty array', () => {
        const hierarchie: IHierarchie = { id: 123 };
        expectedResult = service.addHierarchieToCollectionIfMissing([], hierarchie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hierarchie);
      });

      it('should not add a Hierarchie to an array that contains it', () => {
        const hierarchie: IHierarchie = { id: 123 };
        const hierarchieCollection: IHierarchie[] = [
          {
            ...hierarchie,
          },
          { id: 456 },
        ];
        expectedResult = service.addHierarchieToCollectionIfMissing(hierarchieCollection, hierarchie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Hierarchie to an array that doesn't contain it", () => {
        const hierarchie: IHierarchie = { id: 123 };
        const hierarchieCollection: IHierarchie[] = [{ id: 456 }];
        expectedResult = service.addHierarchieToCollectionIfMissing(hierarchieCollection, hierarchie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hierarchie);
      });

      it('should add only unique Hierarchie to an array', () => {
        const hierarchieArray: IHierarchie[] = [{ id: 123 }, { id: 456 }, { id: 3961 }];
        const hierarchieCollection: IHierarchie[] = [{ id: 123 }];
        expectedResult = service.addHierarchieToCollectionIfMissing(hierarchieCollection, ...hierarchieArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const hierarchie: IHierarchie = { id: 123 };
        const hierarchie2: IHierarchie = { id: 456 };
        expectedResult = service.addHierarchieToCollectionIfMissing([], hierarchie, hierarchie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(hierarchie);
        expect(expectedResult).toContain(hierarchie2);
      });

      it('should accept null and undefined values', () => {
        const hierarchie: IHierarchie = { id: 123 };
        expectedResult = service.addHierarchieToCollectionIfMissing([], null, hierarchie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(hierarchie);
      });

      it('should return initial array if no Hierarchie is added', () => {
        const hierarchieCollection: IHierarchie[] = [{ id: 123 }];
        expectedResult = service.addHierarchieToCollectionIfMissing(hierarchieCollection, undefined, null);
        expect(expectedResult).toEqual(hierarchieCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
