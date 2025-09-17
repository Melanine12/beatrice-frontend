import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
  UserGroupIcon,
  BellIcon,
  DocumentTextIcon,
  CreditCardIcon,
  BuildingLibraryIcon,
  ShoppingCartIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ navigation, sidebarOpen, setSidebarOpen, isGuichetier, isAgent, isWebMaster, isSuperviseurStock, isSuperviseurHousing, isSuperviseurFinance, isSuperviseurRH }) => {
  const { user } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const iconMap = {
    HomeIcon,
    BuildingOfficeIcon,
    ExclamationTriangleIcon,
    ClipboardDocumentListIcon,
    BanknotesIcon,
    CubeIcon,
    UsersIcon,
    ChartBarIcon,
    UserGroupIcon,
    BellIcon,
    DocumentTextIcon,
    CreditCardIcon,
    BuildingLibraryIcon,
    ShoppingCartIcon,
    ArrowPathIcon,
  };

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const NavigationItem = ({ item }) => {
    const Icon = iconMap[item.icon];
    
    if (item.submenu) {
      const isExpanded = expandedMenus[item.name];
      
      return (
        <div>
          <button
            onClick={() => toggleSubmenu(item.name)}
            className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
          >
            <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span className="flex-1 text-left">{item.name}</span>
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4 shrink-0" />
            ) : (
              <ChevronRightIcon className="h-4 w-4 shrink-0" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.submenu.map((subItem) => (
                <NavLink
                  key={subItem.name}
                  to={subItem.href}
                  className={({ isActive }) =>
                    `block rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
                    }`
                  }
                >
                  {subItem.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
            isActive
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
          }`
        }
      >
        <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
        {item.name}
      </NavLink>
    );
  };

  // Special navigation component for Guichetier
  const GuichetierNavigation = () => (
    <div className="space-y-2">
      <NavLink
        to="/espace-guichetier"
        className={({ isActive }) =>
          `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
            isActive
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
          }`
        }
      >
        <BanknotesIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
        Espace Guichetier
      </NavLink>
    </div>
  );

  // Special navigation component for Agent
  const AgentNavigation = () => (
    <div className="space-y-2">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
            }`
          }
        >
          {React.createElement(iconMap[item.icon], { className: "h-6 w-6 shrink-0", "aria-hidden": "true" })}
          {item.name}
        </NavLink>
      ))}
    </div>
  );

  // Special navigation component for Web Master
  const WebMasterNavigation = () => (
    <div className="space-y-2">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            `group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
            }`
          }
        >
          {React.createElement(iconMap[item.icon], { className: "h-6 w-6 shrink-0", "aria-hidden": "true" })}
          {item.name}
        </NavLink>
      ))}
    </div>
  );

  // Special navigation component for Superviseur Stock
  const SuperviseurStockNavigation = () => (
    <div className="space-y-2">
      {navigation.map((item) => (
        <li key={item.name}>
          <NavigationItem item={item} />
        </li>
      ))}
    </div>
  );

  // Special navigation component for Superviseur Housing
  const SuperviseurHousingNavigation = () => (
    <div className="space-y-2">
      {navigation.map((item) => (
        <li key={item.name}>
          <NavigationItem item={item} />
        </li>
      ))}
    </div>
  );

  // Special navigation component for Superviseur Finance
  const SuperviseurFinanceNavigation = () => (
    <div className="space-y-2">
      {navigation.map((item) => (
        <li key={item.name}>
          <NavigationItem item={item} />
        </li>
      ))}
    </div>
  );

  // Special navigation component for Superviseur RH
  const SuperviseurRHNavigation = () => (
    <div className="space-y-2">
      {navigation.map((item) => (
        <li key={item.name}>
          <NavigationItem item={item} />
        </li>
      ))}
    </div>
  );

  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 dark:bg-gray-800">
                  <div className="flex h-16 shrink-0 items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      {isGuichetier ? 'Espace Guichetier' : isAgent ? 'Espace Agent' : isWebMaster ? 'Espace Web Master' : isSuperviseurStock ? 'Espace Superviseur Stock' : isSuperviseurHousing ? 'Espace Superviseur Housing' : isSuperviseurFinance ? 'Espace Superviseur Finance' : isSuperviseurRH ? 'Espace Superviseur RH' : 'Hôtel Beatrice'}
                    </h1>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {isGuichetier ? (
                            <GuichetierNavigation />
                          ) : isAgent ? (
                            <AgentNavigation />
                          ) : isWebMaster ? (
                            <WebMasterNavigation />
                          ) : isSuperviseurStock ? (
                            <SuperviseurStockNavigation />
                          ) : isSuperviseurHousing ? (
                            <SuperviseurHousingNavigation />
                          ) : isSuperviseurFinance ? (
                            <SuperviseurFinanceNavigation />
                          ) : isSuperviseurRH ? (
                            <SuperviseurRHNavigation />
                          ) : (
                            navigation.map((item) => (
                              <li key={item.name}>
                                <NavigationItem item={item} />
                              </li>
                            ))
                          )}
                        </ul>
                      </li>
                    </ul>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {isGuichetier ? 'Espace Guichetier' : isAgent ? 'Espace Agent' : isWebMaster ? 'Espace Web Master' : isSuperviseurStock ? 'Espace Superviseur Stock' : isSuperviseurHousing ? 'Espace Superviseur Housing' : isSuperviseurFinance ? 'Espace Superviseur Finance' : isSuperviseurRH ? 'Espace Superviseur RH' : 'Hôtel Beatrice'}
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {isGuichetier ? (
                    <GuichetierNavigation />
                  ) : isAgent ? (
                    <AgentNavigation />
                  ) : isWebMaster ? (
                    <WebMasterNavigation />
                  ) : isSuperviseurStock ? (
                    <SuperviseurStockNavigation />
                  ) : isSuperviseurHousing ? (
                    <SuperviseurHousingNavigation />
                  ) : isSuperviseurFinance ? (
                    <SuperviseurFinanceNavigation />
                  ) : isSuperviseurRH ? (
                    <SuperviseurRHNavigation />
                  ) : (
                    navigation.map((item) => (
                      <li key={item.name}>
                        <NavigationItem item={item} />
                      </li>
                    ))
                  )}
                </ul>
              </li>
              <li className="mt-auto">
                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.prenom} {user?.nom}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.role}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 