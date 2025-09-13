import React from 'react';
import { MenuIcon } from './icons/Icons';

interface HeaderProps {
    projectTitle: string;
    onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ projectTitle, onToggleSidebar }) => {
    return (
        <header className="bg-white shadow-sm lg:hidden print:hidden">
            <div className="p-4 flex items-center border-b">
                <button onClick={onToggleSidebar} className="mr-4 text-slate-600 hover:text-primary-600" aria-label="Open menu">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-semibold text-slate-800 truncate" title={projectTitle}>
                    {projectTitle || "Current Project"}
                </h1>
            </div>
        </header>
    );
};

export default Header;
