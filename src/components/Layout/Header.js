import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ResetDataModal from '../ResetDataModal';

const Header = ({ user, setSidebarOpen }) => {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const userNavigation = [
    { name: 'Profil', href: '/profile' },
    { name: 'Déconnexion', href: '#', onClick: logout },
  ];

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-300"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden dark:bg-gray-700" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme toggle */}
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            onClick={toggleTheme}
          >
            <span className="sr-only">Toggle theme</span>
            {isDarkMode ? (
              <SunIcon className="h-6 w-6" aria-hidden="true" />
            ) : (
              <MoonIcon className="h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
            onClick={() => navigate('/notifications')}
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              </span>
            )}
          </button>

          {/* Reset Data Button - Only for Web Master */}
          {user?.role === 'Web Master' && (
            <button
              type="button"
              className="-m-2.5 p-2.5 text-red-400 hover:text-red-500 dark:text-red-300 dark:hover:text-red-200"
              onClick={() => setIsResetModalOpen(true)}
              title="Réinitialiser les données (Web Master uniquement)"
            >
              <span className="sr-only">Reset data</span>
              <TrashIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          )}

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center p-1.5">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                </span>
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100" aria-hidden="true">
                  {user?.prenom} {user?.nom}
                </span>
              </span>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700/5 focus:outline-none">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <a
                        href={item.href}
                        onClick={item.onClick}
                        className={`${
                          active ? 'bg-gray-50 dark:bg-gray-700' : ''
                        } block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-100`}
                      >
                        {item.name}
                      </a>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>

      {/* Reset Data Modal */}
      <ResetDataModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onReset={() => {
          // Recharger la page après reset
          window.location.reload();
        }}
      />
    </div>
  );
};

export default Header; 