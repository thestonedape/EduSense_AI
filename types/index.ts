export type StudentSubject = {
  id: string;
  name: string;
  code: string;
  lectureCount: number;
  referenceCount: number;
  description: string;
  departmentName?: string | null;
  programName?: string | null;
  latestLectureDate?: string | null;
};

export type StudentLectureSummary = {
  id: string;
  subjectId: string;
  lectureName: string;
  lectureNumber?: number | null;
  lectureDate?: string | null;
  facultyName?: string | null;
  summary: string;
  topicCount: number;
  referenceCount: number;
  validationSource: string;
};

export type LectureStatus = "completed" | "in_progress" | "not_started";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export type StudentTopic = {
  id: string;
  title: string;
  summary: string;
  source: string;
};

export type StudentLectureDetail = {
  id: string;
  subjectId: string;
  lectureName: string;
  subjectName?: string | null;
  subjectCode?: string | null;
  departmentName?: string | null;
  programName?: string | null;
  lectureNumber?: number | null;
  lectureDate?: string | null;
  facultyName?: string | null;
  summary: string;
  referenceFiles: string[];
  topics: StudentTopic[];
  recommendedQuestions: string[];
  validationSource: string;
};

export type StudentSubjectDetail = {
  subject: StudentSubject;
  lectures: StudentLectureSummary[];
};

export type StudentDashboardStats = {
  trackedLectures: number;
  completedLectures: number;
  quizAttempts: number;
  savedChats: number;
};

export type StudentDashboardData = {
  stats: StudentDashboardStats;
  recentLectures: StudentLectureSummary[];
};

export type StudentChatCitation = {
  topic: string;
  source: string;
  excerpt: string;
};

export type StudentChatResponse = {
  response: string;
  citations: StudentChatCitation[];
};

export type StudentDoubtResponse = {
  response: string;
  citations: StudentChatCitation[];
  scopeLabel: string;
  structuredAnswer?: {
    coreConcept?: string | null;
    simpleExplanation?: string | null;
    deepExplanation?: string | null;
    exampleOrAnalogy?: string | null;
    keyTakeaways: string[];
  } | null;
};

export type PracticeQuestion = {
  id: string;
  question: string;
  lectureId: string;
  lectureName: string;
  subjectId?: string | null;
  subjectName?: string | null;
  subjectCode?: string | null;
  options: string[];
  answer: number;
  explanation: string;
};

export type ProcessingStatus = "pending" | "processing" | "completed" | "failed";
export type ProcessingJobRunStatus = "queued" | "running" | "completed" | "failed";

export type ProcessingJobRun = {
  id: string;
  jobType: string;
  status: ProcessingJobRunStatus;
  stage: string;
  retryCount: number;
  errorMessage?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  lastHeartbeatAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProcessingJob = {
  id: string;
  lectureName: string;
  departmentName?: string | null;
  programName?: string | null;
  subjectName?: string | null;
  subjectCode?: string | null;
  lectureNumber?: number | null;
  lectureDate?: string | null;
  facultyName?: string | null;
  course: string;
  module: string;
  status: ProcessingStatus;
  progress: number;
  accuracyScore: number | null;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string | null;
  metrics?: Record<string, string | number>;
  latestJob?: ProcessingJobRun | null;
};

export type LectureTopic = {
  id: string;
  title: string;
  summary: string;
  validationState?: string;
  approvedForKb?: boolean;
  validationReason?: string | null;
  claimCount?: number;
  falseClaimCount?: number;
  transcript: TranscriptSentence[];
};

export type ReferenceFile = {
  id: string;
  originalFilename: string;
  fileType: string;
  contentType?: string | null;
  createdAt: string;
};

export type LectureContentItem = {
  id: string;
  role: string;
  originalFilename: string;
  fileType: string;
  contentType?: string | null;
  createdAt: string;
};

export type TranscriptSentence = {
  id: string;
  timestamp: string;
  text: string;
  topic: string;
  topicId?: string;
  topicSummary?: string;
};

export type LectureDetail = {
  id: string;
  lectureName: string;
  departmentName?: string | null;
  programName?: string | null;
  subjectName?: string | null;
  subjectCode?: string | null;
  lectureNumber?: number | null;
  lectureDate?: string | null;
  facultyName?: string | null;
  originalFilename: string;
  course: string;
  module: string;
  status: ProcessingStatus;
  progress: number;
  summary: string;
  metrics: Record<string, string | number>;
  createdAt: string;
  updatedAt: string;
  latestJob?: ProcessingJobRun | null;
  referenceFiles: ReferenceFile[];
  contentItems: LectureContentItem[];
  transcript: TranscriptSentence[];
  topics: LectureTopic[];
};

export type ClaimVerdict = "true" | "false" | "uncertain";
export type ClaimReviewAction = "approved" | "rejected";

export type ClaimRecord = {
  id: string;
  sequence: number;
  claim: string;
  verdict: ClaimVerdict;
  confidence: number;
  status: string;
  sourceExcerpt: string;
  rationale: string;
  details: string;
  evidenceItems: string[];
};

export type FactCheckResponse = {
  lectureId: string;
  lectureName: string;
  claims: ClaimRecord[];
};

export type KnowledgeTopic = {
  id: string;
  name: string;
  summary?: string;
  linkedLectures: string[];
  validatedClaims: number;
};

export type AnalyticsSummary = {
  totalLectures: number;
  queueCount: number;
  failedJobs: number;
  averageAccuracy: number;
  approvedTopicsTotal: number;
  flaggedTopicsTotal: number;
  blockedLectures: number;
  referenceBackedLectures: number;
  modelReviewedLectures: number;
  activeProcessingJobs: number;
  averageJobDurationMinutes: number;
  averageJobRetries: number;
};

export type DashboardData = {
  summary: AnalyticsSummary;
  statusBreakdown: { label: string; value: number }[];
  recentLectures: ProcessingJob[];
};

export type AnalyticsData = {
  validationOverview: { label: string; value: number }[];
  pipelineHealth: { label: string; value: number }[];
  processingLatency: { label: string; value: number }[];
  stageFailureBreakdown: { label: string; value: number }[];
  retryHotspots: { lecture: string; jobType: string; stage: string; retryCount: number }[];
  lowestAccuracyLectures: { lecture: string; accuracy: string; issue: string }[];
  mostIncorrectTopics: { topic: string; incidents: number }[];
  lecturesBlockedFromKb: { lecture: string; blockedTopics: number; flaggedTopics: number; approvedTopics: number }[];
  validationSourceSplit: { label: string; value: number }[];
  coverageGaps: { area: string; gap: string }[];
  trends: { label: string; value: number }[];
};
