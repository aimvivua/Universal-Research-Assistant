import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AIPersona, Language, HypothesisSuggestion, StudyDesignSuggestion, GroundingChunk, LiteratureSearchResult } from '../types';
import { AI_PERSONA_PROMPTS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A more user-friendly error could be shown in the UI
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * A robust function to find and parse a JSON object from a string.
 * It looks for the first '{' and the last '}' to extract the content.
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
      // FIX: Corrected typo from json_string to jsonString
      return JSON.parse(jsonString) as T;
    }
    return null;
  } catch (error) {
    console.error("Error parsing JSON from Gemini response:", error);
    return null;
  }
};


export const getProjectDetailsFromTitle = async (title: string) => {
    const prompt = `Based on the research project title "${title}", generate a concise set of primary and secondary research questions, and a primary and secondary hypothesis. Respond with ONLY a JSON object in the following format: { "primaryQuestions": "...", "secondaryQuestions": "...", "primaryHypothesis": "...", "secondaryHypothesis": "..." }`;

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
                }
            }
        }
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
    const prompt = `As a research assistant, find relevant academic papers and articles for the query: "${query}". Provide a concise summary of the findings from the top sources.`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });

    const summary = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];

    return { summary, sources };
};

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

export const translateText = async (text: string, targetLanguage: Language): Promise<string> => {
    if (targetLanguage === Language.English) return text;
    
    const prompt = `Translate the following text into ${targetLanguage}. Do not add any commentary, just provide the translation.\n\n${text}`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
};