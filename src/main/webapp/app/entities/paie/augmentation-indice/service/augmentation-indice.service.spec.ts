import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAugmentationIndice, AugmentationIndice } from '../augmentation-indice.model';

import { AugmentationIndiceService } from './augmentation-indice.service';

describe('AugmentationIndice Service', () => {
  let service: AugmentationIndiceService;
  let httpMock: HttpTestingController;
  let elemDefault: IAugmentationIndice;
  let expectedResult: IAugmentationIndice | IAugmentationIndice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AugmentationIndiceService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      libelle: 'AAAAAAA',
      valeur: 0,
      idPoste: 0,
      total: 0,
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

    it('should create a AugmentationIndice', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new AugmentationIndice()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AugmentationIndice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          valeur: 1,
          idPoste: 1,
          total: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AugmentationIndice', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
        },
        new AugmentationIndice()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AugmentationIndice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          libelle: 'BBBBBB',
          valeur: 1,
          idPoste: 1,
          total: 1,
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

    it('should delete a AugmentationIndice', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAugmentationIndiceToCollectionIfMissing', () => {
      it('should add a AugmentationIndice to an empty array', () => {
        const augmentationIndice: IAugmentationIndice = { id: 123 };
        expectedResult = service.addAugmentationIndiceToCollectionIfMissing([], augmentationIndice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(augmentationIndice);
      });

      it('should not add a AugmentationIndice to an array that contains it', () => {
        const augmentationIndice: IAugmentationIndice = { id: 123 };
        const augmentationIndiceCollection: IAugmentationIndice[] = [
          {
            ...augmentationIndice,
          },
          { id: 456 },
        ];
        expectedResult = service.addAugmentationIndiceToCollectionIfMissing(augmentationIndiceCollection, augmentationIndice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AugmentationIndice to an array that doesn't contain it", () => {
        const augmentationIndice: IAugmentationIndice = { id: 123 };
        const augmentationIndiceCollection: IAugmentationIndice[] = [{ id: 456 }];
        expectedResult = service.addAugmentationIndiceToCollectionIfMissing(augmentationIndiceCollection, augmentationIndice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(augmentationIndice);
      });

      it('should add only unique AugmentationIndice to an array', () => {
        const augmentationIndiceArray: IAugmentationIndice[] = [{ id: 123 }, { id: 456 }, { id: 73407 }];
        const augmentationIndiceCollection: IAugmentationIndice[] = [{ id: 123 }];
        expectedResult = service.addAugmentationIndiceToCollectionIfMissing(augmentationIndiceCollection, ...augmentationIndiceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const augmentationIndice: IAugmentationIndice = { id: 123 };
        const augmentationIndice2: IAugmentationIndice = { id: 456 };
        expectedResult = service.addAugmentationIndiceToCollectionIfMissing([], augmentationIndice, augmentationIndice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(augmentationIndice);
        expect(expectedResult).toContain(augmentationIndice2);
      });

      it('should accept null and undefined values', () => {
        const augmentationIndice: IAugmentationIndice = { id: 123 };
        expectedResult = service.addAugmentationIndiceToCollectionIfMissing([], null, augmentationIndice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(augmentationIndice);
      });

      it('should return initial array if no AugmentationIndice is added', () => {
        const augmentationIndiceCollection: IAugmentationIndice[] = [{ id: 123 }];
        expectedResult = service.addAugmentationIndiceToCollectionIfMissing(augmentationIndiceCollection, undefined, null);
        expect(expectedResult).toEqual(augmentationIndiceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
