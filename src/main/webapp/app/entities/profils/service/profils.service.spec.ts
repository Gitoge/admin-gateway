import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProfils, Profils } from '../profils.model';

import { ProfilsService } from './profils.service';

describe('Profils Service', () => {
  let service: ProfilsService;
  let httpMock: HttpTestingController;
  let elemDefault: IProfils;
  let expectedResult: IProfils | IProfils[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProfilsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
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

    it('should create a Profils', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Profils()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Profils', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Profils', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          description: 'BBBBBB',
        },
        new Profils()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Profils', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should delete a Profils', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProfilsToCollectionIfMissing', () => {
      it('should add a Profils to an empty array', () => {
        const profils: IProfils = { id: 123 };
        expectedResult = service.addProfilsToCollectionIfMissing([], profils);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profils);
      });

      it('should not add a Profils to an array that contains it', () => {
        const profils: IProfils = { id: 123 };
        const profilsCollection: IProfils[] = [
          {
            ...profils,
          },
          { id: 456 },
        ];
        expectedResult = service.addProfilsToCollectionIfMissing(profilsCollection, profils);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Profils to an array that doesn't contain it", () => {
        const profils: IProfils = { id: 123 };
        const profilsCollection: IProfils[] = [{ id: 456 }];
        expectedResult = service.addProfilsToCollectionIfMissing(profilsCollection, profils);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profils);
      });

      it('should add only unique Profils to an array', () => {
        const profilsArray: IProfils[] = [{ id: 123 }, { id: 456 }, { id: 78815 }];
        const profilsCollection: IProfils[] = [{ id: 123 }];
        expectedResult = service.addProfilsToCollectionIfMissing(profilsCollection, ...profilsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const profils: IProfils = { id: 123 };
        const profils2: IProfils = { id: 456 };
        expectedResult = service.addProfilsToCollectionIfMissing([], profils, profils2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(profils);
        expect(expectedResult).toContain(profils2);
      });

      it('should accept null and undefined values', () => {
        const profils: IProfils = { id: 123 };
        expectedResult = service.addProfilsToCollectionIfMissing([], null, profils, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(profils);
      });

      it('should return initial array if no Profils is added', () => {
        const profilsCollection: IProfils[] = [{ id: 123 }];
        expectedResult = service.addProfilsToCollectionIfMissing(profilsCollection, undefined, null);
        expect(expectedResult).toEqual(profilsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
