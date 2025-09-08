import React, { useState } from 'react';
import { RESEARCH_GUIDE_STEPS } from '../../constants';
import { ProjectOverviewData } from '../../types';
import { LightbulbIcon } from '../icons/Icons';
import { getTipsForStep } from '../../services/geminiService';
import Loader from '../Loader';

interface ResearchersGuideProps {
    projectData: ProjectOverviewData;
}

const GuideStep: React.FC<{ step: typeof RESEARCH_GUIDE_STEPS[0], projectData: ProjectOverviewData }> = ({ step, projectData }) => {
    const [tips, setTips] = useState('');
    const [loading, setLoading] = useState(false);
    const [showTips, setShowTips] = useState(false);

    const handleGetTips = async () => {
        if (showTips) { // Toggle off
            setShowTips(false);
            return;
        }

        setShowTips(true);
        if (tips) return; // Don't re-fetch if we already have them

        if (!projectData.title) {
            setTips("Please add a project title in the 'Project Overview' tab for tailored tips.");
            return;
        }

        setLoading(true);
        try {
            const projectContext = `Title: ${projectData.title}\nPrimary Questions: ${projectData.primaryQuestions}`;
            const result = await getTipsForStep(step.title, projectContext);
            setTips(result);
        } catch (error) {
            console.error("Error fetching tips:", error);
            setTips("Sorry, could not fetch tips at this time.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-5 border border-slate-200 rounded-lg bg-slate-50">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-primary-700 mb-2">{step.title}</h2>
                <button 
                    onClick={handleGetTips} 
                    className="flex items-center space-x-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    title="Get AI tips for this step"
                >
                    <LightbulbIcon className="w-5 h-5"/>
                    <span>{showTips ? "Hide Tips" : "Get AI Tips"}</span>
                </button>
            </div>
            <p className="text-slate-700 mb-3">{step.content}</p>
            {step.indiaTip && (
                <div className="p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                  <p className="text-sm text-amber-800"><span className="font-bold">India Focus:</span> {step.indiaTip}</p>
                </div>
            )}
            {showTips && (
                <div className="mt-4 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded">
                    <h4 className="font-bold text-indigo-800">AI-Powered Tips for Your Project:</h4>
                    {loading ? <Loader rows={2} /> : <p className="text-sm text-indigo-700 whitespace-pre-wrap">{tips}</p>}
                </div>
            )}
        </div>
    );
};


const ResearchersGuide: React.FC<ResearchersGuideProps> = ({ projectData }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Researcher's Guide</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <p className="mb-8 text-slate-600">This guide outlines the typical 9-step journey of a research project, from a nascent idea to a published manuscript. Use the "Get AI Tips" feature on each step to get advice tailored to your project.</p>
        <div className="space-y-6">
          {RESEARCH_GUIDE_STEPS.map((step, index) => (
            <GuideStep key={index} step={step} projectData={projectData} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchersGuide;