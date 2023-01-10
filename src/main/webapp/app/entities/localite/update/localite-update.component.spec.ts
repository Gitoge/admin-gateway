// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpResponse } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { FormBuilder } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { of, Subject, from } from 'rxjs';

// import { LocaliteService } from '../service/localite.service';
// import { ILocalite, Localite } from '../localite.model';
// import { ITypeLocalite } from 'app/entities/type-localite/type-localite.model';
// import { TypeLocaliteService } from 'app/entities/type-localite/service/type-localite.service';

// import { LocaliteUpdateComponent } from './localite-update.component';

// describe('Localite Management Update Component', () => {
//   let comp: LocaliteUpdateComponent;
//   let fixture: ComponentFixture<LocaliteUpdateComponent>;
//   let activatedRoute: ActivatedRoute;
//   let localiteService: LocaliteService;
//   let typeLocaliteService: TypeLocaliteService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
//       declarations: [LocaliteUpdateComponent],
//       providers: [
//         FormBuilder,
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             params: from([{}]),
//           },
//         },
//       ],
//     })
//       .overrideTemplate(LocaliteUpdateComponent, '')
//       .compileComponents();

//     fixture = TestBed.createComponent(LocaliteUpdateComponent);
//     activatedRoute = TestBed.inject(ActivatedRoute);
//     localiteService = TestBed.inject(LocaliteService);
//     typeLocaliteService = TestBed.inject(TypeLocaliteService);

//     comp = fixture.componentInstance;
//   });

//   describe('ngOnInit', () => {
//     it('Should call localite query and add missing value', () => {
//       const localite: ILocalite = { id: 456 };
//       const localite: ILocalite = { id: 47406 };
//       localite.localite = localite;

//       const localiteCollection: ILocalite[] = [{ id: 58607 }];
//       jest.spyOn(localiteService, 'query').mockReturnValue(of(new HttpResponse({ body: localiteCollection })));
//       const expectedCollection: ILocalite[] = [localite, ...localiteCollection];
//       jest.spyOn(localiteService, 'addLocaliteToCollectionIfMissing').mockReturnValue(expectedCollection);

//       activatedRoute.data = of({ localite });
//       comp.ngOnInit();

//       expect(localiteService.query).toHaveBeenCalled();
//       expect(localiteService.addLocaliteToCollectionIfMissing).toHaveBeenCalledWith(localiteCollection, localite);
//     //  expect(comp.localitesCollection).toEqual(expectedCollection);
//     });

//     it('Should call TypeLocalite query and add missing value', () => {
//       const localite: ILocalite = { id: 456 };
//       const typeLocalite: ITypeLocalite = { id: 81259 };
//       localite.typeLocalite = typeLocalite;

//       const typeLocaliteCollection: ITypeLocalite[] = [{ id: 89595 }];
//       jest.spyOn(typeLocaliteService, 'query').mockReturnValue(of(new HttpResponse({ body: typeLocaliteCollection })));
//       const additionalTypeLocalites = [typeLocalite];
//       const expectedCollection: ITypeLocalite[] = [...additionalTypeLocalites, ...typeLocaliteCollection];
//       jest.spyOn(typeLocaliteService, 'addTypeLocaliteToCollectionIfMissing').mockReturnValue(expectedCollection);

//       activatedRoute.data = of({ localite });
//       comp.ngOnInit();

//       expect(typeLocaliteService.query).toHaveBeenCalled();
//       expect(typeLocaliteService.addTypeLocaliteToCollectionIfMissing).toHaveBeenCalledWith(
//         typeLocaliteCollection,
//         ...additionalTypeLocalites
//       );
//       expect(comp.typeLocalitesSharedCollection).toEqual(expectedCollection);
//     });

//     it('Should update editForm', () => {
//       const localite: ILocalite = { id: 456 };
//       const localite: ILocalite = { id: 89923 };
//       localite.localite = localite;
//       const typeLocalite: ITypeLocalite = { id: 6148 };
//       localite.typeLocalite = typeLocalite;

//       activatedRoute.data = of({ localite });
//       comp.ngOnInit();

//       expect(comp.editForm.value).toEqual(expect.objectContaining(localite));
//       expect(comp.localitesCollection).toContain(localite);
//       expect(comp.typeLocalitesSharedCollection).toContain(typeLocalite);
//     });
//   });

//   describe('save', () => {
//     it('Should call update service on save for existing entity', () => {
//       // GIVEN
//       const saveSubject = new Subject<HttpResponse<Localite>>();
//       const localite = { id: 123 };
//       jest.spyOn(localiteService, 'update').mockReturnValue(saveSubject);
//       jest.spyOn(comp, 'previousState');
//       activatedRoute.data = of({ localite });
//       comp.ngOnInit();

//       // WHEN
//       comp.save();
//       expect(comp.isSaving).toEqual(true);
//       saveSubject.next(new HttpResponse({ body: localite }));
//       saveSubject.complete();

//       // THEN
//       expect(comp.previousState).toHaveBeenCalled();
//       expect(localiteService.update).toHaveBeenCalledWith(localite);
//       expect(comp.isSaving).toEqual(false);
//     });

//     it('Should call create service on save for new entity', () => {
//       // GIVEN
//       const saveSubject = new Subject<HttpResponse<Localite>>();
//       const localite = new Localite();
//       jest.spyOn(localiteService, 'create').mockReturnValue(saveSubject);
//       jest.spyOn(comp, 'previousState');
//       activatedRoute.data = of({ localite });
//       comp.ngOnInit();

//       // WHEN
//       comp.save();
//       expect(comp.isSaving).toEqual(true);
//       saveSubject.next(new HttpResponse({ body: localite }));
//       saveSubject.complete();

//       // THEN
//       expect(localiteService.create).toHaveBeenCalledWith(localite);
//       expect(comp.isSaving).toEqual(false);
//       expect(comp.previousState).toHaveBeenCalled();
//     });

//     it('Should set isSaving to false on error', () => {
//       // GIVEN
//       const saveSubject = new Subject<HttpResponse<Localite>>();
//       const localite = { id: 123 };
//       jest.spyOn(localiteService, 'update').mockReturnValue(saveSubject);
//       jest.spyOn(comp, 'previousState');
//       activatedRoute.data = of({ localite });
//       comp.ngOnInit();

//       // WHEN
//       comp.save();
//       expect(comp.isSaving).toEqual(true);
//       saveSubject.error('This is an error!');

//       // THEN
//       expect(localiteService.update).toHaveBeenCalledWith(localite);
//       expect(comp.isSaving).toEqual(false);
//       expect(comp.previousState).not.toHaveBeenCalled();
//     });
//   });

//   describe('Tracking relationships identifiers', () => {
//     describe('trackLocaliteById', () => {
//       it('Should return tracked Localite primary key', () => {
//         const entity = { id: 123 };
//         const trackResult = comp.trackLocaliteById(0, entity);
//         expect(trackResult).toEqual(entity.id);
//       });
//     });

//     describe('trackTypeLocaliteById', () => {
//       it('Should return tracked TypeLocalite primary key', () => {
//         const entity = { id: 123 };
//         const trackResult = comp.trackTypeLocaliteById(0, entity);
//         expect(trackResult).toEqual(entity.id);
//       });
//     });
//   });
// });
