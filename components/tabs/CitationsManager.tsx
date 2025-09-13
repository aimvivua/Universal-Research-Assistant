import React, { useState } from 'react';
import { GroundingChunk } from '../../types';
import { TrashIcon, ClipboardDocumentIcon, LightbulbIcon } from '../icons/Icons';
import { formatCitations, summarizeSourceByTitle } from '../../services/geminiService';

interface CitationsManagerProps {
    citations: GroundingChunk[];
    onUpdateCitations: (citations: GroundingChunk[]) => void;
}

const CITATION_STYLES = ['APA', 'Vancouver', 'MLA', 'Chicago'];

const CitationsManager: React.FC<CitationsManagerProps> = ({ citations, onUpdateCitations }) => {
    const [copyStatus, setCopyStatus] = useState('Copy Bibliography');
    const [style, setStyle] = useState('APA');
    const [isFormatting, setIsFormatting] = useState(false);
    const [summaries, setSummaries] = useState<Record<string, string>>({});
    const [loadingSummary, setLoadingSummary] = useState<string | null>(null);

    const handleRemove = (uri: string) => {
        onUpdateCitations(citations.filter(c => c.web.uri !== uri));
    };

    const handleCopy = async () => {
        if (citations.length === 0) return;
        
        setIsFormatting(true);
        try {
            const bibliography = await formatCitations(citations, style);
            navigator.clipboard.writeText(bibliography).then(() => {
                setCopyStatus('Copied!');
                setTimeout(() => setCopyStatus('Copy Bibliography'), 2000);
            }, (err) => {
                console.error('Could not copy text: ', err);
                setCopyStatus('Copy Failed');
                 setTimeout(() => setCopyStatus('Copy Bibliography'), 2000);
            });
        } catch(error) {
             console.error('Could not format citations: ', error);
             setCopyStatus('Format Failed');
             setTimeout(() => setCopyStatus('Copy Bibliography'), 2000);
        } finally {
            setIsFormatting(false);
        }
    };
    
    const handleSummarize = async (uri: string, title: string) => {
        setLoadingSummary(uri);
        try {
            const summary = await summarizeSourceByTitle(title);
            setSummaries(prev => ({ ...prev, [uri]: summary }));
        } catch(err) {
            console.error("Error summarizing source:", err);
            setSummaries(prev => ({ ...prev, [uri]: "Could not generate summary." }));
        } finally {
            setLoadingSummary(null);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Citations Manager</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-semibold text-slate-700">Saved Sources ({citations.length})</h2>
                    <div className="flex items-center space-x-2">
                         <select
                            value={style}
                            onChange={(e) => setStyle(e.target.value)}
                            className="p-2 border border-slate-300 rounded-md bg-white text-sm"
                         >
                            {CITATION_STYLES.map(s => <option key={s} value={s}>{s} Style</option>)}
                        </select>
                        <button 
                            onClick={handleCopy}
                            disabled={citations.length === 0 || isFormatting}
                            className="flex items-center space-x-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition"
                        >
                            <ClipboardDocumentIcon className="w-5 h-5" />
                            <span>{isFormatting ? 'Formatting...' : copyStatus}</span>
                        </button>
                    </div>
                </div>

                {citations.length > 0 ? (
                    <ul className="space-y-4">
                        {citations.map((citation, index) => (
                            <li key={citation.web.uri} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1 truncate">
                                        <span className="text-slate-500 mr-2">{index + 1}.</span>
                                        <a
                                            href={citation.web.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="font-medium text-primary-700 hover:underline"
                                            title={citation.web.title || 'Untitled Source'}
                                        >
                                            {citation.web.title || 'Untitled Source'}
                                        </a>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => handleSummarize(citation.web.uri, citation.web.title || '')}
                                            disabled={!!loadingSummary}
                                            className="text-slate-400 hover:text-indigo-500 transition"
                                            title="Summarize with AI"
                                        >
                                            <LightbulbIcon className="w-5 h-5"/>
                                        </button>
                                        <button 
                                            onClick={() => handleRemove(citation.web.uri)}
                                            className="text-slate-400 hover:text-red-500 transition"
                                            title="Remove citation"
                                            aria-label="Remove citation"
                                        >
                                            <TrashIcon className="w-5 h-5"/>
                                        </button>
                                    </div>
                                </div>
                                {loadingSummary === citation.web.uri && <div className="text-sm text-slate-500 mt-2">Summarizing...</div>}
                                {summaries[citation.web.uri] && (
                                    <div className="mt-2 pt-2 border-t border-slate-200 text-sm text-slate-600">
                                        <p><strong className="font-medium text-indigo-700">AI Summary:</strong> {summaries[citation.web.uri]}</p>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-slate-500">You haven't saved any citations yet.</p>
                        <p className="text-slate-400 text-sm mt-2">Go to the 'Literature Hub' to search for articles and add them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CitationsManager;