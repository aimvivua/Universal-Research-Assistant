import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AIPersona, Language, HypothesisSuggestion, StudyDesignSuggestion, GroundingChunk, LiteratureSearchResult, TimelineTask, DataManagementData, JournalSuggestion } from '../types';
import { AI_PERSONA_PROMPTS } from '../constants';

// The API key is now provided by `config.js`, which is generated during the Vercel build process.
const API_KEY = (window as any).GEMINI_API_KEY;

if (!API_KEY) {
  // This error will be shown in the browser console if the key is missing.
  // The build process should prevent this from happening in a deployed environment.
  throw new Error("API_KEY is not configured. The application cannot start.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * A robust function to find and parse a JSON object from a string.
 * It looks for the first '{' or '[' and the last '}' or ']' to extract the content.
 * @param text The string potentially containing a JSON object.
 * @returns The parsed object or null if parsing fails.
 */
export const parseGeminiJson = <T,>(text: string): T | null => {
  try {
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
      const jsonString = text.substring(startIndex, endIndex + 1);
      return JSON.parse(jsonString) as T;
    }
    const arrayStartIndex = text.indexOf('[');
    const arrayEndIndex = text.lastIndexOf(']');
     if (arrayStartIndex > -1 && arrayEndIndex > -1 && arrayEndIndex > arrayStartIndex) {
      const jsonString = text.substring(arrayStartIndex, arrayEndIndex + 1);
      return JSON.parse(jsonString) as T;
    }
    return null;
  } catch (error) {
    console.error("Error parsing JSON from Gemini response:", error);
    return null;
  }
};


export const getProjectDetailsFromTitle = async (title: string) => {
    const prompt = `Based on the research project title "${title}", generate a concise set of primary and secondary research questions, a primary and secondary hypothesis, a list of 5-7 relevant keywords as a comma-separated string, and a brief paragraph on potential ethical considerations. Respond with ONLY a JSON object in the following format: { "primaryQuestions": "...", "secondaryQuestions": "...", "primaryHypothesis": "...", "secondaryHypothesis": "...", "keywords": "...", "ethicalConsiderations": "..." }`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    primaryQuestions: { type: Type.STRING },
                    secondaryQuestions: { type: Type.STRING },
                    primaryHypothesis: { type: Type.STRING },
                    secondaryHypothesis: { type: Type.STRING },
                    keywords: { type: Type.STRING },
                    ethicalConsiderations: { type: Type.STRING },
                }
            }
        }
    });

    return response.text;
};

