import React, { useState } from 'react';
import { AIPersona } from '../../types';
import { reviewDraftWithPersona, suggestTitleAndAbstract } from '../../services/geminiService';
import Loader from '../Loader';
import { UserVoiceIcon, BrainCircuitIcon, BalanceScaleIcon, GlobeCommunityIcon, DocumentTextIcon } from '../icons/Icons';

const personaDetails = {
    [AIPersona.SubjectGuide]: {
        icon: UserVoiceIcon,
        description: "Focuses on scientific accuracy, clarity, and relevance.",
        color: "blue"
    },
    [AIPersona.Biostatistician]: {
        icon: BrainCircuitIcon,
        description: "Checks methodology, sample size, and statistical tests.",
        color: "green"
    },
    [AIPersona.EthicsTeacher]: {
        icon: BalanceScaleIcon,
        description: "Reviews for ethical considerations like consent and privacy.",
        color: "purple"
    },
    [AIPersona.CommunityMedicineExpert]: {
        icon: GlobeCommunityIcon,
        description: "Assesses public health relevance and practical feasibility.",
        color: "yellow"
    }
};


const AIDraftReviewer: React.FC = () => {
    const [draft, setDraft] = useState('');
    const [review, setReview] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTask, setActiveTask] = useState<string | null>(null);

    const handleReviewRequest = async (persona: AIPersona) => {
        if (!draft.trim()) {
            alert("Please paste your draft first.");
            return;
        }
        setLoading(true);
        setReview('');
        setActiveTask(persona);
        try {
            const result = await reviewDraftWithPersona(draft, persona);
            setReview(result);
        } catch (error) {
            console.error("Error getting review:", error);
            setReview("Sorry, an error occurred while fetching the review.");
        } finally {
            setLoading(false);
            setActiveTask(null);
        }
    };
    
    const handleSuggestTitle = async () => {
         if (!draft.trim()) {
            alert("Please paste your draft first.");
            return;
        }
        setLoading(true);
        setReview('');
        setActiveTask('title');
        try {
            const result = await suggestTitleAndAbstract(draft);
            setReview(result);
        } catch (error) {
            console.error("Error getting suggestions:", error);
            setReview("Sorry, an error occurred while fetching suggestions.");
        } finally {
            setLoading(false);
            setActiveTask(null);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">AI Draft Reviewer</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-slate-700 mb-4">Your Draft</h2>
                    <textarea 
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Paste your research draft here..."
                        className="w-full h-96 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition"
                    />
                </div>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-slate-700 mb-2">Choose an AI Task</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.values(AIPersona).map((persona) => {
                            const details = personaDetails[persona];
                            const Icon = details.icon;
                            return (
                                <button
                                    key={persona}
                                    onClick={() => handleReviewRequest(persona)}
                                    disabled={loading}
                                    className={`p-4 border rounded-lg text-left transition hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white`}
                                >
                                    <Icon className={`w-8 h-8 mb-2 text-indigo-500`} />
                                    <h3 className="font-bold text-slate-800">{persona}</h3>
                                    <p className="text-sm text-slate-500">{details.description}</p>
                                </button>
                            );
                        })}
                    </div>
                     <button
                        onClick={handleSuggestTitle}
                        disabled={loading}
                        className={`w-full p-4 border rounded-lg text-left transition hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white flex items-center space-x-4`}
                    >
                        <DocumentTextIcon className={`w-8 h-8 text-indigo-500`} />
                        <div>
                            <h3 className="font-bold text-slate-800">Suggest Title & Abstract</h3>
                            <p className="text-sm text-slate-500">Generate a compelling title and a concise abstract from your draft.</p>
                        </div>
                    </button>

                    <div className="bg-white p-6 rounded-lg shadow-md min-h-[20rem]">
                         <h2 className="text-xl font-semibold text-slate-700 mb-4">AI Feedback</h2>
                         {loading ? <Loader /> : (
                            <div className="text-slate-700 whitespace-pre-wrap text-sm">{review || "Your review will appear here..."}</div>
                         )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AIDraftReviewer;