import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEtablissementBancaire, EtablissementBancaire } from '../etablissement-bancaire.model';

import { EtablissementBancaireService } from './etablissement-bancaire.service';

describe('EtablissementBancaire Service', () => {
  let service: EtablissementBancaireService;
  let httpMock: HttpTestingController;
  let elemDefault: IEtablissementBancaire;
  let expectedResult: IEtablissementBancaire | IEtablissementBancaire[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EtablissementBancaireService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      telephone: 'AAAAAAA',
      email: 'AAAAAAA',
      adresse: 'AAAAAAA',
      fax: 'AAAAAAA',
      regionId: 0,
      departementId: 0,
      communeId: 0,
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

    it('should create a EtablissementBancaire', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new EtablissementBancaire()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a EtablissementBancaire', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          telephone: 'BBBBBB',
          email: 'BBBBBB',
          adresse: 'BBBBBB',
          fax: 'BBBBBB',
          regionId: 1,
          departementId: 1,
          communeId: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a EtablissementBancaire', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          telephone: 'BBBBBB',
          email: 'BBBBBB',
          fax: 'BBBBBB',
          departementId: 1,
          communeId: 1,
        },
        new EtablissementBancaire()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of EtablissementBancaire', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          telephone: 'BBBBBB',
          email: 'BBBBBB',
          adresse: 'BBBBBB',
          fax: 'BBBBBB',
          regionId: 1,
          departementId: 1,
          communeId: 1,
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

    it('should delete a EtablissementBancaire', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEtablissementBancaireToCollectionIfMissing', () => {
      it('should add a EtablissementBancaire to an empty array', () => {
        const etablissementBancaire: IEtablissementBancaire = { id: 123 };
        expectedResult = service.addEtablissementBancaireToCollectionIfMissing([], etablissementBancaire);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etablissementBancaire);
      });

      it('should not add a EtablissementBancaire to an array that contains it', () => {
        const etablissementBancaire: IEtablissementBancaire = { id: 123 };
        const etablissementBancaireCollection: IEtablissementBancaire[] = [
          {
            ...etablissementBancaire,
          },
          { id: 456 },
        ];
        expectedResult = service.addEtablissementBancaireToCollectionIfMissing(etablissementBancaireCollection, etablissementBancaire);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a EtablissementBancaire to an array that doesn't contain it", () => {
        const etablissementBancaire: IEtablissementBancaire = { id: 123 };
        const etablissementBancaireCollection: IEtablissementBancaire[] = [{ id: 456 }];
        expectedResult = service.addEtablissementBancaireToCollectionIfMissing(etablissementBancaireCollection, etablissementBancaire);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etablissementBancaire);
      });

      it('should add only unique EtablissementBancaire to an array', () => {
        const etablissementBancaireArray: IEtablissementBancaire[] = [{ id: 123 }, { id: 456 }, { id: 57912 }];
        const etablissementBancaireCollection: IEtablissementBancaire[] = [{ id: 123 }];
        expectedResult = service.addEtablissementBancaireToCollectionIfMissing(
          etablissementBancaireCollection,
          ...etablissementBancaireArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etablissementBancaire: IEtablissementBancaire = { id: 123 };
        const etablissementBancaire2: IEtablissementBancaire = { id: 456 };
        expectedResult = service.addEtablissementBancaireToCollectionIfMissing([], etablissementBancaire, etablissementBancaire2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etablissementBancaire);
        expect(expectedResult).toContain(etablissementBancaire2);
      });

      it('should accept null and undefined values', () => {
        const etablissementBancaire: IEtablissementBancaire = { id: 123 };
        expectedResult = service.addEtablissementBancaireToCollectionIfMissing([], null, etablissementBancaire, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etablissementBancaire);
      });

      it('should return initial array if no EtablissementBancaire is added', () => {
        const etablissementBancaireCollection: IEtablissementBancaire[] = [{ id: 123 }];
        expectedResult = service.addEtablissementBancaireToCollectionIfMissing(etablissementBancaireCollection, undefined, null);
        expect(expectedResult).toEqual(etablissementBancaireCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
