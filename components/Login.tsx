import React, { useState } from 'react';
import { BookOpenIcon } from './icons/Icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface LoginProps {
  onLoginSuccess: (email: string) => void;
}

// Store users as an object with email as key and an object with password as value
const useUserStore = () => {
    return useLocalStorage<Record<string, { password: string }>>('app_registered_users', {
        'vivu@demo.com': { password: 'password123' }
    });
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [registeredUsers, setRegisteredUsers] = useUserStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Define the universal developer credentials
    const DEV_EMAIL = 'dev@admin.com';
    const DEV_PASSWORD = 'masterkey123';

    // Simulate network delay for a better user experience
    setTimeout(() => {
        if (mode === 'login') {
            // Check for developer credentials first
            if (email.toLowerCase() === DEV_EMAIL && password === DEV_PASSWORD) {
                onLoginSuccess(DEV_EMAIL);
                setLoading(false);
                return;
            }
            
            // Proceed with regular user check
            const user = registeredUsers[email.toLowerCase()];
            if (user && user.password === password) {
                onLoginSuccess(email.toLowerCase());
            } else {
                setError('Invalid email or password.');
            }
        } else { // register mode
            if (registeredUsers[email.toLowerCase()]) {
                setError('This email is already registered. Please log in.');
            } else if (password.length < 6) {
                setError('Password must be at least 6 characters long.');
            } else {
                setRegisteredUsers(prev => ({
                    ...prev,
                    [email.toLowerCase()]: { password }
                }));
                alert('Registration successful! You can now log in.');
                setMode('login'); // Switch to login mode after successful registration
                setPassword(''); // Clear password field
            }
        }
        setLoading(false);
    }, 500);
  };
  
  const switchMode = () => {
      setMode(prev => prev === 'login' ? 'register' : 'login');
      setError('');
      setEmail('');
      setPassword('');
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <BookOpenIcon className="w-12 h-12 text-primary-600"/>
          <h1 className="text-2xl font-bold text-center text-slate-800">Universal Research Assistant</h1>
          <p className="text-slate-500">
            {mode === 'login' ? 'Sign in to continue' : 'Create a new account'}
          </p>
        </div>

        {error && <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="you@example.com"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-3 focus:border-primary-500 focus:ring-primary-500 sm:text-sm" placeholder="••••••••"/>
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-300">
              {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
            </button>
        </form>
        
        <p className="text-center text-sm">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button type="button" onClick={switchMode} className="font-medium text-primary-600 hover:text-primary-500 ml-1">
                {mode === 'login' ? "Register here" : "Log in here"}
            </button>
        </p>
      </div>
    </div>
  );
};

export default Login;