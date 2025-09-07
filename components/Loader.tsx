
import React, { useState, useEffect } from 'react';
import { LOADER_MESSAGES } from '../constants';

const Loader: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * LOADER_MESSAGES.length);
    setMessage(LOADER_MESSAGES[randomIndex]);
  }, []);

  return (
    <div className="w-full p-4 border border-slate-200 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-4"></div>
        {[...Array(rows)].map((_, i) => (
             <div key={i} className="h-3 bg-slate-200 rounded-full mb-2.5"></div>
        ))}
        <div className="h-3 bg-slate-200 rounded-full w-1/2 mb-4"></div>
        <div className="flex justify-center items-center mt-4">
            <p className="text-sm text-indigo-500 font-medium">{message}. Mast, Swasth and Vyast raho.</p>
        </div>
    </div>
  );
};

export default Loader;
