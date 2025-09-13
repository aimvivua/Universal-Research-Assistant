import React from 'react';
import { Tab } from '../types';
import { TABS } from '../constants';
import { ArrowPathIcon, ArrowUturnLeftIcon, PlusCircleIcon, XIcon } from './icons/Icons';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  onReset: () => void;
  onBackToDashboard: () => void;
  onCreateProject: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onReset, onBackToDashboard, onCreateProject, isOpen, onClose }) => {
  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    onClose(); // Automatically close sidebar on mobile after navigation
  };

  return (
    <>
      {/* Backdrop for mobile view */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg flex flex-col h-full print:hidden z-40 transform transition-transform lg:relative lg:translate-x-0 lg:z-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary-700">Universal Research Assistant</h1>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-800" aria-label="Close menu">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={onBackToDashboard}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-primary-100 hover:text-primary-700 transition-all duration-200"
          >
            <ArrowUturnLeftIcon className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={onCreateProject}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium rounded-lg text-slate-600 hover:bg-primary-100 hover:text-primary-700 transition-all duration-200"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Create New Project</span>
          </button>
          <div className="w-full border-t my-2 border-slate-200"></div>
          {TABS.map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
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
            <span>Reset User Data</span>
          </button>
          <p className="text-xs text-slate-400 text-center pt-2">Crafted with care for p.y.</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;