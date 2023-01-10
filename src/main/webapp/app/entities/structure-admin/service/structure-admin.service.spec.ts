import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStructureAdmin, StructureAdmin } from '../structure-admin.model';

import { StructureAdminService } from './structure-admin.service';

describe('StructureAdmin Service', () => {
  let service: StructureAdminService;
  let httpMock: HttpTestingController;
  let elemDefault: IStructureAdmin;
  let expectedResult: IStructureAdmin | IStructureAdmin[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StructureAdminService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
      direction: 'AAAAAAA',
      services: 'AAAAAAA',
      adresse: 'AAAAAAA',
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

    it('should create a StructureAdmin', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new StructureAdmin()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StructureAdmin', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          direction: 'BBBBBB',
          services: 'BBBBBB',
          adresse: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StructureAdmin', () => {
      const patchObject = Object.assign(
        {
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          services: 'BBBBBB',
          adresse: 'BBBBBB',
        },
        new StructureAdmin()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StructureAdmin', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          direction: 'BBBBBB',
          services: 'BBBBBB',
          adresse: 'BBBBBB',
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

    it('should delete a StructureAdmin', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStructureAdminToCollectionIfMissing', () => {
      it('should add a StructureAdmin to an empty array', () => {
        const structureAdmin: IStructureAdmin = { id: 123 };
        expectedResult = service.addStructureAdminToCollectionIfMissing([], structureAdmin);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(structureAdmin);
      });

      it('should not add a StructureAdmin to an array that contains it', () => {
        const structureAdmin: IStructureAdmin = { id: 123 };
        const structureAdminCollection: IStructureAdmin[] = [
          {
            ...structureAdmin,
          },
          { id: 456 },
        ];
        expectedResult = service.addStructureAdminToCollectionIfMissing(structureAdminCollection, structureAdmin);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StructureAdmin to an array that doesn't contain it", () => {
        const structureAdmin: IStructureAdmin = { id: 123 };
        const structureAdminCollection: IStructureAdmin[] = [{ id: 456 }];
        expectedResult = service.addStructureAdminToCollectionIfMissing(structureAdminCollection, structureAdmin);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(structureAdmin);
      });

      it('should add only unique StructureAdmin to an array', () => {
        const structureAdminArray: IStructureAdmin[] = [{ id: 123 }, { id: 456 }, { id: 39642 }];
        const structureAdminCollection: IStructureAdmin[] = [{ id: 123 }];
        expectedResult = service.addStructureAdminToCollectionIfMissing(structureAdminCollection, ...structureAdminArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const structureAdmin: IStructureAdmin = { id: 123 };
        const structureAdmin2: IStructureAdmin = { id: 456 };
        expectedResult = service.addStructureAdminToCollectionIfMissing([], structureAdmin, structureAdmin2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(structureAdmin);
        expect(expectedResult).toContain(structureAdmin2);
      });

      it('should accept null and undefined values', () => {
        const structureAdmin: IStructureAdmin = { id: 123 };
        expectedResult = service.addStructureAdminToCollectionIfMissing([], null, structureAdmin, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(structureAdmin);
      });

      it('should return initial array if no StructureAdmin is added', () => {
        const structureAdminCollection: IStructureAdmin[] = [{ id: 123 }];
        expectedResult = service.addStructureAdminToCollectionIfMissing(structureAdminCollection, undefined, null);
        expect(expectedResult).toEqual(structureAdminCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
