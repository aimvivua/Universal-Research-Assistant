import React, { useState, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AppState, Tab, ProjectOverviewData, TimelineTask, DataManagementData, GroundingChunk } from './types';
import { TABS, INITIAL_STATE } from './constants';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
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

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('isAuthenticated', false);
  const [appState, setAppState] = useLocalStorage<AppState>('researchAssistantState', INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ProjectOverview);

  const updateProjectOverview = useCallback((data: Partial<ProjectOverviewData>) => {
    setAppState(prev => ({ ...prev, projectOverview: { ...prev.projectOverview, ...data } }));
  }, [setAppState]);

  const updateTimeline = useCallback((tasks: TimelineTask[]) => {
    setAppState(prev => ({ ...prev, projectTimeline: { tasks } }));
  }, [setAppState]);
  
  const updateDataManagement = useCallback((data: DataManagementData) => {
    setAppState(prev => ({ ...prev, dataManagement: data }));
  }, [setAppState]);

  const updateCitations = useCallback((citations: GroundingChunk[]) => {
    setAppState(prev => ({ ...prev, citations }));
  }, [setAppState]);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.ProjectOverview:
        return <ProjectOverview data={appState.projectOverview} onUpdate={updateProjectOverview} />;
      case Tab.ResearchersGuide:
        return <ResearchersGuide projectData={appState.projectOverview} />;
      case Tab.LiteratureHub:
          return <LiteratureHub projectData={appState.projectOverview} citations={appState.citations} onUpdateCitations={updateCitations}/>;
      case Tab.CitationsManager:
        return <CitationsManager citations={appState.citations} onUpdateCitations={updateCitations} />;
      case Tab.StudyMethodology:
          return <StudyMethodology projectData={appState.projectOverview} />;
      case Tab.BiostatisticsToolkit:
        return <BiostatisticsToolkit />;
      case Tab.DataManagement:
        return <DataManagement data={appState.dataManagement} onUpdate={updateDataManagement} />;
      case Tab.AIDraftReviewer:
        return <AIDraftReviewer />;
      case Tab.FormGenerator:
        return <FormGenerator projectData={appState.projectOverview} dataManagement={appState.dataManagement} />;
      case Tab.ProjectTimeline:
        return <ProjectTimeline tasks={appState.projectTimeline.tasks} onUpdate={updateTimeline} projectData={appState.projectOverview} />;
      case Tab.UserManual:
        return <UserManual />;
      default:
        return <ProjectOverview data={appState.projectOverview} onUpdate={updateProjectOverview} />;
    }
  };
  
  const handleReset = () => {
    if(window.confirm("Are you sure you want to reset all data for this user? This action cannot be undone.")){
        localStorage.removeItem('researchAssistantState');
        window.location.reload();
    }
  };
  
  const handleLogout = () => {
      setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onReset={handleReset} onLogout={handleLogout} />
      <main className="flex-1 p-6 sm:p-8 md:p-10 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;