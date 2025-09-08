import React, { useState } from 'react';
import { searchLiterature } from '../../services/geminiService';
import { LiteratureSearchResult, ProjectOverviewData, GroundingChunk } from '../../types';
import Loader from '../Loader';
import { PlusCircleIcon } from '../icons/Icons';

interface LiteratureHubProps {
    projectData: ProjectOverviewData;
    citations: GroundingChunk[];
    onUpdateCitations: (citations: GroundingChunk[]) => void;
}

const LiteratureHub: React.FC<LiteratureHubProps> = ({ projectData, citations, onUpdateCitations }) => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<LiteratureSearchResult | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async (searchQuery: string = query) => {
        if (!searchQuery.trim()) {
            setError('Please enter a search query.');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);
        try {
            const searchResult = await searchLiterature(searchQuery);
            setResult(searchResult);
        } catch (e) {
            console.error(e);
            setError('An error occurred during the search. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleUseProjectTitle = () => {
        if (projectData.title) {
            setQuery(projectData.title);
        } else {
            alert("No project title set in the 'Project Overview' tab.");
        }
    }

    const handleAddCitation = (source: GroundingChunk) => {
        if (!citations.some(c => c.web.uri === source.web.uri)) {
            onUpdateCitations([...citations, source]);
        }
    };

    const handleRelatedQueryClick = (relatedQuery: string) => {
        setQuery(relatedQuery);
        handleSearch(relatedQuery);
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Literature Hub</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex gap-4 mb-4">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for academic papers, e.g., 'biomarkers for neonatal sepsis'"
                        className="flex-grow p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-400"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                     <button onClick={handleUseProjectTitle} className="bg-amber-500 text-white font-bold py-2 px-4 rounded-md hover:bg-amber-600 transition text-sm">Use Project Title</button>
                    <button onClick={() => handleSearch()} disabled={loading} className="bg-primary-600 text-white font-bold py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-primary-300 transition">
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                {loading && <Loader rows={8}/>}

                {result && (
                    <div className="mt-6 border-t pt-6">
                        <h2 className="text-2xl font-semibold text-slate-700 mb-4">Search Results</h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h3 className="text-lg font-semibold text-indigo-800">AI Summary</h3>
                                <p className="text-slate-700 whitespace-pre-wrap mb-6 bg-indigo-50 p-4 rounded-md border border-indigo-200">{result.summary}</p>
                                
                                <h3 className="text-lg font-semibold text-indigo-800">Sources Found</h3>
                                {result.sources.length > 0 ? (
                                    <ul className="space-y-3">
                                        {result.sources.map((source, index) => {
                                            const isSaved = citations.some(c => c.web.uri === source.web.uri);
                                            return (
                                                <li key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                                                    <a 
                                                        href={source.web.uri} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-primary-600 hover:text-primary-800 hover:underline flex-1 truncate"
                                                        title={source.web.title || 'Untitled Source'}
                                                    >
                                                        {index + 1}. {source.web.title || 'Untitled Source'}
                                                    </a>
                                                    <button 
                                                        onClick={() => handleAddCitation(source)} 
                                                        disabled={isSaved}
                                                        className="ml-4 flex items-center space-x-1 text-sm font-medium px-3 py-1 rounded-full transition disabled:cursor-not-allowed"
                                                        title={isSaved ? "Already in your citations" : "Add to citations"}
                                                        aria-label={isSaved ? "Already in your citations" : "Add to citations"}
                                                    >
                                                        {isSaved ? (
                                                            <span className="text-green-600 font-semibold">Saved</span>
                                                        ) : (
                                                            <>
                                                                <PlusCircleIcon className="w-5 h-5 text-indigo-500 hover:text-indigo-700"/>
                                                                <span className="text-indigo-600 hover:text-indigo-800 hidden md:inline">Add</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="text-slate-500">No specific web sources were cited for this summary.</p>
                                )}
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-indigo-800">Key Themes</h3>
                                    <ul className="list-disc list-inside space-y-2 mt-2 text-sm text-slate-600">
                                        {result.keyThemes.map((theme, i) => <li key={i}>{theme}</li>)}
                                    </ul>
                                </div>
                                 <div>
                                    <h3 className="text-lg font-semibold text-indigo-800">Related Searches</h3>
                                    <div className="flex flex-col items-start space-y-2 mt-2">
                                        {result.relatedQueries.map((rq, i) => (
                                            <button key={i} onClick={() => handleRelatedQueryClick(rq)} className="text-sm text-primary-600 hover:underline text-left">
                                                {rq}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiteratureHub;