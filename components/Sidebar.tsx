import React from 'react';
import { Tab } from '../types';
import { TABS } from '../constants';
import { PowerIcon, ArrowPathIcon } from './icons/Icons';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onReset: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onReset, onLogout }) => {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full print:hidden">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold text-primary-700">Universal Research Assistant</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === id
                ? 'bg-primary-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-primary-100 hover:text-primary-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{id}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t space-y-2">
        <button
          onClick={onReset}
          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-amber-100 hover:text-amber-700 transition-all duration-200"
        >
          <ArrowPathIcon className="w-5 h-5" />
          <span>Reset App Data</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
        >
          <PowerIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
        <p className="text-xs text-slate-400 text-center pt-2">Crafted with care for p.y.</p>
      </div>
    </div>
  );
};

export default Sidebar;