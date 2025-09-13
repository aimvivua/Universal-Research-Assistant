export enum Tab {
  ProjectOverview = 'Project Overview',
  ResearchersGuide = "Researcher's Guide",
  LiteratureHub = "Literature Hub",
  CitationsManager = "Citations Manager",
  StudyMethodology = "Study Methodology",
  BiostatisticsToolkit = "Biostatistics Toolkit",
  DataManagement = "Data Management",
  AIDraftReviewer = "AI Draft Reviewer",
  FormGenerator = "Form Generator",
  ProjectTimeline = "Project Timeline",
  UserManual = "User Manual",
  Feedback = "Feedback & Support",
}

export interface ProjectOverviewData {
  title: string;
  primaryQuestions: string;
  secondaryQuestions: string;
  primaryHypothesis: string;
  secondaryHypothesis: string;
  keywords: string;
  ethicalConsiderations: string;
}

export interface StudyMethodologyData {
  studyType: string;
  inclusionCriteria: string;
  exclusionCriteria: string;
  primaryVariables: string;
  secondaryVariables: string;
  samplingMethod: string;
}

export interface TimelineTask {
  id: number;
  name: string;
  start: string;
  end: string;
  progress: number;
}

export interface DataManagementData {
  columns: { id: number; name: string }[];
  rows: Record<string, string>[];
}

export interface AppState {
  projectOverview: ProjectOverviewData;
  studyMethodology: StudyMethodologyData;
  projectTimeline: {
    tasks: TimelineTask[];
  };
  dataManagement: DataManagementData;
  citations: GroundingChunk[];
}

export type ProjectsState = Record<string, AppState>;

export enum AIPersona {
  SubjectGuide = 'Subject Guide',
  Biostatistician = 'Biostatistician',
  EthicsTeacher = 'Ethics Teacher',
  CommunityMedicineExpert = 'Community Medicine Expert',
}

export enum Language {
    English = 'English',
    Hindi = 'Hindi',
    Marathi = 'Marathi',
    Malayalam = 'Malayalam',
    Tamil = 'Tamil',
}

// For structured AI suggestions
export interface HypothesisSuggestion {
    primary: string;
    secondary: string;
}

export interface StudyDesignSuggestion {
    design: string;
    justification: string;
    sampleSize: string;
    duration: string;
}

// For Literature Hub with Google Search grounding
export interface GroundingChunk {
    web: {
        uri: string;
        title: string;
    };
}

export interface LiteratureSearchResult {
    summary: string;
    sources: GroundingChunk[];
    keyThemes: string[];
    relatedQueries: string[];
}

export interface JournalSuggestion {
    name: string;
    scope: string;
    reason: string;
}