export const refineText = async (textToRefine: string, instruction: string): Promise<string> => {
    const prompt = `Given the following text:\n\n"${textToRefine}"\n\nPlease refine it based on this instruction: "${instruction}". Respond with only the refined text.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};


export const getHypothesisSuggestion = async (title: string, questions: string): Promise<HypothesisSuggestion | null> => {
    const prompt = `Based on the research title "${title}" and primary questions "${questions}", suggest a primary and secondary hypothesis. Respond with ONLY a JSON object in the format: { "primary": "...", "secondary": "..." }`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    primary: { type: Type.STRING },
                    secondary: { type: Type.STRING },
                }
            }
        }
    });
    return parseGeminiJson<HypothesisSuggestion>(response.text);
};

export const getStudyDesignSuggestion = async (title: string, questions: string): Promise<StudyDesignSuggestion | null> => {
    const prompt = `Based on the research title "${title}" and primary questions "${questions}", suggest a suitable Study Design, a brief justification for it, a calculated Sample Size with assumptions, and an estimated Study Duration. Respond with ONLY a JSON object in the format: { "design": "...", "justification": "...", "sampleSize": "...", "duration": "..." }`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    design: { type: Type.STRING },
                    justification: { type: Type.STRING },
                    sampleSize: { type: Type.STRING },
                    duration: { type: Type.STRING },
                }
            }
        }
    });
    return parseGeminiJson<StudyDesignSuggestion>(response.text);
};


export const searchLiterature = async (query: string): Promise<LiteratureSearchResult> => {
    const prompt = `As a research assistant, find relevant academic papers for the query: "${query}". Provide a concise summary, extract up to 5 key themes from the findings, and suggest 3 related search queries to help the user explore further.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const parsedResult = parseGeminiJson<Omit<LiteratureSearchResult, 'sources'>>(response.text);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    // Manually construct the response object from potentially non-JSON text
    const summaryMatch = response.text.match(/summary"*:*"(.+?)"/);
    const summary = summaryMatch ? summaryMatch[1].trim() : "Could not generate summary.";
    
    const keyThemesMatch = response.text.match(/keyThemes"*:*\[(.*?)\]/s);
    const keyThemes = keyThemesMatch ? keyThemesMatch[1].split(',').map(s => s.replace(/"/g, '').trim()).filter(Boolean) : [];

    const relatedQueriesMatch = response.text.match(/relatedQueries"*:*\[(.*?)\]/s);
    const relatedQueries = relatedQueriesMatch ? relatedQueriesMatch[1].split(',').map(s => s.replace(/"/g, '').trim()).filter(Boolean) : [];

    return { 
        summary: parsedResult?.summary || summary,
        keyThemes: parsedResult?.keyThemes || keyThemes,
        relatedQueries: parsedResult?.relatedQueries || relatedQueries,
        sources 
    };
};

export const formatCitations = async (citations: GroundingChunk[], style: string): Promise<string> => {
    const prompt = `Given the following list of sources in JSON format: ${JSON.stringify(citations.map(c => c.web))}, format them into a bibliography using the ${style} citation style. Provide only the formatted text, with each entry separated by two newlines for clarity.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
}

export const reviewMethodology = async (projectContext: string, methodology: string): Promise<string> => {
    const prompt = `As an expert research methodologist, please review the following study design.
    
    Project Context: ${projectContext}
    
    Proposed Methodology: ${methodology}
    
    Provide constructive feedback on the chosen study type, inclusion/exclusion criteria, and variables. Check for consistency, potential biases, and suggest improvements. Structure your feedback into 'Strengths' and 'Areas for Improvement'.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

export const suggestMethodologyField = async (projectContext: string, field: 'Inclusion Criteria' | 'Exclusion Criteria' | 'Primary Variables' | 'Secondary Variables'): Promise<string> => {
    const prompt = `For a research project with the context: "${projectContext}", suggest a list of appropriate ${field}. Provide a concise, bulleted list.`;
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
}

export const suggestSamplingMethod = async (projectContext: string): Promise<string> => {
    const prompt = `Based on the research context: "${projectContext}", suggest a suitable sampling method and provide a brief justification for it. Respond with only the text.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
}

export const getTipsForStep = async (stepTitle: string, projectContext: string): Promise<string> => {
    const prompt = `For a research project with the context: "${projectContext}", provide tailored, practical tips for the following step: "${stepTitle}". The tips should be concise and actionable.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

export const reviewDraftWithPersona = async (draft: string, persona: AIPersona): Promise<string> => {
    const systemInstruction = AI_PERSONA_PROMPTS[persona];
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: draft,
        config: {
            systemInstruction: systemInstruction,
        }
    });
    return response.text;
};

export const suggestTitleAndAbstract = async (draft: string): Promise<string> => {
    const prompt = `Based on the following research draft, please suggest 3 potential titles and a concise abstract (around 250 words).\n\nDraft:\n${draft}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
}

export const suggestJournals = async (draft: string): Promise<JournalSuggestion[]> => {
    const prompt = `Based on the following research draft, suggest 3 suitable academic journals for publication. For each journal, provide its name, a brief description of its scope, and why it's a good fit for this paper. Respond with ONLY a JSON array in the format: [{ "name": "...", "scope": "...", "reason": "..." }]`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        scope: { type: Type.STRING },
                        reason: { type: Type.STRING },
                    }
                }
            }
        }
    });

    return parseGeminiJson<JournalSuggestion[]>(response.text) || [];
}

export const summarizeSourceByTitle = async (title: string): Promise<string> => {
    const prompt = `Provide a concise, 2-3 sentence academic summary of a potential research paper with the title: "${title}".`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};

export const generateSampleData = async (columns: {id: number, name: string}[], rowCount: number): Promise<Record<string, string>[]> => {
    const columnNames = columns.map(c => c.name);
    const prompt = `Generate ${rowCount} rows of realistic sample data for a table with the following columns: ${columnNames.join(', ')}. Respond with ONLY a JSON array of objects.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        }
    });

    return parseGeminiJson<Record<string, string>[]>(response.text) || [];
}

export const suggestAnalysisPlan = async (columns: {id: number, name: string}[]): Promise<string> => {
    const columnNames = columns.map(c => c.name);
    const prompt = `For a study with the following variables: ${columnNames.join(', ')}, suggest a basic data analysis plan. For each potential analysis, state which variables it applies to and what statistical test would be appropriate. Format as a bulleted list.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text;
}

export const suggestTimelineTasks = async (projectContext: string): Promise<Partial<TimelineTask>[]> => {
    const today = new Date().toISOString().split('T')[0];
    const prompt = `Today's date is ${today}. Based on the research project context: "${projectContext}", suggest a list of timeline tasks with realistic start and end dates. Respond with ONLY a JSON array in the format: [{ "name": "...", "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" }]`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
             responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        start: { type: Type.STRING },
                        end: { type: Type.STRING },
                    }
                }
            }
        }
    });
    return parseGeminiJson<Partial<TimelineTask>[]>(response.text) || [];
}

export const interpretTTest = async (group1: string, group2: string, t: number, df: number): Promise<string> => {
    const prompt = `In a research study, an unpaired t-test was performed.
    Group 1 data: ${group1}
    Group 2 data: ${group2}
    The calculated t-statistic is ${t.toFixed(4)} with ${df} degrees of freedom.
    Please provide a simple, plain-language interpretation of what this result means. Is the difference likely to be statistically significant?`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
}

export const interpretChiSquare = async (data: Record<string, number>, chi2: number): Promise<string> => {
    const prompt = `In a research study, a chi-square test was performed on a 2x2 table with the following observed frequencies:
    Cell A (Group 1, Outcome 1): ${data.a}
    Cell B (Group 1, Outcome 2): ${data.b}
    Cell C (Group 2, Outcome 1): ${data.c}
    Cell D (Group 2, Outcome 2): ${data.d}
    The calculated Chi-Square value is ${chi2.toFixed(4)}.
    Please provide a simple, plain-language interpretation of what this result suggests about the association between the groups and outcomes.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    return response.text;
}


export const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
    if (targetLanguage === Language.English) return text;
    
    const prompt = `Translate the following text into ${targetLanguage}. Do not add any commentary, just provide the translation.\n\n${text}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};