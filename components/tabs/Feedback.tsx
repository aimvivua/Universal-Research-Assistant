import React, { useState } from 'react';
import { PaperAirplaneIcon } from '../icons/Icons';

const Feedback: React.FC = () => {
    const [feedbackText, setFeedbackText] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (feedbackText.trim().length < 10) {
            alert('Please provide at least 10 characters of feedback.');
            return;
        }

        const subject = encodeURIComponent('Feedback for Universal Research Assistant');
        const body = encodeURIComponent(feedbackText);
        const mailtoLink = `mailto:feedback@research-assistant.app?subject=${subject}&body=${body}`;

        // This will open the user's default email client
        window.location.href = mailtoLink;
        
        setIsSubmitted(true);
        setFeedbackText('');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Feedback & Support</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                {isSubmitted ? (
                    <div className="text-center py-10">
                        <h2 className="text-2xl font-semibold text-green-600 mb-4">Thank You!</h2>
                        <p className="text-slate-600">Your email client should have opened.</p>
                        <p className="text-slate-500 mt-2">We appreciate you taking the time to help us improve.</p>
                        <button 
                            onClick={() => setIsSubmitted(false)}
                            className="mt-6 bg-primary-600 text-white font-bold py-2 px-6 rounded-md hover:bg-primary-700 transition"
                        >
                            Submit More Feedback
                        </button>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-semibold text-slate-700 mb-2">Share Your Thoughts</h2>
                        <p className="text-slate-500 mb-6">
                            We'd love to hear what you think about the app. Let us know what's working well, what's not, or any ideas you have for new features!
                        </p>
                        <form onSubmit={handleSubmit}>
                            <textarea
                                value={feedbackText}
                                onChange={(e) => setFeedbackText(e.target.value)}
                                placeholder="Type your feedback here..."
                                className="w-full h-40 p-3 border border-slate-300 rounded-md focus:ring-2 focus:ring-primary-400 transition"
                                required
                                minLength={10}
                            />
                            <button
                                type="submit"
                                className="mt-4 w-full flex items-center justify-center space-x-2 bg-primary-600 text-white font-bold py-3 px-4 rounded-md hover:bg-primary-700 transition"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                                <span>Send Feedback</span>
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default Feedback;
