import React, { useState } from 'react';
import { GroundingChunk } from '../../types';
import { TrashIcon, ClipboardDocumentIcon } from '../icons/Icons';

interface CitationsManagerProps {
    citations: GroundingChunk[];
    onUpdateCitations: (citations: GroundingChunk[]) => void;
}

const CitationsManager: React.FC<CitationsManagerProps> = ({ citations, onUpdateCitations }) => {
    const [copyStatus, setCopyStatus] = useState('Copy Bibliography');

    const handleRemove = (uri: string) => {
        onUpdateCitations(citations.filter(c => c.web.uri !== uri));
    };

    const handleCopy = () => {
        if (citations.length === 0) return;
        
        const bibliography = citations.map((c, index) => {
            const title = c.web.title || "Untitled";
            const uri = c.web.uri;
            return `${index + 1}. ${title}. Retrieved from ${uri}`;
        }).join('\n\n');

        navigator.clipboard.writeText(bibliography).then(() => {
            setCopyStatus('Copied!');
            setTimeout(() => setCopyStatus('Copy Bibliography'), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
            setCopyStatus('Copy Failed');
            setTimeout(() => setCopyStatus('Copy Bibliography'), 2000);
        });
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Citations Manager</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-semibold text-slate-700">Saved Sources ({citations.length})</h2>
                    <button 
                        onClick={handleCopy}
                        disabled={citations.length === 0}
                        className="flex items-center space-x-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition"
                    >
                        <ClipboardDocumentIcon className="w-5 h-5" />
                        <span>{copyStatus}</span>
                    </button>
                </div>

                {citations.length > 0 ? (
                    <ul className="space-y-4">
                        {citations.map((citation, index) => (
                            <li key={citation.web.uri} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-200">
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
                                <button 
                                    onClick={() => handleRemove(citation.web.uri)}
                                    className="ml-4 text-slate-400 hover:text-red-500 transition"
                                    title="Remove citation"
                                    aria-label="Remove citation"
                                >
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
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
