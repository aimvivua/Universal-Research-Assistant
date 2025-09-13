import React from 'react';
import { ProjectsState } from '../types';
import { PlusCircleIcon, TrashIcon, PowerIcon, BookOpenIcon } from './icons/Icons';

interface ProjectDashboardProps {
    projects: ProjectsState;
    userEmail: string;
    onCreateProject: (title: string) => void;
    onSelectProject: (projectId: string) => void;
    onDeleteProject: (projectId: string) => void;
    onLogout: () => void;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ projects, userEmail, onCreateProject, onSelectProject, onDeleteProject, onLogout }) => {

    const handleCreate = () => {
        const title = prompt("Enter a title for your new project:");
        if (title) {
            onCreateProject(title);
        }
    };

    const handleDelete = (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation(); // Prevent card click when deleting
        onDeleteProject(projectId);
    };

    const projectList = Object.entries(projects);

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <BookOpenIcon className="w-8 h-8 text-primary-600"/>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Your Research Dashboard
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-500 hidden sm:block">{userEmail}</span>
                        <button
                            onClick={onLogout}
                            className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-red-600 transition"
                        >
                            <PowerIcon className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
                    <div className="px-4 sm:px-0 mb-6">
                        <h2 className="text-xl font-semibold text-slate-700">My Projects</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 sm:px-0">
                        {projectList.map(([projectId, project]) => (
                            <div
                                key={projectId}
                                onClick={() => onSelectProject(projectId)}
                                className="relative bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform cursor-pointer group"
                            >
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-primary-700 truncate">{project.projectOverview.title}</h3>
                                    <p className="text-sm text-slate-500 mt-2 h-10 overflow-hidden">{project.projectOverview.primaryQuestions || 'No primary questions yet.'}</p>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(e, projectId)}
                                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 transition-opacity"
                                    title="Delete project"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        <div
                            onClick={handleCreate}
                            className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg hover:bg-white hover:border-primary-500 transition cursor-pointer text-slate-500 hover:text-primary-600"
                        >
                            <PlusCircleIcon className="w-12 h-12" />
                            <span className="mt-2 font-semibold">Create New Project</span>
                        </div>
                    </div>
                    {projectList.length === 0 && (
                         <div className="text-center py-16 text-slate-500">
                            <p>You don't have any projects yet.</p>
                            <p>Click the "Create New Project" card to get started!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProjectDashboard;
