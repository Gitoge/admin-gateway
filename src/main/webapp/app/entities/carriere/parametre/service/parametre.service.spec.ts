import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IParametre, Parametre } from '../parametre.model';

import { ParametreService } from './parametre.service';

describe('Parametre Service', () => {
  let service: ParametreService;
  let httpMock: HttpTestingController;
  let elemDefault: IParametre;
  let expectedResult: IParametre | IParametre[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParametreService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      valeur: 'AAAAAAA',
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

    it('should create a Parametre', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Parametre()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Parametre', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          valeur: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Parametre', () => {
      const patchObject = Object.assign({}, new Parametre());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Parametre', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          valeur: 'BBBBBB',
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

    it('should delete a Parametre', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParametreToCollectionIfMissing', () => {
      it('should add a Parametre to an empty array', () => {
        const parametre: IParametre = { id: 123 };
        expectedResult = service.addParametreToCollectionIfMissing([], parametre);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parametre);
      });

      it('should not add a Parametre to an array that contains it', () => {
        const parametre: IParametre = { id: 123 };
        const parametreCollection: IParametre[] = [
          {
            ...parametre,
          },
          { id: 456 },
        ];
        expectedResult = service.addParametreToCollectionIfMissing(parametreCollection, parametre);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Parametre to an array that doesn't contain it", () => {
        const parametre: IParametre = { id: 123 };
        const parametreCollection: IParametre[] = [{ id: 456 }];
        expectedResult = service.addParametreToCollectionIfMissing(parametreCollection, parametre);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parametre);
      });

      it('should add only unique Parametre to an array', () => {
        const parametreArray: IParametre[] = [{ id: 123 }, { id: 456 }, { id: 4048 }];
        const parametreCollection: IParametre[] = [{ id: 123 }];
        expectedResult = service.addParametreToCollectionIfMissing(parametreCollection, ...parametreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const parametre: IParametre = { id: 123 };
        const parametre2: IParametre = { id: 456 };
        expectedResult = service.addParametreToCollectionIfMissing([], parametre, parametre2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parametre);
        expect(expectedResult).toContain(parametre2);
      });

      it('should accept null and undefined values', () => {
        const parametre: IParametre = { id: 123 };
        expectedResult = service.addParametreToCollectionIfMissing([], null, parametre, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parametre);
      });

      it('should return initial array if no Parametre is added', () => {
        const parametreCollection: IParametre[] = [{ id: 123 }];
        expectedResult = service.addParametreToCollectionIfMissing(parametreCollection, undefined, null);
        expect(expectedResult).toEqual(parametreCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
