import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReglement, Reglement } from '../reglement.model';

import { ReglementService } from './reglement.service';

describe('Reglement Service', () => {
  let service: ReglementService;
  let httpMock: HttpTestingController;
  let elemDefault: IReglement;
  let expectedResult: IReglement | IReglement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReglementService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      complementinfos: 'AAAAAAA',
      commentaire: 'AAAAAAA',
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

    it('should create a Reglement', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Reglement()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reglement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          complementinfos: 'BBBBBB',
          commentaire: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reglement', () => {
      const patchObject = Object.assign({}, new Reglement());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reglement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          complementinfos: 'BBBBBB',
          commentaire: 'BBBBBB',
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

    it('should delete a Reglement', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addReglementToCollectionIfMissing', () => {
      it('should add a Reglement to an empty array', () => {
        const reglement: IReglement = { id: 123 };
        expectedResult = service.addReglementToCollectionIfMissing([], reglement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reglement);
      });

      it('should not add a Reglement to an array that contains it', () => {
        const reglement: IReglement = { id: 123 };
        const reglementCollection: IReglement[] = [
          {
            ...reglement,
          },
          { id: 456 },
        ];
        expectedResult = service.addReglementToCollectionIfMissing(reglementCollection, reglement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reglement to an array that doesn't contain it", () => {
        const reglement: IReglement = { id: 123 };
        const reglementCollection: IReglement[] = [{ id: 456 }];
        expectedResult = service.addReglementToCollectionIfMissing(reglementCollection, reglement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reglement);
      });

      it('should add only unique Reglement to an array', () => {
        const reglementArray: IReglement[] = [{ id: 123 }, { id: 456 }, { id: 29394 }];
        const reglementCollection: IReglement[] = [{ id: 123 }];
        expectedResult = service.addReglementToCollectionIfMissing(reglementCollection, ...reglementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reglement: IReglement = { id: 123 };
        const reglement2: IReglement = { id: 456 };
        expectedResult = service.addReglementToCollectionIfMissing([], reglement, reglement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reglement);
        expect(expectedResult).toContain(reglement2);
      });

      it('should accept null and undefined values', () => {
        const reglement: IReglement = { id: 123 };
        expectedResult = service.addReglementToCollectionIfMissing([], null, reglement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reglement);
      });

      it('should return initial array if no Reglement is added', () => {
        const reglementCollection: IReglement[] = [{ id: 123 }];
        expectedResult = service.addReglementToCollectionIfMissing(reglementCollection, undefined, null);
        expect(expectedResult).toEqual(reglementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
