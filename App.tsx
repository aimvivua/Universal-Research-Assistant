import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppState, Tab, ProjectOverviewData, TimelineTask, DataManagementData, GroundingChunk, ProjectsState, StudyMethodologyData } from './types';
import { TABS, INITIAL_STATE } from './constants';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './components/Login';
import ProjectDashboard from './components/ProjectDashboard';
import ProjectOverview from './components/tabs/ProjectOverview';
import ResearchersGuide from './components/tabs/ResearchersGuide';
import LiteratureHub from './components/tabs/LiteratureHub';
import StudyMethodology from './components/tabs/StudyMethodology';
import BiostatisticsToolkit from './components/tabs/BiostatisticsToolkit';
import DataManagement from './components/tabs/DataManagement';
import AIDraftReviewer from './components/tabs/AIDraftReviewer';
import FormGenerator from './components/tabs/FormGenerator';
import ProjectTimeline from './components/tabs/ProjectTimeline';
import UserManual from './components/tabs/UserManual';
import CitationsManager from './components/tabs/CitationsManager';
import Feedback from './components/tabs/Feedback';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useLocalStorage<string | null>('currentUser', null);
  const [allProjects, setAllProjects] = useLocalStorage<Record<string, ProjectsState>>('allUserProjects', {});
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ProjectOverview);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userProjects = allProjects[currentUser || ''] || {};
  const activeProjectState = userProjects[activeProjectId || ''] || null;

  const handleLogin = (email: string) => {
    setCurrentUser(email);
    setActiveProjectId(null); // Go to dashboard after login
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveProjectId(null);
  };

  const handleSelectProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setActiveTab(Tab.ProjectOverview); // Reset to default tab
  };
  
  const handleCreateProject = (title: string) => {
    const newProjectId = Date.now().toString();
    const newProject: AppState = { ...INITIAL_STATE, projectOverview: { ...INITIAL_STATE.projectOverview, title } };
    setAllProjects(prev => ({
        ...prev,
        [currentUser!]: {
            ...(prev[currentUser!] || {}),
            [newProjectId]: newProject
        }
    }));
    setActiveProjectId(newProjectId);
  };

  const handlePromptAndCreateProject = () => {
    const title = prompt("Enter a title for your new project:");
    if (title) {
        handleCreateProject(title);
    }
  };
  
  const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
        setAllProjects(prev => {
            const currentUserProjects = { ...(prev[currentUser!] || {}) };
            delete currentUserProjects[projectId];
            return {
                ...prev,
                [currentUser!]: currentUserProjects
            };
        });
    }
  };

  const handleBackToDashboard = () => {
    setActiveProjectId(null);
  };

  const updateActiveProject = useCallback((updater: (prevState: AppState) => AppState) => {
    if (!currentUser || !activeProjectId) return;
    setAllProjects(prevAll => {
      const updatedProject = updater(prevAll[currentUser][activeProjectId]);
      return {
        ...prevAll,
        [currentUser]: {
          ...prevAll[currentUser],
          [activeProjectId]: updatedProject,
        }
      };
    });
  }, [currentUser, activeProjectId, setAllProjects]);

  const updateProjectOverview = useCallback((data: Partial<ProjectOverviewData>) => {
    updateActiveProject(prev => ({ ...prev, projectOverview: { ...prev.projectOverview, ...data } }));
  }, [updateActiveProject]);

  const updateStudyMethodology = useCallback((data: Partial<StudyMethodologyData>) => {
    updateActiveProject(prev => ({ ...prev, studyMethodology: { ...prev.studyMethodology, ...data } }));
  }, [updateActiveProject]);

  const updateTimeline = useCallback((tasks: TimelineTask[]) => {
    updateActiveProject(prev => ({ ...prev, projectTimeline: { tasks } }));
  }, [updateActiveProject]);
  
  const updateDataManagement = useCallback((data: DataManagementData) => {
    updateActiveProject(prev => ({ ...prev, dataManagement: data }));
  }, [updateActiveProject]);

  const updateCitations = useCallback((citations: GroundingChunk[]) => {
    updateActiveProject(prev => ({ ...prev, citations }));
  }, [updateActiveProject]);

  const renderContent = () => {
    if (!activeProjectState) return <div>Loading project...</div>;
    
    switch (activeTab) {
      case Tab.ProjectOverview:
        return <ProjectOverview data={activeProjectState.projectOverview} onUpdate={updateProjectOverview} />;
      case Tab.ResearchersGuide:
        return <ResearchersGuide projectData={activeProjectState.projectOverview} />;
      case Tab.LiteratureHub:
          return <LiteratureHub projectData={activeProjectState.projectOverview} citations={activeProjectState.citations} onUpdateCitations={updateCitations}/>;
      case Tab.CitationsManager:
        return <CitationsManager citations={activeProjectState.citations} onUpdateCitations={updateCitations} />;
      case Tab.StudyMethodology:
          return <StudyMethodology projectData={activeProjectState.projectOverview} data={activeProjectState.studyMethodology} onUpdate={updateStudyMethodology} />;
      case Tab.BiostatisticsToolkit:
        return <BiostatisticsToolkit />;
      case Tab.DataManagement:
        return <DataManagement data={activeProjectState.dataManagement} onUpdate={updateDataManagement} />;
      case Tab.AIDraftReviewer:
        return <AIDraftReviewer />;
      case Tab.FormGenerator:
        return <FormGenerator projectData={activeProjectState.projectOverview} dataManagement={activeProjectState.dataManagement} />;
      case Tab.ProjectTimeline:
        return <ProjectTimeline tasks={activeProjectState.projectTimeline.tasks} onUpdate={updateTimeline} projectData={activeProjectState.projectOverview} />;
      case Tab.UserManual:
        return <UserManual />;
      case Tab.Feedback:
        return <Feedback />;
      default:
        return <ProjectOverview data={activeProjectState.projectOverview} onUpdate={updateProjectOverview} />;
    }
  };
  
  const handleReset = () => {
    if(window.confirm("Are you sure you want to reset ALL projects and data for this user? This action cannot be undone.")){
        setAllProjects(prev => ({
            ...prev,
            [currentUser!]: {}
        }));
        setActiveProjectId(null); // Go back to dashboard
    }
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  }

  if (!currentUser) {
    return <Login onLoginSuccess={handleLogin} />;
  }

  if (!activeProjectId) {
    return <ProjectDashboard 
        projects={userProjects}
        userEmail={currentUser}
        onCreateProject={handleCreateProject}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
        onLogout={handleLogout}
    />;
  }
  
  if (!activeProjectState) {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-100">
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error: Project Not Found</h2>
                <p className="text-slate-600 mb-6">The project you are trying to access does not exist or may have been deleted.</p>
                <button onClick={handleBackToDashboard} className="bg-primary-600 text-white font-bold py-2 px-6 rounded-md hover:bg-primary-700 transition">
                    Return to Dashboard
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onReset={handleReset} 
        onBackToDashboard={handleBackToDashboard}
        onCreateProject={handlePromptAndCreateProject}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          projectTitle={activeProjectState.projectOverview.title}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;