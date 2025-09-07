
import { AppState, Tab, AIPersona } from './types';
import { 
    BookOpenIcon, ChartBarIcon, BeakerIcon, UsersIcon, DocumentTextIcon, 
    SparklesIcon, ClipboardDocumentListIcon, CalendarDaysIcon, QuestionMarkCircleIcon, WrenchScrewdriverIcon, BookmarkSquareIcon
} from './components/icons/Icons';

export const TABS = [
  { id: Tab.ProjectOverview, icon: BookOpenIcon },
  { id: Tab.ResearchersGuide, icon: UsersIcon },
  { id: Tab.LiteratureHub, icon: BeakerIcon },
  { id: Tab.CitationsManager, icon: BookmarkSquareIcon },
  { id: Tab.StudyMethodology, icon: WrenchScrewdriverIcon },
  { id: Tab.BiostatisticsToolkit, icon: ChartBarIcon },
  { id: Tab.DataManagement, icon: ClipboardDocumentListIcon },
  { id: Tab.AIDraftReviewer, icon: SparklesIcon },
  { id: Tab.FormGenerator, icon: DocumentTextIcon },
  { id: Tab.ProjectTimeline, icon: CalendarDaysIcon },
  { id: Tab.UserManual, icon: QuestionMarkCircleIcon },
];

export const INITIAL_STATE: AppState = {
  projectOverview: {
    title: '',
    primaryQuestions: '',
    secondaryQuestions: '',
    primaryHypothesis: '',
    secondaryHypothesis: '',
  },
  projectTimeline: {
    tasks: [
      { id: 1, name: 'Protocol Writing', start: '2024-08-01', end: '2024-08-15', progress: 50 },
      { id: 2, name: 'Ethics Committee Submission', start: '2024-08-16', end: '2024-08-20', progress: 20 },
      { id: 3, name: 'Data Collection', start: '2024-09-01', end: '2024-11-30', progress: 0 },
    ],
  },
  dataManagement: {
    columns: [
      { id: 1, name: 'PatientID' },
      { id: 2, name: 'Age' },
      { id: 3, name: 'Sex' },
    ],
    rows: [
      { 'PatientID': 'P001', 'Age': '28', 'Sex': 'F' },
      { 'PatientID': 'P002', 'Age': '34', 'Sex': 'M' },
    ]
  },
  citations: [],
};

export const AI_PERSONA_PROMPTS: Record<AIPersona, string> = {
  [AIPersona.SubjectGuide]: `You are a Subject Matter Expert and Guide for a post-graduate medical student. Review the following research draft. Provide constructive feedback on the scientific accuracy, clarity of concepts, and relevance to the field. Focus on the core subject matter. Be encouraging but critical. Structure your feedback into 'Strengths' and 'Areas for Improvement'.`,
  [AIPersona.Biostatistician]: `You are an expert Biostatistician. Review the following research draft, paying close attention to the methodology, sample size calculation, statistical tests mentioned, and the presentation of data. Your feedback should be precise, technical, and focused solely on the statistical aspects. Identify any potential flaws or areas where the statistical approach could be strengthened.`,
  [AIPersona.EthicsTeacher]: `You are a Professor of Medical Ethics. Review this research draft from an ethical standpoint. Consider patient consent, data privacy, potential for bias, and the overall ethical conduct of the study as described. Your feedback should highlight any ethical concerns and suggest best practices.`,
  [AIPersona.CommunityMedicineExpert]: `You are an expert in Community Medicine and Public Health. Review this research draft for its public health relevance, feasibility in a real-world community setting, and potential impact. Comment on the study's design from a practical, population-based perspective.`,
};

export const LOADER_MESSAGES = [
    "Brewing some AI magic...",
    "Latest Hit: 'Chaleya' from Jawan",
    "Cricket Update: IND 175/3 (20 ov)",
    "Consulting the digital sages...",
    "Fact-checking the facts...",
    "This is better than waiting for a bus, right?",
    "Today's earworm: 'Heeriye' by Arijit Singh",
    "Cricket Update: AUS 150/5 (18.2 ov)",
    "Don't worry, the AI is a professional.",
    "Almost there, just polishing the pixels.",
    "Viral Tune: 'What Jhumka?'",
    "Cricket Update: ENG needs 12 runs in 3 balls",
];

