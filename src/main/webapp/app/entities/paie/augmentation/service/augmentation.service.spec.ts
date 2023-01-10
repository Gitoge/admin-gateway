import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IAugmentation, Augmentation } from '../augmentation.model';

import { AugmentationService } from './augmentation.service';

describe('Augmentation Service', () => {
  let service: AugmentationService;
  let httpMock: HttpTestingController;
  let elemDefault: IAugmentation;
  let expectedResult: IAugmentation | IAugmentation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AugmentationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      codePoste: 'AAAAAAA',
      montant: 0,
      reference: 'AAAAAAA',
      posteId: 0,
      userInsertId: 0,
      userUpdateId: 0,
      dateInsertId: currentDate,
      dateUpdateId: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
          dateUpdateId: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Augmentation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
          dateUpdateId: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsertId: currentDate,
          dateUpdateId: currentDate,
        },
        returnedFromService
      );

      service.create(new Augmentation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Augmentation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          montant: 1,
          reference: 'BBBBBB',
          posteId: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
          dateUpdateId: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsertId: currentDate,
          dateUpdateId: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Augmentation', () => {
      const patchObject = Object.assign(
        {
          posteId: 1,
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
        },
        new Augmentation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateInsertId: currentDate,
          dateUpdateId: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Augmentation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codePoste: 'BBBBBB',
          montant: 1,
          reference: 'BBBBBB',
          posteId: 1,
          userInsertId: 1,
          userUpdateId: 1,
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
          dateUpdateId: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateInsertId: currentDate,
          dateUpdateId: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Augmentation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAugmentationToCollectionIfMissing', () => {
      it('should add a Augmentation to an empty array', () => {
        const augmentation: IAugmentation = { id: 123 };
        expectedResult = service.addAugmentationToCollectionIfMissing([], augmentation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(augmentation);
      });

      it('should not add a Augmentation to an array that contains it', () => {
        const augmentation: IAugmentation = { id: 123 };
        const augmentationCollection: IAugmentation[] = [
          {
            ...augmentation,
          },
          { id: 456 },
        ];
        expectedResult = service.addAugmentationToCollectionIfMissing(augmentationCollection, augmentation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Augmentation to an array that doesn't contain it", () => {
        const augmentation: IAugmentation = { id: 123 };
        const augmentationCollection: IAugmentation[] = [{ id: 456 }];
        expectedResult = service.addAugmentationToCollectionIfMissing(augmentationCollection, augmentation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(augmentation);
      });

      it('should add only unique Augmentation to an array', () => {
        const augmentationArray: IAugmentation[] = [{ id: 123 }, { id: 456 }, { id: 8946 }];
        const augmentationCollection: IAugmentation[] = [{ id: 123 }];
        expectedResult = service.addAugmentationToCollectionIfMissing(augmentationCollection, ...augmentationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const augmentation: IAugmentation = { id: 123 };
        const augmentation2: IAugmentation = { id: 456 };
        expectedResult = service.addAugmentationToCollectionIfMissing([], augmentation, augmentation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(augmentation);
        expect(expectedResult).toContain(augmentation2);
      });

      it('should accept null and undefined values', () => {
        const augmentation: IAugmentation = { id: 123 };
        expectedResult = service.addAugmentationToCollectionIfMissing([], null, augmentation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(augmentation);
      });

      it('should return initial array if no Augmentation is added', () => {
        const augmentationCollection: IAugmentation[] = [{ id: 123 }];
        expectedResult = service.addAugmentationToCollectionIfMissing(augmentationCollection, undefined, null);
        expect(expectedResult).toEqual(augmentationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
