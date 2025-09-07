
import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import { translateText } from '../../services/geminiService';
import { USER_MANUAL_EN } from '../../constants';
import Loader from '../Loader';

const UserManual: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(Language.English);
    const [translatedManual, setTranslatedManual] = useState(USER_MANUAL_EN);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleTranslate = async () => {
            if (selectedLanguage === Language.English) {
                setTranslatedManual(USER_MANUAL_EN);
                return;
            }
            setLoading(true);
            try {
                const translation = await translateText(USER_MANUAL_EN, selectedLanguage);
                setTranslatedManual(translation);
            } catch (error) {
                console.error("Translation error:", error);
                setTranslatedManual("Sorry, translation failed. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        handleTranslate();
    }, [selectedLanguage]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">User Manual</h1>
                <div>
                    <label htmlFor="language-select" className="sr-only">Select Language</label>
                    <select
                        id="language-select"
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                        className="p-2 border border-slate-300 rounded-md bg-white"
                    >
                        {Object.values(Language).map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
                {loading ? <Loader rows={10} /> : (
                     <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: translatedManual }} />
                )}
            </div>
        </div>
    );
};

export default UserManual;
