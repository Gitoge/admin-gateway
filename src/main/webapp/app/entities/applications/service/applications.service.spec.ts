import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IApplications, Applications } from '../applications.model';

import { ApplicationsService } from './applications.service';

describe('Applications Service', () => {
  let service: ApplicationsService;
  let httpMock: HttpTestingController;
  let elemDefault: IApplications;
  let expectedResult: IApplications | IApplications[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ApplicationsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      nom: 'AAAAAAA',
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

    it('should create a Applications', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Applications()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Applications', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          nom: 'BBBBBB',
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

    it('should partial update a Applications', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          description: 'BBBBBB',
        },
        new Applications()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Applications', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          nom: 'BBBBBB',
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

    it('should delete a Applications', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addApplicationsToCollectionIfMissing', () => {
      it('should add a Applications to an empty array', () => {
        const applications: IApplications = { id: 123 };
        expectedResult = service.addApplicationsToCollectionIfMissing([], applications);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(applications);
      });

      it('should not add a Applications to an array that contains it', () => {
        const applications: IApplications = { id: 123 };
        const applicationsCollection: IApplications[] = [
          {
            ...applications,
          },
          { id: 456 },
        ];
        expectedResult = service.addApplicationsToCollectionIfMissing(applicationsCollection, applications);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Applications to an array that doesn't contain it", () => {
        const applications: IApplications = { id: 123 };
        const applicationsCollection: IApplications[] = [{ id: 456 }];
        expectedResult = service.addApplicationsToCollectionIfMissing(applicationsCollection, applications);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(applications);
      });

      it('should add only unique Applications to an array', () => {
        const applicationsArray: IApplications[] = [{ id: 123 }, { id: 456 }, { id: 14313 }];
        const applicationsCollection: IApplications[] = [{ id: 123 }];
        expectedResult = service.addApplicationsToCollectionIfMissing(applicationsCollection, ...applicationsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const applications: IApplications = { id: 123 };
        const applications2: IApplications = { id: 456 };
        expectedResult = service.addApplicationsToCollectionIfMissing([], applications, applications2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(applications);
        expect(expectedResult).toContain(applications2);
      });

      it('should accept null and undefined values', () => {
        const applications: IApplications = { id: 123 };
        expectedResult = service.addApplicationsToCollectionIfMissing([], null, applications, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(applications);
      });

      it('should return initial array if no Applications is added', () => {
        const applicationsCollection: IApplications[] = [{ id: 123 }];
        expectedResult = service.addApplicationsToCollectionIfMissing(applicationsCollection, undefined, null);
        expect(expectedResult).toEqual(applicationsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
