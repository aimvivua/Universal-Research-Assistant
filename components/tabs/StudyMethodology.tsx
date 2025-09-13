import React, { useState } from 'react';
import { ProjectOverviewData, StudyMethodologyData } from '../../types';
import { reviewMethodology, suggestMethodologyField, suggestSamplingMethod } from '../../services/geminiService';
import Loader from '../Loader';
import { SparklesIcon } from '../icons/Icons';

interface StudyMethodologyProps {
    projectData: ProjectOverviewData;
    data: StudyMethodologyData;
    onUpdate: (data: Partial<StudyMethodologyData>) => void;
}

const studyTypes = [
    "Cross-Sectional Study",
    "Case-Control Study",
    "Cohort Study",
    "Randomized Controlled Trial (RCT)",
    "Systematic Review and Meta-Analysis",
    "Qualitative Study",
    "Diagnostic Accuracy Study"
];

const StudyMethodology: React.FC<StudyMethodologyProps> = ({ projectData, data, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [loadingSuggestion, setLoadingSuggestion] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');

    const handleInputChange = (field: keyof StudyMethodologyData, value: string) => {
        onUpdate({ [field]: value });
    }

    const handleGetFeedback = async () => {
        const { studyType, inclusionCriteria, exclusionCriteria, primaryVariables } = data;
        if (!studyType || !inclusionCriteria || !exclusionCriteria || !primaryVariables) {
            alert('Please fill out all methodology fields to get feedback.');
            return;
        }

        setLoading(true);
        setFeedback('');

        const projectContext = `Title: ${projectData.title}\nPrimary Questions: ${projectData.primaryQuestions}`;
        const methodologyDetails = `
            Study Type: ${studyType}
            Inclusion Criteria: ${inclusionCriteria}
            Exclusion Criteria: ${exclusionCriteria}
            Primary Variables: ${primaryVariables}
            Secondary Variables: ${data.secondaryVariables}
        `;

        try {
            const result = await reviewMethodology(projectContext, methodologyDetails);
            setFeedback(result);
        } catch (error) {
            console.error('Error getting methodology feedback:', error);
            setFeedback('An error occurred while fetching feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleSuggestField = async (field: 'inclusionCriteria' | 'exclusionCriteria' | 'primaryVariables' | 'secondaryVariables') => {
        if (!projectData.title) {
            alert("Please provide a project title first.");
            return;
        }
        
        const fieldMap: Record<typeof field, 'Inclusion Criteria' | 'Exclusion Criteria' | 'Primary Variables' | 'Secondary Variables'> = {
            inclusionCriteria: 'Inclusion Criteria',
            exclusionCriteria: 'Exclusion Criteria',
            primaryVariables: 'Primary Variables',
            secondaryVariables: 'Secondary Variables',
        };

        setLoadingSuggestion(field);
        try {
            const projectContext = `Title: ${projectData.title}\nPrimary Questions: ${projectData.primaryQuestions}`;
            const suggestion = await suggestMethodologyField(projectContext, fieldMap[field]);
            handleInputChange(field, suggestion);
        } catch (error) {
            console.error(`Error suggesting ${field}:`, error);
        } finally {
            setLoadingSuggestion(null);
        }
    }

    const handleSuggestSamplingMethod = async () => {
        if (!projectData.title) {
            alert("Please provide a project title first.");
            return;
        }
        setLoadingSuggestion('samplingMethod');
        try {
            const projectContext = `Title: ${projectData.title}\nStudy Design: ${data.studyType}`;
            const suggestion = await suggestSamplingMethod(projectContext);
            onUpdate({ samplingMethod: suggestion });
        } catch (error) {
            console.error(`Error suggesting sampling method:`, error);
        } finally {
            setLoadingSuggestion(null);
        }
    }

    const renderTextareaWithSuggest = (
        id: 'inclusionCriteria' | 'exclusionCriteria' | 'primaryVariables' | 'secondaryVariables',
        label: string,
        placeholder: string,
        rows: number
    ) => (
        <div>
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            <div className="relative">
                <textarea 
                    value={data[id]} 
                    onChange={e => handleInputChange(id, e.target.value)} 
                    rows={rows} 
                    className="mt-1 w-full p-2 border border-slate-300 rounded-md" 
                    placeholder={placeholder}
                />
                <button
                    onClick={() => handleSuggestField(id)}
                    disabled={!!loadingSuggestion}
                    className="absolute top-2 right-2 p-1 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 disabled:bg-slate-200"
                >
                   {loadingSuggestion === id ? '...' : 'AI-Suggest'}
                </button>
            </div>
        </div>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Study Methodology Designer</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Study Type</label>
                            <select value={data.studyType} onChange={e => handleInputChange('studyType', e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md">
                                <option value="">Select a study type</option>
                                {studyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        {renderTextareaWithSuggest('inclusionCriteria', 'Inclusion Criteria', 'e.g., All neonates admitted to the NICU with suspected sepsis...', 4)}
                        {renderTextareaWithSuggest('exclusionCriteria', 'Exclusion Criteria', 'e.g., Neonates with major congenital anomalies...', 4)}
                        {renderTextareaWithSuggest('primaryVariables', 'Primary Variables / Exposures', 'e.g., Serum levels of Biomarker X, CRP levels', 2)}
                        {renderTextareaWithSuggest('secondaryVariables', 'Secondary Variables / Outcomes', 'e.g., Length of hospital stay, mortality, severity score', 2)}
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Sampling Method</label>
                            <div className="relative">
                                <textarea 
                                    value={data.samplingMethod} 
                                    onChange={e => handleInputChange('samplingMethod', e.target.value)} 
                                    rows={4} 
                                    className="mt-1 w-full p-2 border border-slate-300 rounded-md" 
                                    placeholder="e.g., Convenience sampling of all eligible patients..."
                                />
                                <button
                                    onClick={handleSuggestSamplingMethod}
                                    disabled={!!loadingSuggestion}
                                    className="absolute top-2 right-2 p-1 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 disabled:bg-slate-200"
                                >
                                {loadingSuggestion === 'samplingMethod' ? '...' : 'AI-Suggest'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Side */}
                    <div className="space-y-4">
                        <button onClick={handleGetFeedback} disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition flex items-center justify-center space-x-2">
                            <SparklesIcon className="w-5 h-5"/>
                            <span>{loading ? 'Analyzing...' : 'Get AI Feedback on Methodology'}</span>
                        </button>
                        <div className="p-4 bg-slate-50 border rounded-lg min-h-[20rem]">
                             <h3 className="text-lg font-semibold text-slate-700 mb-2">AI Feedback</h3>
                             {loading ? <Loader /> : (
                                <div className="text-slate-700 whitespace-pre-wrap text-sm">
                                    {feedback || "Your feedback will appear here. Make sure your Project Overview is filled out for best results."}
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyMethodology;