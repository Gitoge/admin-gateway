import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IUserExtended, UserExtended } from '../user-extended.model';

import { UserExtendedService } from './user-extended.service';

describe('UserExtended Service', () => {
  let service: UserExtendedService;
  let httpMock: HttpTestingController;
  let elemDefault: IUserExtended;
  let expectedResult: IUserExtended | IUserExtended[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(UserExtendedService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
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

    it('should create a UserExtended', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new UserExtended()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a UserExtended', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a UserExtended', () => {
      const patchObject = Object.assign({}, new UserExtended());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of UserExtended', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
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

    it('should delete a UserExtended', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addUserExtendedToCollectionIfMissing', () => {
      it('should add a UserExtended to an empty array', () => {
        const userExtended: IUserExtended = { id: 123 };
        expectedResult = service.addUserExtendedToCollectionIfMissing([], userExtended);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userExtended);
      });

      it('should not add a UserExtended to an array that contains it', () => {
        const userExtended: IUserExtended = { id: 123 };
        const userExtendedCollection: IUserExtended[] = [
          {
            ...userExtended,
          },
          { id: 456 },
        ];
        expectedResult = service.addUserExtendedToCollectionIfMissing(userExtendedCollection, userExtended);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a UserExtended to an array that doesn't contain it", () => {
        const userExtended: IUserExtended = { id: 123 };
        const userExtendedCollection: IUserExtended[] = [{ id: 456 }];
        expectedResult = service.addUserExtendedToCollectionIfMissing(userExtendedCollection, userExtended);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userExtended);
      });

      it('should add only unique UserExtended to an array', () => {
        const userExtendedArray: IUserExtended[] = [{ id: 123 }, { id: 456 }, { id: 3378 }];
        const userExtendedCollection: IUserExtended[] = [{ id: 123 }];
        expectedResult = service.addUserExtendedToCollectionIfMissing(userExtendedCollection, ...userExtendedArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const userExtended: IUserExtended = { id: 123 };
        const userExtended2: IUserExtended = { id: 456 };
        expectedResult = service.addUserExtendedToCollectionIfMissing([], userExtended, userExtended2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(userExtended);
        expect(expectedResult).toContain(userExtended2);
      });

      it('should accept null and undefined values', () => {
        const userExtended: IUserExtended = { id: 123 };
        expectedResult = service.addUserExtendedToCollectionIfMissing([], null, userExtended, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(userExtended);
      });

      it('should return initial array if no UserExtended is added', () => {
        const userExtendedCollection: IUserExtended[] = [{ id: 123 }];
        expectedResult = service.addUserExtendedToCollectionIfMissing(userExtendedCollection, undefined, null);
        expect(expectedResult).toEqual(userExtendedCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
