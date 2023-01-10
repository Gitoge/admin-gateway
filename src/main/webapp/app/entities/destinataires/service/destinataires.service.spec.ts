import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDestinataires, Destinataires } from '../destinataires.model';

import { DestinatairesService } from './destinataires.service';

describe('Destinataires Service', () => {
  let service: DestinatairesService;
  let httpMock: HttpTestingController;
  let elemDefault: IDestinataires;
  let expectedResult: IDestinataires | IDestinataires[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DestinatairesService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      prenom: 'AAAAAAA',
      nom: 'AAAAAAA',
      adresse: 'AAAAAAA',
      comptebancaire: 'AAAAAAA',
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

    it('should create a Destinataires', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Destinataires()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Destinataires', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          prenom: 'BBBBBB',
          nom: 'BBBBBB',
          adresse: 'BBBBBB',
          comptebancaire: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Destinataires', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          nom: 'BBBBBB',
          adresse: 'BBBBBB',
        },
        new Destinataires()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Destinataires', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          prenom: 'BBBBBB',
          nom: 'BBBBBB',
          adresse: 'BBBBBB',
          comptebancaire: 'BBBBBB',
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

    it('should delete a Destinataires', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDestinatairesToCollectionIfMissing', () => {
      it('should add a Destinataires to an empty array', () => {
        const destinataires: IDestinataires = { id: 123 };
        expectedResult = service.addDestinatairesToCollectionIfMissing([], destinataires);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(destinataires);
      });

      it('should not add a Destinataires to an array that contains it', () => {
        const destinataires: IDestinataires = { id: 123 };
        const destinatairesCollection: IDestinataires[] = [
          {
            ...destinataires,
          },
          { id: 456 },
        ];
        expectedResult = service.addDestinatairesToCollectionIfMissing(destinatairesCollection, destinataires);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Destinataires to an array that doesn't contain it", () => {
        const destinataires: IDestinataires = { id: 123 };
        const destinatairesCollection: IDestinataires[] = [{ id: 456 }];
        expectedResult = service.addDestinatairesToCollectionIfMissing(destinatairesCollection, destinataires);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(destinataires);
      });

      it('should add only unique Destinataires to an array', () => {
        const destinatairesArray: IDestinataires[] = [{ id: 123 }, { id: 456 }, { id: 6311 }];
        const destinatairesCollection: IDestinataires[] = [{ id: 123 }];
        expectedResult = service.addDestinatairesToCollectionIfMissing(destinatairesCollection, ...destinatairesArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const destinataires: IDestinataires = { id: 123 };
        const destinataires2: IDestinataires = { id: 456 };
        expectedResult = service.addDestinatairesToCollectionIfMissing([], destinataires, destinataires2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(destinataires);
        expect(expectedResult).toContain(destinataires2);
      });

      it('should accept null and undefined values', () => {
        const destinataires: IDestinataires = { id: 123 };
        expectedResult = service.addDestinatairesToCollectionIfMissing([], null, destinataires, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(destinataires);
      });

      it('should return initial array if no Destinataires is added', () => {
        const destinatairesCollection: IDestinataires[] = [{ id: 123 }];
        expectedResult = service.addDestinatairesToCollectionIfMissing(destinatairesCollection, undefined, null);
        expect(expectedResult).toEqual(destinatairesCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
