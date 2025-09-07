import React, { useState } from 'react';
import { ProjectOverviewData, HypothesisSuggestion, StudyDesignSuggestion } from '../../types';
import { getProjectDetailsFromTitle, getHypothesisSuggestion, getStudyDesignSuggestion, parseGeminiJson } from '../../services/geminiService';
import Loader from '../Loader';

interface ProjectOverviewProps {
  data: ProjectOverviewData;
  onUpdate: (data: Partial<ProjectOverviewData>) => void;
}

interface SuggestionState {
    hypotheses?: HypothesisSuggestion | null;
    design?: StudyDesignSuggestion | null;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ data, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [loadingSuggestionType, setLoadingSuggestionType] = useState<'hypotheses' | 'design' | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionState>({});
  
  const handleTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (title && title !== data.title) {
      onUpdate({ title });
      setLoading(true);
      setSuggestions({});
      try {
        const responseText = await getProjectDetailsFromTitle(title);
        const parsedData = parseGeminiJson<Omit<ProjectOverviewData, 'title'>>(responseText);
        if (parsedData) {
          onUpdate(parsedData);
        } else {
            console.error("Failed to parse AI response or response was empty.");
        }
      } catch (error) {
        console.error("Error fetching project details from AI:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onUpdate({ [e.target.name]: e.target.value });
  };

  const fetchSuggestion = async (type: 'hypotheses' | 'design') => {
    if (!data.title || !data.primaryQuestions) {
        alert("Please provide a title and primary research questions first.");
        return;
    }
    setLoadingSuggestionType(type);
    
    try {
        if (type === 'hypotheses') {
            const result = await getHypothesisSuggestion(data.title, data.primaryQuestions);
            setSuggestions(prev => ({ ...prev, hypotheses: result }));
        } else {
            const result = await getStudyDesignSuggestion(data.title, data.primaryQuestions);
            setSuggestions(prev => ({ ...prev, design: result }));
        }
    } catch (error) {
        console.error(`Error fetching ${type} suggestion:`, error);
        if (type === 'hypotheses') setSuggestions(prev => ({ ...prev, hypotheses: null }));
        else setSuggestions(prev => ({ ...prev, design: null }));
    } finally {
        setLoadingSuggestionType(null);
    }
  };

  const renderInputField = (name: keyof ProjectOverviewData, label: string, placeholder: string, isTextArea = false) => {
    const InputComponent = isTextArea ? 'textarea' : 'input';
    const props = {
      id: name,
      name: name,
      value: data[name],
      onChange: handleInputChange,
      placeholder: placeholder,
      className: "w-full p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition",
      rows: isTextArea ? 4 : undefined,
    };
    if (name === 'title') {
      (props as any).onBlur = handleTitleBlur;
    }
    return (
      <div className="mb-6">
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <InputComponent {...props} />
      </div>
    );
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Project Overview</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        {loading ? <Loader /> : (
            <>
                {renderInputField('title', 'Project Title', 'Enter Your Project Title Here')}
                {renderInputField('primaryQuestions', 'Primary Research Questions', 'e.g., What is the diagnostic accuracy of biomarker X for neonatal sepsis?', true)}
                {renderInputField('secondaryQuestions', 'Secondary Research Questions', 'e.g., What is the correlation between biomarker X levels and disease severity?', true)}
                {renderInputField('primaryHypothesis', 'Primary Hypothesis', 'e.g., Biomarker X has a sensitivity of over 90%...', true)}
                {renderInputField('secondaryHypothesis', 'Secondary Hypothesis', 'e.g., There is a positive correlation between biomarker X levels...', true)}
            </>
        )}
        <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold text-slate-700 mb-4">AI-Powered Suggestions</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <button onClick={() => fetchSuggestion('hypotheses')} disabled={!!loadingSuggestionType} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition">
                        Suggest Hypotheses
                    </button>
                    {loadingSuggestionType === 'hypotheses' && <Loader rows={2} />}
                    {suggestions.hypotheses && (
                        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-md space-y-2">
                            <div>
                                <h4 className="font-semibold text-indigo-800">Primary Hypothesis:</h4>
                                <p className="text-sm text-indigo-700">{suggestions.hypotheses.primary}</p>
                            </div>
                             <div>
                                <h4 className="font-semibold text-indigo-800">Secondary Hypothesis:</h4>
                                <p className="text-sm text-indigo-700">{suggestions.hypotheses.secondary}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <button onClick={() => fetchSuggestion('design')} disabled={!!loadingSuggestionType} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition">
                        Suggest Study Design, Sample Size & Duration
                    </button>
                    {loadingSuggestionType === 'design' && <Loader rows={3} />}
                    {suggestions.design && (
                        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-md space-y-2">
                            <div><h4 className="font-semibold text-indigo-800">Study Design:</h4><p className="text-sm text-indigo-700">{suggestions.design.design}</p></div>
                            <div><h4 className="font-semibold text-indigo-800">Justification:</h4><p className="text-sm text-indigo-700">{suggestions.design.justification}</p></div>
                            <div><h4 className="font-semibold text-indigo-800">Sample Size:</h4><p className="text-sm text-indigo-700">{suggestions.design.sampleSize}</p></div>
                            <div><h4 className="font-semibold text-indigo-800">Duration:</h4><p className="text-sm text-indigo-700">{suggestions.design.duration}</p></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;