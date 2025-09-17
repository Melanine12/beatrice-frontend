import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  UserIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ClockIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon as ClockIconSolid,
  BanknotesIcon,
  AcademicCapIcon,
  ChartPieIcon,
  MegaphoneIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

const RHNavigation = () => {
  const navigationSections = [
    {
      title: 'Gestion des Employés',
      items: [
        { name: 'Dossier Personnel', href: '/rh/dossier-personnel', icon: UserIcon },
        { name: 'Organigramme', href: '/rh/organigramme', icon: ChartBarIcon },
        { name: 'Contrats & Documents', href: '/rh/contrats-documents', icon: DocumentTextIcon },
        { name: 'Historique RH', href: '/rh/historique', icon: ClockIcon }
      ]
    },
    {
      title: 'Recrutement & Intégration',
      items: [
        { name: 'Offres d\'Emploi', href: '/rh/offres-emploi', icon: BriefcaseIcon },
        { name: 'Candidatures', href: '/rh/candidatures', icon: UserGroupIcon },
        { name: 'Processus de Recrutement', href: '/rh/recrutement', icon: ClipboardDocumentListIcon },
        { name: 'Intégration', href: '/rh/integration', icon: UserIcon }
      ]
    },
    {
      title: 'Temps & Présences',
      items: [
        { name: 'Pointage', href: '/rh/pointage', icon: ClockIconSolid },
        { name: 'Congés & Absences', href: '/rh/conges-absences', icon: CalendarIcon },
        { name: 'Planning', href: '/rh/planning', icon: CalendarDaysIcon },
        { name: 'Heures Supplémentaires', href: '/rh/heures-supplementaires', icon: ClockIconSolid }
      ]
    },
    {
      title: 'Paie & Avantages',
      items: [
        { name: 'Bulletins de Paie', href: '/rh/bulletins-paie', icon: DocumentDuplicateIcon },
        { name: 'Avantages Sociaux', href: '/rh/avantages-sociaux', icon: BanknotesIcon },
        { name: 'Remboursements', href: '/rh/remboursements', icon: BanknotesIcon },
        { name: 'Variables', href: '/rh/variables', icon: ChartPieIcon }
      ]
    },
    {
      title: 'Performance & Formation',
      items: [
        { name: 'Évaluations', href: '/rh/evaluations', icon: ChartBarIcon },
        { name: 'Objectifs', href: '/rh/objectifs', icon: ChartPieIcon },
        { name: 'Formations', href: '/rh/formations', icon: AcademicCapIcon },
        { name: 'Compétences', href: '/rh/competences', icon: UserIcon }
      ]
    },
    {
      title: 'Communication RH',
      items: [
        { name: 'Annonces', href: '/rh/annonces', icon: MegaphoneIcon },
        { name: 'Sondages', href: '/rh/sondages', icon: ChartBarIcon },
        { name: 'Événements', href: '/rh/evenements', icon: CalendarDaysIcon },
        { name: 'Politiques RH', href: '/rh/politiques', icon: DocumentTextIcon }
      ]
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Navigation RH
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigationSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-2">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={itemIndex}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                          : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RHNavigation;
