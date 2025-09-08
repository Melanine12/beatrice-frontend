import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { usePermissions } from '../../contexts/PermissionContext';
import { navigationConfig, guichetierNavigation, iconMap } from '../../config/navigation';

const PermissionSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { 
    isGuichetier, 
    checkPermission, 
    checkAnyPermission 
  } = usePermissions();
  
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  // Filtrer la navigation basée sur les permissions
  const getFilteredNavigation = () => {
    if (isGuichetier) {
      return guichetierNavigation.filter(item => checkPermission(item.permission));
    }
    
    const filtered = navigationConfig.filter(item => {
      if (item.submenu) {
        // Si l'item a un sous-menu, vérifier si au moins un sous-item est accessible
        const hasAccess = checkAnyPermission(item.submenu.map(sub => sub.permission));
        console.log(`🔍 Menu "${item.name}" (submenu):`, hasAccess);
        return hasAccess;
      }
      const hasAccess = checkPermission(item.permission);
      console.log(`🔍 Menu "${item.name}":`, hasAccess, 'permission:', item.permission);
      return hasAccess;
    });
    
    console.log('🔍 Filtered navigation:', filtered.map(item => item.name));
    return filtered;
  };

  const NavigationItem = ({ item }) => {
    const Icon = iconMap[item.icon];
    
    if (item.submenu) {
      const isExpanded = expandedMenus[item.name];
      const accessibleSubmenu = item.submenu.filter(sub => checkPermission(sub.permission));
      
      if (accessibleSubmenu.length === 0) return null;
      
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
              {accessibleSubmenu.map((subItem) => (
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

  const filteredNavigation = getFilteredNavigation();

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
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-2">
                  <div className="flex h-16 shrink-0 items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Hôtel Beatrice
                    </h1>
                  </div>
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" className="-mx-2 space-y-1">
                          {filteredNavigation.map((item) => (
                            <li key={item.name}>
                              <NavigationItem item={item} />
                            </li>
                          ))}
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
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white dark:bg-gray-800 px-6 pb-2">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Hôtel Beatrice
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {filteredNavigation.map((item) => (
                    <li key={item.name}>
                      <NavigationItem item={item} />
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default PermissionSidebar;
