import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPositions, Positions } from '../positions.model';

import { PositionsService } from './positions.service';

describe('Positions Service', () => {
  let service: PositionsService;
  let httpMock: HttpTestingController;
  let elemDefault: IPositions;
  let expectedResult: IPositions | IPositions[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PositionsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      code: 'AAAAAAA',
      libelle: 'AAAAAAA',
      description: 'AAAAAAA',
      typeAgent: 'AAAAAAA',
      impactSolde: 0,
      statutPosition: false,
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

    it('should create a Positions', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Positions()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Positions', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          typeAgent: 'BBBBBB',
          impactSolde: 1,
          statutPosition: true,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Positions', () => {
      const patchObject = Object.assign(
        {
          code: 'BBBBBB',
          description: 'BBBBBB',
        },
        new Positions()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Positions', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          code: 'BBBBBB',
          libelle: 'BBBBBB',
          description: 'BBBBBB',
          typeAgent: 'BBBBBB',
          impactSolde: 1,
          statutPosition: true,
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

    it('should delete a Positions', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPositionsToCollectionIfMissing', () => {
      it('should add a Positions to an empty array', () => {
        const positions: IPositions = { id: 123 };
        expectedResult = service.addPositionsToCollectionIfMissing([], positions);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(positions);
      });

      it('should not add a Positions to an array that contains it', () => {
        const positions: IPositions = { id: 123 };
        const positionsCollection: IPositions[] = [
          {
            ...positions,
          },
          { id: 456 },
        ];
        expectedResult = service.addPositionsToCollectionIfMissing(positionsCollection, positions);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Positions to an array that doesn't contain it", () => {
        const positions: IPositions = { id: 123 };
        const positionsCollection: IPositions[] = [{ id: 456 }];
        expectedResult = service.addPositionsToCollectionIfMissing(positionsCollection, positions);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(positions);
      });

      it('should add only unique Positions to an array', () => {
        const positionsArray: IPositions[] = [{ id: 123 }, { id: 456 }, { id: 21827 }];
        const positionsCollection: IPositions[] = [{ id: 123 }];
        expectedResult = service.addPositionsToCollectionIfMissing(positionsCollection, ...positionsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const positions: IPositions = { id: 123 };
        const positions2: IPositions = { id: 456 };
        expectedResult = service.addPositionsToCollectionIfMissing([], positions, positions2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(positions);
        expect(expectedResult).toContain(positions2);
      });

      it('should accept null and undefined values', () => {
        const positions: IPositions = { id: 123 };
        expectedResult = service.addPositionsToCollectionIfMissing([], null, positions, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(positions);
      });

      it('should return initial array if no Positions is added', () => {
        const positionsCollection: IPositions[] = [{ id: 123 }];
        expectedResult = service.addPositionsToCollectionIfMissing(positionsCollection, undefined, null);
        expect(expectedResult).toEqual(positionsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
