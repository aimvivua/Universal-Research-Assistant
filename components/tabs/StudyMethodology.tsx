import React, { useState } from 'react';
import { ProjectOverviewData } from '../../types';
import { reviewMethodology } from '../../services/geminiService';
import Loader from '../Loader';

interface StudyMethodologyProps {
    projectData: ProjectOverviewData;
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

const StudyMethodology: React.FC<StudyMethodologyProps> = ({ projectData }) => {
    const [studyType, setStudyType] = useState('');
    const [inclusionCriteria, setInclusionCriteria] = useState('');
    const [exclusionCriteria, setExclusionCriteria] = useState('');
    const [primaryVariables, setPrimaryVariables] = useState('');
    const [secondaryVariables, setSecondaryVariables] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleGetFeedback = async () => {
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
            Secondary Variables: ${secondaryVariables}
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

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Study Methodology Designer</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Side */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Study Type</label>
                            <select value={studyType} onChange={e => setStudyType(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-md">
                                <option value="">Select a study type</option>
                                {studyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Inclusion Criteria</label>
                            <textarea value={inclusionCriteria} onChange={e => setInclusionCriteria(e.target.value)} rows={4} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., All neonates admitted to the NICU with suspected sepsis..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Exclusion Criteria</label>
                            <textarea value={exclusionCriteria} onChange={e => setExclusionCriteria(e.target.value)} rows={4} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., Neonates with major congenital anomalies..."></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Primary Variables / Exposures</label>
                            <textarea value={primaryVariables} onChange={e => setPrimaryVariables(e.target.value)} rows={2} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., Serum levels of Biomarker X, CRP levels"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Secondary Variables / Outcomes</label>
                            <textarea value={secondaryVariables} onChange={e => setSecondaryVariables(e.target.value)} rows={2} className="mt-1 w-full p-2 border border-slate-300 rounded-md" placeholder="e.g., Length of hospital stay, mortality, severity score"></textarea>
                        </div>
                    </div>

                    {/* Feedback Side */}
                    <div className="space-y-4">
                        <button onClick={handleGetFeedback} disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition">
                            {loading ? 'Analyzing...' : 'Get AI Feedback on Methodology'}
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