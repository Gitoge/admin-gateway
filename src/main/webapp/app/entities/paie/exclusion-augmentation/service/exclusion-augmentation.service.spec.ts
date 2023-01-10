import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IExclusionAugmentation, ExclusionAugmentation } from '../exclusion-augmentation.model';

import { ExclusionAugmentationService } from './exclusion-augmentation.service';

describe('ExclusionAugmentation Service', () => {
  let service: ExclusionAugmentationService;
  let httpMock: HttpTestingController;
  let elemDefault: IExclusionAugmentation;
  let expectedResult: IExclusionAugmentation | IExclusionAugmentation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ExclusionAugmentationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      etablissementId: 0,
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

    it('should create a ExclusionAugmentation', () => {
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

      service.create(new ExclusionAugmentation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ExclusionAugmentation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          etablissementId: 1,
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

    it('should partial update a ExclusionAugmentation', () => {
      const patchObject = Object.assign(
        {
          etablissementId: 1,
          dateInsertId: currentDate.format(DATE_TIME_FORMAT),
        },
        new ExclusionAugmentation()
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

    it('should return a list of ExclusionAugmentation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          etablissementId: 1,
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

    it('should delete a ExclusionAugmentation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addExclusionAugmentationToCollectionIfMissing', () => {
      it('should add a ExclusionAugmentation to an empty array', () => {
        const exclusionAugmentation: IExclusionAugmentation = { id: 123 };
        expectedResult = service.addExclusionAugmentationToCollectionIfMissing([], exclusionAugmentation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exclusionAugmentation);
      });

      it('should not add a ExclusionAugmentation to an array that contains it', () => {
        const exclusionAugmentation: IExclusionAugmentation = { id: 123 };
        const exclusionAugmentationCollection: IExclusionAugmentation[] = [
          {
            ...exclusionAugmentation,
          },
          { id: 456 },
        ];
        expectedResult = service.addExclusionAugmentationToCollectionIfMissing(exclusionAugmentationCollection, exclusionAugmentation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ExclusionAugmentation to an array that doesn't contain it", () => {
        const exclusionAugmentation: IExclusionAugmentation = { id: 123 };
        const exclusionAugmentationCollection: IExclusionAugmentation[] = [{ id: 456 }];
        expectedResult = service.addExclusionAugmentationToCollectionIfMissing(exclusionAugmentationCollection, exclusionAugmentation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exclusionAugmentation);
      });

      it('should add only unique ExclusionAugmentation to an array', () => {
        const exclusionAugmentationArray: IExclusionAugmentation[] = [{ id: 123 }, { id: 456 }, { id: 19183 }];
        const exclusionAugmentationCollection: IExclusionAugmentation[] = [{ id: 123 }];
        expectedResult = service.addExclusionAugmentationToCollectionIfMissing(
          exclusionAugmentationCollection,
          ...exclusionAugmentationArray
        );
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const exclusionAugmentation: IExclusionAugmentation = { id: 123 };
        const exclusionAugmentation2: IExclusionAugmentation = { id: 456 };
        expectedResult = service.addExclusionAugmentationToCollectionIfMissing([], exclusionAugmentation, exclusionAugmentation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(exclusionAugmentation);
        expect(expectedResult).toContain(exclusionAugmentation2);
      });

      it('should accept null and undefined values', () => {
        const exclusionAugmentation: IExclusionAugmentation = { id: 123 };
        expectedResult = service.addExclusionAugmentationToCollectionIfMissing([], null, exclusionAugmentation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(exclusionAugmentation);
      });

      it('should return initial array if no ExclusionAugmentation is added', () => {
        const exclusionAugmentationCollection: IExclusionAugmentation[] = [{ id: 123 }];
        expectedResult = service.addExclusionAugmentationToCollectionIfMissing(exclusionAugmentationCollection, undefined, null);
        expect(expectedResult).toEqual(exclusionAugmentationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
