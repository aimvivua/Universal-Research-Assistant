import React, { useState } from 'react';
import { BookOpenIcon } from './icons/Icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [users, setUsers] = useLocalStorage('app_users', {
    'vivu': { password: 'arsenal' }
  });

  // Login state
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  // Register state
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const user = users[userId];
    if (user && user.password === password) {
      onLoginSuccess();
    } else {
      setError('Invalid User ID or password.');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (regPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    if (users[email]) {
      setError('A user with this email already exists. Please log in.');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUsers = { ...users, [email]: { password: regPassword } };
    setUsers(newUsers);
    
    // Automatically log in after registration
    onLoginSuccess();

    setLoading(false);
  };

  const switchMode = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setError('');
    setUserId('');
    setPassword('');
    setEmail('');
    setRegPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
            <BookOpenIcon className="w-12 h-12 text-primary-600"/>
            <h1 className="text-2xl font-bold text-center text-slate-800">Universal Research Assistant</h1>
            <p className="text-slate-500">{authMode === 'login' ? 'Sign in to continue your work' : 'Create a new account'}</p>
        </div>

        {error && <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">{error}</div>}

        {authMode === 'login' ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-slate-700">User ID</label>
              <input type="text" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="e.g., vivu or your_email@..."/>
            </div>
            <div>
              <label htmlFor="password_login" className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" id="password_login" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300">
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-center text-sm">
                New user? <button type="button" onClick={() => switchMode('register')} className="font-medium text-primary-600 hover:text-primary-500">Register here</button>
            </p>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="you@example.com"/>
            </div>
            <div>
              <label htmlFor="password_reg" className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" id="password_reg" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300">
              {loading ? 'Registering...' : 'Register & Login'}
            </button>
             <p className="text-center text-sm">
                Already have an account? <button type="button" onClick={() => switchMode('login')} className="font-medium text-primary-600 hover:text-primary-500">Log in here</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
