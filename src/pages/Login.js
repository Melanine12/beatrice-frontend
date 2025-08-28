import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { isDarkMode } = useTheme();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex">
          {/* Left Panel - Login Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="mx-auto h-16 w-16 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-white text-2xl font-bold">B</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-all"
                  />
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition-all pr-12"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="text-right">
                  <a href="#" className="text-yellow-600 text-sm hover:text-yellow-700 transition-colors">
                    Mot de passe oublié ?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white py-3 px-6 rounded-lg font-medium hover:from-yellow-600 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Connexion...</span>
                    </div>
                  ) : (
                    'LOG IN'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel - Welcome Message */}
          <div className="hidden lg:block w-1/2 bg-gradient-to-br from-yellow-500 to-amber-600 p-8 lg:p-12 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">Bon Retour !</h2>
              <p className="text-xl mb-8 opacity-90">
                Entrez vos identifiants pour vous connecter.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Welcome Message */}
        <div className="lg:hidden mt-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Bon Retour !</h2>
          <p className="text-lg opacity-90 mb-4">
            Entrez vos identifiants pour vous connecter.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 