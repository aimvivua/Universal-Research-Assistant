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
}

export interface ProjectOverviewData {
  title: string;
  primaryQuestions: string;
  secondaryQuestions: string;
  primaryHypothesis: string;
  secondaryHypothesis: string;
  studyDesign: string;
  sampleSize: string;
  studyDuration: string;
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
  projectTimeline: {
    tasks: TimelineTask[];
  };
  dataManagement: DataManagementData;
  citations: GroundingChunk[];
}

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