import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBilleteur, Billeteur } from '../billeteur.model';

import { BilleteurService } from './billeteur.service';

describe('Billeteur Service', () => {
  let service: BilleteurService;
  let httpMock: HttpTestingController;
  let elemDefault: IBilleteur;
  let expectedResult: IBilleteur | IBilleteur[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BilleteurService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      etablissementId: 0,
      code: 'AAAAAAA',
      prenom: 'AAAAAAA',
      nom: 'AAAAAAA',
      matricule: 'AAAAAAA',
      telephone: 'AAAAAAA',
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

    it('should create a Billeteur', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Billeteur()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Billeteur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          etablissementId: 1,
          code: 'BBBBBB',
          prenom: 'BBBBBB',
          nom: 'BBBBBB',
          matricule: 'BBBBBB',
          telephone: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Billeteur', () => {
      const patchObject = Object.assign(
        {
          prenom: 'BBBBBB',
          nom: 'BBBBBB',
          telephone: 'BBBBBB',
        },
        new Billeteur()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Billeteur', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          etablissementId: 1,
          code: 'BBBBBB',
          prenom: 'BBBBBB',
          nom: 'BBBBBB',
          matricule: 'BBBBBB',
          telephone: 'BBBBBB',
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

    it('should delete a Billeteur', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBilleteurToCollectionIfMissing', () => {
      it('should add a Billeteur to an empty array', () => {
        const billeteur: IBilleteur = { id: 123 };
        expectedResult = service.addBilleteurToCollectionIfMissing([], billeteur);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(billeteur);
      });

      it('should not add a Billeteur to an array that contains it', () => {
        const billeteur: IBilleteur = { id: 123 };
        const billeteurCollection: IBilleteur[] = [
          {
            ...billeteur,
          },
          { id: 456 },
        ];
        expectedResult = service.addBilleteurToCollectionIfMissing(billeteurCollection, billeteur);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Billeteur to an array that doesn't contain it", () => {
        const billeteur: IBilleteur = { id: 123 };
        const billeteurCollection: IBilleteur[] = [{ id: 456 }];
        expectedResult = service.addBilleteurToCollectionIfMissing(billeteurCollection, billeteur);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(billeteur);
      });

      it('should add only unique Billeteur to an array', () => {
        const billeteurArray: IBilleteur[] = [{ id: 123 }, { id: 456 }, { id: 58607 }];
        const billeteurCollection: IBilleteur[] = [{ id: 123 }];
        expectedResult = service.addBilleteurToCollectionIfMissing(billeteurCollection, ...billeteurArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const billeteur: IBilleteur = { id: 123 };
        const billeteur2: IBilleteur = { id: 456 };
        expectedResult = service.addBilleteurToCollectionIfMissing([], billeteur, billeteur2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(billeteur);
        expect(expectedResult).toContain(billeteur2);
      });

      it('should accept null and undefined values', () => {
        const billeteur: IBilleteur = { id: 123 };
        expectedResult = service.addBilleteurToCollectionIfMissing([], null, billeteur, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(billeteur);
      });

      it('should return initial array if no Billeteur is added', () => {
        const billeteurCollection: IBilleteur[] = [{ id: 123 }];
        expectedResult = service.addBilleteurToCollectionIfMissing(billeteurCollection, undefined, null);
        expect(expectedResult).toEqual(billeteurCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
