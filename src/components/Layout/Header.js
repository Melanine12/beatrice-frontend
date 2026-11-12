import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ResetDataModal from '../ResetDataModal';
import NotificationBell from '../Notifications/NotificationBell';
import { useTranslation } from 'react-i18next';
import { isCallCenterRole } from '../../utils/userRoles';

const Header = ({ user, setSidebarOpen, hideSidebarToggle = false }) => {
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const hideMobileToggle = hideSidebarToggle;
  const isCallCenter = isCallCenterRole(user?.role);

  const userNavigation = [
    { name: t('header.profile'), href: '/profile', onClick: () => navigate('/profile') },
    { name: t('header.logout'), href: '#', onClick: logout }
  ];

  return (
    <div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-green-200/50 dark:border-primary-200/50 bg-gradient-to-r from-white via-green-50/80 to-emerald-50/80 dark:from-gray-800 dark:via-purple-900/80 dark:to-indigo-900/80 backdrop-blur-md px-4 shadow-lg dark:border-primary-700/50 sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300">
      {!hideMobileToggle && (
        <>
          <button
            type="button"
            className="-m-2.5 p-2.5 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 lg:hidden dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">{t('header.openSidebar')}</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="h-6 w-px bg-gray-200 lg:hidden dark:bg-gray-700" />
        </>
      )}

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme toggle */}
          <button
            type="button"
            className="-m-2.5 p-2.5 rounded-xl text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-primary-400 transition-all duration-300 transform hover:scale-110"
            onClick={toggleTheme}
          >
            <span className="sr-only">{t('header.toggleTheme')}</span>
            {isDarkMode ? (
              <SunIcon className="h-6 w-6 transition-transform duration-300 hover:rotate-90" aria-hidden="true" />
            ) : (
              <MoonIcon className="h-6 w-6 transition-transform duration-300 hover:rotate-12" aria-hidden="true" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <label htmlFor="app-lang" className="text-xs text-gray-500 dark:text-gray-300">
              {t('language')}
            </label>
            <select
              id="app-lang"
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="fr">{t('languages.fr')}</option>
              <option value="en">{t('languages.en')}</option>
              <option value="zh">{t('languages.zh')}</option>
            </select>
          </div>

          {/* Cloche unique : WebSocket + badge + bip (NotificationContext) */}
          {!isCallCenter && <NotificationBell />}

          {/* Reset Data Button - Only for Web Master */}
          {user?.role === 'Web Master' && (
            <button
              type="button"
              className="-m-2.5 p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 dark:text-red-300 dark:hover:bg-gray-700 dark:hover:text-red-400 transition-all duration-300 transform hover:scale-110"
              onClick={() => setIsResetModalOpen(true)}
              title={t('header.resetData')}
            >
              <span className="sr-only">{t('header.resetData')}</span>
              <TrashIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          )}

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700" />

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="-m-1.5 flex items-center gap-3 p-1.5 rounded-xl hover:bg-primary-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
              <span className="sr-only">{t('header.openUserMenu')}</span>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 ring-2 ring-primary-200 dark:ring-primary-800">
                <span className="text-sm font-bold text-white">
                  {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
                </span>
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="text-sm font-bold leading-6 text-gray-900 dark:text-gray-100" aria-hidden="true">
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
              <Menu.Items className="absolute right-0 z-10 mt-2.5 w-40 origin-top-right rounded-xl bg-white/95 backdrop-blur-md py-2 shadow-xl ring-1 ring-gray-900/5 dark:bg-gray-800/95 dark:ring-gray-700/5 focus:outline-none animate-scale-in">
                {userNavigation.map((item) => (
                  <Menu.Item key={item.name}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (item.onClick) {
                            item.onClick();
                          } else if (item.href && item.href !== '#') {
                            navigate(item.href);
                          }
                        }}
                        className={`${
                          active ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 dark:bg-gray-700 dark:text-primary-300' : ''
                        } block w-full text-left px-4 py-2.5 text-sm font-medium leading-6 text-gray-900 dark:text-gray-100 rounded-lg transition-all duration-200 hover:bg-primary-50 dark:hover:bg-gray-700`}
                      >
                        {item.name}
                      </button>
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