export const RESEARCH_GUIDE_STEPS = [
    {
        title: "Step 1: Formulate the Research Question",
        content: "The first and most critical step. A good research question should be FINER: Feasible, Interesting, Novel, Ethical, and Relevant.",
        indiaTip: "Consider local health priorities and resource availability. Topics relevant to the Indian population can have a significant impact."
    },
    {
        title: "Step 2: Comprehensive Literature Review",
        content: "Understand what is already known about the topic. Identify gaps in the existing literature that your research can fill. Use databases like PubMed, Scopus, and Google Scholar.",
        indiaTip: "Look for Indian journals and research from institutions like ICMR to understand the local context and previous work done in the country."
    },
    {
        title: "Step 3: Develop a Hypothesis",
        content: "A clear, testable statement that you will attempt to prove or disprove. It's the central argument of your research.",
        indiaTip: "Your hypothesis can be informed by observations in local clinics or community settings, making it more relevant."
    },
    {
        title: "Step 4: Design the Study",
        content: "Choose your study design (e.g., cross-sectional, cohort, case-control, randomized controlled trial). Define your population, sampling method, and variables.",
        indiaTip: "Prospective cohort studies can be challenging in India due to patient follow-up issues. Cross-sectional or hospital-based studies are often more feasible."
    },
    {
        title: "Step 5: Write the Research Protocol",
        content: "A detailed plan of your study. It includes the background, objectives, methodology, statistical plan, and ethical considerations. This is your blueprint.",
        indiaTip: "Be very detailed in your methodology, as ethics committees in India are meticulous about procedural clarity."
    },
    {
        title: "Step 6: Obtain Ethical Clearance",
        content: "Submit your protocol to the Institutional Ethics Committee (IEC). No data collection can begin before you receive formal approval.",
        indiaTip: "The process can take time. Prepare your documents carefully, including consent forms in local languages."
    },
    {
        title: "Step 7: Data Collection",
        content: "Execute your study plan. This phase requires meticulous record-keeping and adherence to the protocol. Use your Case Report Form (CRF) for standardized data entry.",
        indiaTip: "Language barriers and varying literacy levels can be a challenge. Ensure your data collection team is well-trained."
    },
    {
        title: "Step 8: Data Analysis and Interpretation",
        content: "Use appropriate statistical software (like SPSS, R, or even this app's toolkit!) to analyze your data. Interpret the results in the context of your hypothesis and existing literature.",
        indiaTip: "Consult a biostatistician if you're unsure. Correct analysis is crucial for the validity of your findings."
    },
    {
        title: "Step 9: Manuscript Writing and Publication",
        content: "Write your research paper following the IMRaD (Introduction, Methods, Results, and Discussion) structure. Submit it to a suitable journal for peer review and publication.",
        indiaTip: "Consider publishing in indexed national journals to contribute to the Indian scientific community before aiming for international publications."
    }
];

export const USER_MANUAL_EN = `
<h2 class="text-2xl font-bold text-slate-800 mb-4">User Manual</h2>

<h3 class="text-xl font-semibold text-primary-700 mt-6 mb-2">1. Project Overview</h3>
<p>This is your project's dashboard. Start by entering a <strong>Title</strong>. When you click away, our AI will automatically suggest research questions and hypotheses to get you started. You can also manually trigger AI suggestions for <strong>Hypotheses</strong> and <strong>Study Design</strong>.</p>

<h3 class="text-xl font-semibold text-primary-700 mt-6 mb-2">2. Literature Hub & Citations Manager</h3>
<p>Use the <strong>Literature Hub</strong> to search for academic papers. For each source found, you can click the 'Add' button to save it. All your saved sources appear in the <strong>Citations Manager</strong>, where you can copy a formatted bibliography to your clipboard.</p>

<h3 class="text-xl font-semibold text-primary-700 mt-6 mb-2">3. AI Draft Reviewer</h3>
<p>Paste your research draft into the text area. Choose one of the four AI personas for a specialized review:</p>
<ul class="list-disc list-inside space-y-1 pl-4">
    <li><strong>Subject Guide:</strong> For feedback on scientific content and accuracy.</li>
    <li><strong>Biostatistician:</strong> For a rigorous check of your methods and stats.</li>
    <li><strong>Ethics Teacher:</strong> To ensure your study is ethically sound.</li>
    <li><strong>Community Medicine Expert:</strong> For feedback on public health relevance and feasibility.</li>
</ul>

<h3 class="text-xl font-semibold text-primary-700 mt-6 mb-2">4. Form Generator</h3>
<p>Automatically generate essential documents based on the data from your <strong>Project Overview</strong> tab. You can create a <strong>Case Report Form (CRF)</strong> for data collection and an <strong>Ethics Committee Application</strong>. Use the "Print" button to get a hard copy.</p>

<h3 class="text-xl font-semibold text-primary-700 mt-6 mb-2">5. Data Management</h3>
<p>Define your study's variables by adding or removing columns. Enter your collected data row by row. You can export your entire dataset to a CSV file for use in other statistical software.</p>

<h3 class="text-xl font-semibold text-primary-700 mt-6 mb-2">6. Project Timeline</h3>
<p>Visualize your research schedule with an interactive Gantt chart. Add new tasks, set start and end dates, and update the progress percentage to stay on track.</p>

<h3 class="text-xl font-semibold text-primary-700 mt-6 mb-2">General Tip</h3>
<p>All your data is saved automatically to your browser's local storage. You can close the tab and come back anytime. Use the <strong>Reset App Data</strong> button in the sidebar if you want to start a completely new project from scratch.</p>
`;