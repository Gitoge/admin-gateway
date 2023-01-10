import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAugmentationHierarchie, AugmentationHierarchie } from '../augmentation-hierarchie.model';

import { AugmentationHierarchieService } from './augmentation-hierarchie.service';

describe('AugmentationHierarchie Service', () => {
  let service: AugmentationHierarchieService;
  let httpMock: HttpTestingController;
  let elemDefault: IAugmentationHierarchie;
  let expectedResult: IAugmentationHierarchie | IAugmentationHierarchie[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AugmentationHierarchieService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      montant: 0,
      augmentationId: 0,
      hierarchieId: 0,
      userInserId: 0,
      dateInsert: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a AugmentationHierarchie', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
        },
        returnedFromService
      );

      service.create(new AugmentationHierarchie()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a AugmentationHierarchie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          montant: 1,
          augmentationId: 1,
          hierarchieId: 1,
          userInserId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a AugmentationHierarchie', () => {
      const patchObject = Object.assign(
        {
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        new AugmentationHierarchie()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateInsert: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of AugmentationHierarchie', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          montant: 1,
          augmentationId: 1,
          hierarchieId: 1,
          userInserId: 1,
          dateInsert: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsert: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a AugmentationHierarchie', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAugmentationHierarchieToCollectionIfMissing', () => {
      it('should add a AugmentationHierarchie to an empty array', () => {
        const augmentationHierarchie: IAugmentationHierarchie = { id: 123 };
        expectedResult = service.addAugmentationHierarchieToCollectionIfMissing([], augmentationHierarchie);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(augmentationHierarchie);
      });

      it('should not add a AugmentationHierarchie to an array that contains it', () => {
        const augmentationHierarchie: IAugmentationHierarchie = { id: 123 };
        const augmentationHierarchieCollection: IAugmentationHierarchie[] = [
          {
            ...augmentationHierarchie,
          },
          { id: 456 },
        ];
        expectedResult = service.addAugmentationHierarchieToCollectionIfMissing(augmentationHierarchieCollection, augmentationHierarchie);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a AugmentationHierarchie to an array that doesn't contain it", () => {
        const augmentationHierarchie: IAugmentationHierarchie = { id: 123 };
        const augmentationHierarchieCollection: IAugmentationHierarchie[] = [{ id: 456 }];
        expectedResult = service.addAugmentationHierarchieToCollectionIfMissing(augmentationHierarchieCollection, augmentationHierarchie);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(augmentationHierarchie);
      });

      it('should add only unique AugmentationHierarchie to an array', () => {
        const augmentationHierarchieArray: IAugmentationHierarchie[] = [{ id: 123 }, { id: 456 }, { id: 1617 }];
        const augmentationHierarchieCollection: IAugmentationHierarchie[] = [{ id: 123 }];
        expectedResult = service.addAugmentationHierarchieToCollectionIfMissing(
          augmentationHierarchieCollection,
          ...augmentationHierarchieArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const augmentationHierarchie: IAugmentationHierarchie = { id: 123 };
        const augmentationHierarchie2: IAugmentationHierarchie = { id: 456 };
        expectedResult = service.addAugmentationHierarchieToCollectionIfMissing([], augmentationHierarchie, augmentationHierarchie2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(augmentationHierarchie);
        expect(expectedResult).toContain(augmentationHierarchie2);
      });

      it('should accept null and undefined values', () => {
        const augmentationHierarchie: IAugmentationHierarchie = { id: 123 };
        expectedResult = service.addAugmentationHierarchieToCollectionIfMissing([], null, augmentationHierarchie, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(augmentationHierarchie);
      });

      it('should return initial array if no AugmentationHierarchie is added', () => {
        const augmentationHierarchieCollection: IAugmentationHierarchie[] = [{ id: 123 }];
        expectedResult = service.addAugmentationHierarchieToCollectionIfMissing(augmentationHierarchieCollection, undefined, null);
        expect(expectedResult).toEqual(augmentationHierarchieCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
