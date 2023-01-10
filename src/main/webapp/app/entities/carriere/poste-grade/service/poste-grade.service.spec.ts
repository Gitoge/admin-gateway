import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPosteGrade, PosteGrade } from '../poste-grade.model';

import { PosteGradeService } from './poste-grade.service';

describe('PosteGrade Service', () => {
  let service: PosteGradeService;
  let httpMock: HttpTestingController;
  let elemDefault: IPosteGrade;
  let expectedResult: IPosteGrade | IPosteGrade[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PosteGradeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      codeGrade: 'AAAAAAA',
      codePoste: 'AAAAAAA',
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

    it('should create a PosteGrade', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PosteGrade()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PosteGrade', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codeGrade: 'BBBBBB',
          codePoste: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PosteGrade', () => {
      const patchObject = Object.assign(
        {
          codePoste: 'BBBBBB',
        },
        new PosteGrade()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PosteGrade', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          codeGrade: 'BBBBBB',
          codePoste: 'BBBBBB',
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

    it('should delete a PosteGrade', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPosteGradeToCollectionIfMissing', () => {
      it('should add a PosteGrade to an empty array', () => {
        const posteGrade: IPosteGrade = { id: 123 };
        expectedResult = service.addPosteGradeToCollectionIfMissing([], posteGrade);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(posteGrade);
      });

      it('should not add a PosteGrade to an array that contains it', () => {
        const posteGrade: IPosteGrade = { id: 123 };
        const posteGradeCollection: IPosteGrade[] = [
          {
            ...posteGrade,
          },
          { id: 456 },
        ];
        expectedResult = service.addPosteGradeToCollectionIfMissing(posteGradeCollection, posteGrade);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PosteGrade to an array that doesn't contain it", () => {
        const posteGrade: IPosteGrade = { id: 123 };
        const posteGradeCollection: IPosteGrade[] = [{ id: 456 }];
        expectedResult = service.addPosteGradeToCollectionIfMissing(posteGradeCollection, posteGrade);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(posteGrade);
      });

      it('should add only unique PosteGrade to an array', () => {
        const posteGradeArray: IPosteGrade[] = [{ id: 123 }, { id: 456 }, { id: 3868 }];
        const posteGradeCollection: IPosteGrade[] = [{ id: 123 }];
        expectedResult = service.addPosteGradeToCollectionIfMissing(posteGradeCollection, ...posteGradeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const posteGrade: IPosteGrade = { id: 123 };
        const posteGrade2: IPosteGrade = { id: 456 };
        expectedResult = service.addPosteGradeToCollectionIfMissing([], posteGrade, posteGrade2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(posteGrade);
        expect(expectedResult).toContain(posteGrade2);
      });

      it('should accept null and undefined values', () => {
        const posteGrade: IPosteGrade = { id: 123 };
        expectedResult = service.addPosteGradeToCollectionIfMissing([], null, posteGrade, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(posteGrade);
      });

      it('should return initial array if no PosteGrade is added', () => {
        const posteGradeCollection: IPosteGrade[] = [{ id: 123 }];
        expectedResult = service.addPosteGradeToCollectionIfMissing(posteGradeCollection, undefined, null);
        expect(expectedResult).toEqual(posteGradeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
