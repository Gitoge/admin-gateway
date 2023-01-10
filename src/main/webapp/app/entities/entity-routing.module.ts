import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AugmentationBaremeModule } from './paie/augmentation-bareme/augmentation-bareme.module';
import { AugmentationHierarchieModule } from './paie/augmentation-hierarchie/augmentation-hierarchie.module';
import { PosteCompoGradeModule } from './paie/poste-compo-grade/poste-compo-grade.module';
import { AugmentationModule } from './paie/augmentation/augmentation.module';
import { ExclusionAugmentationModule } from './paie/exclusion-augmentation/exclusion-augmentation.module';
import { ParametreModule } from './carriere/parametre/parametre.module';
import { AvancementModule } from './carriere/avancement/avancement.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'applications',
        data: { pageTitle: 'admingatewayApp.applications.home.title' },
        loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule),
      },
      {
        path: 'modules',
        data: { pageTitle: 'admingatewayApp.modules.home.title' },
        loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule),
      },
      {
        path: 'profils',
        data: { pageTitle: 'admingatewayApp.profils.home.title' },
        loadChildren: () => import('./profils/profils.module').then(m => m.ProfilsModule),
      },
      {
        path: 'region',
        data: { pageTitle: 'region' },
        loadChildren: () => import('./region/region.module').then(m => m.RegionModule),
      },
      {
        path: 'departement',
        data: { pageTitle: 'departement' },
        loadChildren: () => import('./departement/departement.module').then(m => m.DepartementModule),
      },
      {
        path: 'arrondissement',
        data: { pageTitle: 'arrondissement' },
        loadChildren: () => import('./arrondissement/arrondissement.module').then(m => m.ArrondissementModule),
      },
      {
        path: 'roles',
        data: { pageTitle: 'admingatewayApp.roles.home.title' },
        loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule),
      },
      {
        path: 'pages',
        data: { pageTitle: 'admingatewayApp.pages.home.title' },
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
      },
      {
        path: 'actions',
        data: { pageTitle: 'admingatewayApp.actions.home.title' },
        loadChildren: () => import('./actions/actions.module').then(m => m.ActionsModule),
      },
      {
        path: 'personne',
        data: { pageTitle: 'admingatewayApp.personne.home.title' },
        loadChildren: () => import('./personne/personne.module').then(m => m.PersonneModule),
      },
      {
        path: 'structure-admin',
        data: { pageTitle: 'admingatewayApp.structureAdmin.home.title' },
        loadChildren: () => import('./structure-admin/structure-admin.module').then(m => m.StructureAdminModule),
      },
      {
        path: 'classe',
        data: { pageTitle: 'admingatewayApp.classe.home.title' },
        loadChildren: () => import('./classe/classe.module').then(m => m.ClasseModule),
      },
      {
        path: 'cadre',
        data: { pageTitle: 'admingatewayApp.cadre.home.title' },
        loadChildren: () => import('./cadre/cadre.module').then(m => m.CadreModule),
      },
      {
        path: 'corps',
        data: { pageTitle: 'admingatewayApp.corps.home.title' },
        loadChildren: () => import('./corps/corps.module').then(m => m.CorpsModule),
      },
      {
        path: 'destinataires',
        data: { pageTitle: 'admingatewayApp.destinataires.home.title' },
        loadChildren: () => import('./destinataires/destinataires.module').then(m => m.DestinatairesModule),
      },
      {
        path: 'direction',
        data: { pageTitle: 'admingatewayApp.destinataires.home.title' },
        loadChildren: () => import('./direction/direction.module').then(m => m.DirectionModule),
      },
      {
        path: 'echelon',
        data: { pageTitle: 'admingatewayApp.echelon.home.title' },
        loadChildren: () => import('./echelon/echelon.module').then(m => m.EchelonModule),
      },
      {
        path: 'param-parts-fiscales',
        data: { pageTitle: 'Parts Fiscales' },
        loadChildren: () => import('./param-parts-fiscales/param-parts-fiscales.module').then(m => m.ParamPartsFiscalesModule),
      },
      {
        path: 'param-quotite-cessible',
        data: { pageTitle: 'Quotites Cessibles' },
        loadChildren: () => import('./param-quotite-cessible/param-quotite-cessible.module').then(m => m.ParamQuotiteCessibleModule),
      },
      {
        path: 'emplois',
        data: { pageTitle: 'admingatewayApp.emplois.home.title' },
        loadChildren: () => import('./emplois/emplois.module').then(m => m.EmploisModule),
      },
      {
        path: 'etablissement',
        data: { pageTitle: 'admingatewayApp.etablissements.home.title' },
        loadChildren: () => import('./etablissement/etablissement.module').then(m => m.EtablissementModule),
      },
      {
        path: 'grade',
        data: { pageTitle: 'admingatewayApp.grade.home.title' },
        loadChildren: () => import('./grade/grade.module').then(m => m.GradeModule),
      },
      {
        path: 'hierarchie',
        data: { pageTitle: 'Hierarchie' },
        loadChildren: () => import('./hierarchie/hierarchie.module').then(m => m.HierarchieModule),
      },
      {
        path: 'postes-references-actes',
        data: { pageTitle: 'postes-references-actes' },
        loadChildren: () => import('./postes-reference-actes/postes-reference-actes.module').then(m => m.PostesReferenceActesModule),
      },
      {
        path: 'localite',
        data: { pageTitle: 'admingatewayApp.localite.home.title' },
        loadChildren: () => import('./localite/localite.module').then(m => m.LocaliteModule),
      },
      {
        path: 'positions',
        data: { pageTitle: 'admingatewayApp.positions.home.title' },
        loadChildren: () => import('./positions/positions.module').then(m => m.PositionsModule),
      },
      {
        path: 'type-positions',
        data: { pageTitle: 'admingatewayApp.typePosition.home.title' },
        loadChildren: () => import('./type-position/type-position.module').then(m => m.TypePositionModule),
      },
      {
        path: 'reglement',
        data: { pageTitle: 'admingatewayApp.reglement.home.title' },
        loadChildren: () => import('./reglement/reglement.module').then(m => m.ReglementModule),
      },
      {
        path: 'service',
        data: { pageTitle: 'admingatewayApp.service.home.title' },
        loadChildren: () => import('./service/service.module').then(m => m.ServiceModule),
      },
      {
        path: 'table-valeur',
        data: { pageTitle: 'admingatewayApp.table-valeur.home.title' },
        loadChildren: () => import('./table-valeur/table-valeur.module').then(m => m.TableValeurModule),
      },
      {
        path: 'table-type-valeur',
        data: { pageTitle: 'admingatewayApp.table-type-valeur.home.title' },
        loadChildren: () => import('./table-type-valeur/table-type-valeur.module').then(m => m.TableTypeValeurModule),
      },
      {
        path: 'type-destinataires',
        data: { pageTitle: 'admingatewayApp.type-destinataires.home.title' },
        loadChildren: () => import('./type-destinataires/type-destinataires.module').then(m => m.TypeDestinatairesModule),
      },
      {
        path: 'agence',
        data: { pageTitle: 'agence' },
        loadChildren: () => import('./agence/agence.module').then(m => m.AgenceModule),
      },
      {
        path: 'hierarchie-categorie',
        data: { pageTitle: 'hierarchie-categorie' },
        loadChildren: () => import('./hierarchie-categorie/hierarchie-categorie.module').then(m => m.HierarchieCategorieModule),
      },
      {
        path: 'type-etablissement',
        data: { pageTitle: 'admingatewayApp.type-etablissement.home.title' },
        loadChildren: () => import('./type-etablissement/type-etablissement.module').then(m => m.TypeEtablissementModule),
      },
      {
        path: 'type-localite',
        data: { pageTitle: 'admingatewayApp.type-localite.home.title' },
        loadChildren: () => import('./type-localite/type-localite.module').then(m => m.TypeLocaliteModule),
      },
      {
        path: 'type-reglement',
        data: { pageTitle: 'admingatewayApp.type-reglement.home.title' },
        loadChildren: () => import('./type-reglement/type-reglement.module').then(m => m.TypeReglementModule),
      },
      {
        path: 'postes',
        data: { pageTitle: 'postes' },
        loadChildren: () => import('./postes/postes.module').then(m => m.PostesModule),
      },
      {
        path: 'postes-non-cumulabe',
        data: { pageTitle: 'postes-non-cumulabe' },
        loadChildren: () => import('./postes-non-cumulabe/postes-non-cumulabe.module').then(m => m.PostesNonCumulabeModule),
      },
      {
        path: 'billeteur',
        data: { pageTitle: 'billeteur' },
        loadChildren: () => import('./billeteur/billeteur.module').then(m => m.BilleteurModule),
      },
      {
        path: 'etablissement-bancaire',
        data: { pageTitle: 'etablissement-bancaire' },
        loadChildren: () => import('./etablissement-bancaire/etablissement-bancaire.module').then(m => m.EtablissementBancaireModule),
      },
      {
        path: 'param-matricules',
        data: { pageTitle: 'param-matricules' },
        loadChildren: () => import('./carriere/param-matricules/param-matricules.module').then(m => m.CarriereParamMatriculesModule),
      },
      {
        path: 'parametre',
        data: { pageTitle: 'parametre' },
        loadChildren: () => import('./carriere/parametre/parametre.module').then(m => m.ParametreModule),
      },
      {
        path: 'document-administratif',
        data: { pageTitle: 'document-administratif' },
        loadChildren: () =>
          import('./carriere/document-administratif/document-administratif.module').then(m => m.DocumentAdministratifModule),
      },
      {
        path: 'agent',
        data: { pageTitle: 'agent' },
        loadChildren: () => import('./carriere/agent/agent.module').then(m => m.CarriereAgentModule),
      },
      {
        path: 'grille-solde-global',
        data: { pageTitle: 'grille solde global' },
        loadChildren: () =>
          import('./carriere/grille-solde-global/grille-solde-global.module').then(m => m.CarriereGrilleSoldeGlobalModule),
      },
      {
        path: 'grille-convention',
        data: { pageTitle: 'grille convention' },
        loadChildren: () => import('./carriere/grille-convention/grille-convention.module').then(m => m.CarriereGrilleConventionModule),
      },

      {
        path: 'nationalite',
        data: { pageTitle: 'nationalite' },
        loadChildren: () => import('./carriere/nationalite/nationalite.module').then(m => m.CarriereNationaliteModule),
      },
      {
        path: 'enfant',
        data: { pageTitle: 'enfant' },
        loadChildren: () => import('./carriere/enfant/enfant.module').then(m => m.CarriereEnfantModule),
      },
      {
        path: 'natureActes',
        data: { pageTitle: 'natureActes' },
        loadChildren: () => import('./carriere/nature-actes/nature-actes.module').then(m => m.CarriereNatureActesModule),
      },
      {
        path: 'prise-en-compte',
        data: { pageTitle: 'Prise En Compte' },
        loadChildren: () => import('./carriere/prise-en-compte/prise-en-compte.module').then(m => m.CarrierePriseEnCompteModule),
      },
      {
        path: 'type-actes',
        data: { pageTitle: 'type-actes' },
        loadChildren: () => import('./carriere/type-actes/type-actes.module').then(m => m.CarriereTypeActesModule),
      },
      {
        path: 'categorie-agent',
        data: { pageTitle: 'categorie-agent' },
        loadChildren: () => import('./carriere/categorie-agent/categorie-agent.module').then(m => m.CarriereCategorieAgentModule),
      },
      {
        path: 'categorie-actes',
        data: { pageTitle: 'categorie-actes' },
        loadChildren: () => import('./carriere/categorie-actes/categorie-actes.module').then(m => m.CarriereCategorieActesModule),
      },
      {
        path: 'nature-actes',
        data: { pageTitle: 'Nature-Actes' },
        loadChildren: () => import('./carriere/nature-actes/nature-actes.module').then(m => m.CarriereNatureActesModule),
      },
      {
        path: 'actes',
        data: { pageTitle: 'Actes' },
        loadChildren: () => import('./carriere/actes/actes.module').then(m => m.CarriereActesModule),
      },
      {
        path: 'convention',
        data: { pageTitle: 'Conventions' },
        loadChildren: () => import('./carriere/convention/convention.module').then(m => m.CarriereConventionModule),
      },

      {
        path: 'type-grille',
        data: { pageTitle: 'type-grille' },
        loadChildren: () => import('./carriere/type-grille/type-grille.module').then(m => m.CarriereTypeGrilleModule),
      },

      {
        path: 'grille-indiciaire',
        data: { pageTitle: 'Grille Indiciaire' },
        loadChildren: () => import('./carriere/grille-indiciaire/grille-indiciaire.module').then(m => m.CarriereGrilleIndiciaireModule),
      },
      {
        path: 'type-grille',
        data: { pageTitle: 'Type grille' },
        loadChildren: () => import('./carriere/type-grille/type-grille.module').then(m => m.CarriereTypeGrilleModule),
      },
      {
        path: 'affectation',
        data: { pageTitle: 'affectation' },
        loadChildren: () => import('./carriere/affectation/affectation.module').then(m => m.CarriereAffectationModule),
      },

      {
        path: 'grille-convention',
        data: { pageTitle: 'Grille Liée Convention' },
        loadChildren: () => import('./carriere/grille-convention/grille-convention.module').then(m => m.CarriereGrilleConventionModule),
      },
      {
        path: 'indices',
        data: { pageTitle: 'Indices' },
        loadChildren: () => import('./carriere/indices/indices.module').then(m => m.CarriereIndicesModule),
      },
      {
        path: 'categorie-agent',
        data: { pageTitle: 'Catégorie Agents' },
        loadChildren: () => import('./carriere/categorie-agent/categorie-agent.module').then(m => m.CarriereCategorieAgentModule),
      },
      {
        path: 'poste-grade',
        data: { pageTitle: 'Poste Grade' },
        loadChildren: () => import('./carriere/poste-grade/poste-grade.module').then(m => m.PosteGradeModule),
      },
      {
        path: 'avancement',
        data: { pageTitle: 'avancement' },
        loadChildren: () => import('./carriere/avancement/avancement.module').then(m => m.AvancementModule),
      },

      // Paie
      {
        path: 'emoluments',
        data: { pageTitle: 'Emolument' },
        loadChildren: () => import('./paie/emoluments/emoluments.module').then(m => m.PaieEmolumentsModule),
      },
      {
        path: 'histo-augmentation',
        data: { pageTitle: 'histo-augmentation' },
        loadChildren: () => import('./paie/histo-augmentation/histo-augmentation.module').then(m => m.HistoAugmentationModule),
      },
      {
        path: 'exclusion-taux',
        data: { pageTitle: 'Exclusion Taux' },
        loadChildren: () => import('./paie/exclusion-taux/exclusion-taux.module').then(m => m.ExclusionTauxModule),
      },
      {
        path: 'exercice',
        data: { pageTitle: 'Exercice' },
        loadChildren: () => import('./paie/exercice/exercice.module').then(m => m.PaieExerciceModule),
      },
      {
        path: 'saisie-emoluments',
        data: { pageTitle: 'saisie-emolument' },
        loadChildren: () => import('./paie/saisie-emoluments/saisie-emoluments.module').then(m => m.PaieSaisieEmolumentsModule),
      },
      {
        path: 'saisie-elements-variables',
        data: { pageTitle: 'saisie-elements-variables' },
        loadChildren: () =>
          import('./paie/saisie-elements-variables/saisie-elements-variables.module').then(m => m.PaieSaisieElementsVariablesModule),
      },
      {
        path: 'augmentation-indice',
        data: { pageTitle: 'Augmentation Indice' },
        loadChildren: () => import('./paie/augmentation-indice/augmentation-indice.module').then(m => m.AugmentationIndiceModule),
      },
      {
        path: 'categorie',
        data: { pageTitle: 'Categorie' },
        loadChildren: () => import('./categorie/categorie.module').then(m => m.CategorieModule),
      },

      {
        path: 'evenement',
        data: { pageTitle: 'evenement' },
        loadChildren: () => import('./carriere/evenement/evenement.module').then(m => m.CarriereEvenementModule),
      },
      {
        path: 'exercice',
        data: { pageTitle: 'exercice' },
        loadChildren: () => import('./paie/exercice/exercice.module').then(m => m.PaieExerciceModule),
      },
      {
        path: 'periode-paye',
        data: { pageTitle: 'periode-paye' },
        loadChildren: () => import('./paie/periode-paye/periode-paye.module').then(m => m.PaiePeriodePayeModule),
      },
      {
        path: 'fiche-paie',
        data: { pageTitle: 'fiche-paie' },
        loadChildren: () => import('./paie/fiche-paie/fiche-paie.module').then(m => m.PaieFichePaieModule),
      },
      {
        path: 'assiettes',
        data: { pageTitle: 'assiettes' },
        loadChildren: () => import('./assiettes/assiettes.module').then(m => m.AssiettesModule),
      },
      {
        path: 'agence',
        data: { pageTitle: 'agence' },
        loadChildren: () => import('./agence/agence.module').then(m => m.AgenceModule),
      },
      {
        path: 'augmentation-bareme',
        data: { pageTitle: 'augmentation-bareme' },
        loadChildren: () => import('./paie/augmentation-bareme/augmentation-bareme.module').then(m => AugmentationBaremeModule),
      },
      {
        path: 'augmentation-hierarchie',
        data: { pageTitle: 'augmentation-hierarchie' },
        loadChildren: () => import('./paie/augmentation-hierarchie/augmentation-hierarchie.module').then(m => AugmentationHierarchieModule),
      },
      {
        path: 'poste-compo-grade',
        data: { pageTitle: 'poste-compo-grade' },
        loadChildren: () => import('./paie/poste-compo-grade/poste-compo-grade.module').then(m => PosteCompoGradeModule),
      },
      {
        path: 'augmentation',
        data: { pageTitle: 'augmentation' },
        loadChildren: () => import('./paie/augmentation/augmentation.module').then(m => AugmentationModule),
      },
      {
        path: 'exclusion-augmentation',
        data: { pageTitle: 'exclusion-augmentation' },
        loadChildren: () => import('./paie/exclusion-augmentation/exclusion-augmentation.module').then(m => ExclusionAugmentationModule),
      },

      {
        path: 'parametre',
        data: { pageTitle: 'Paraméttrage' },
        loadChildren: () => import('./carriere/parametre/parametre.module').then(() => ParametreModule),
      },

      {
        path: 'avancement',
        data: { pageTitle: 'Avancement' },
        loadChildren: () => import('./carriere/avancement/avancement.module').then(() => AvancementModule),
      },
    ]),
  ],
})
export class EntityRoutingModule {}
