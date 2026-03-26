export type Course = {
  id: string;
  name: string;
  code: string;
  progress: number;
  totalLectures: number;
  description: string;
};

export type LectureStatus = "completed" | "in_progress" | "not_started";

export type Lecture = {
  id: string;
  courseId: string;
  title: string;
  duration: string;
  status: LectureStatus;
  summary: string;
  videoUrl: string;
  recommended?: boolean;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  lectureId: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type ProcessingStatus = "pending" | "processing" | "completed" | "failed";

export type ProcessingJob = {
  id: string;
  lectureName: string;
  status: ProcessingStatus;
  progress: number;
  updatedAt: string;
};

export type TranscriptSentence = {
  id: string;
  timestamp: string;
  text: string;
  topic: string;
};

export type ClaimRecord = {
  id: string;
  claim: string;
  verdict: "true" | "false" | "uncertain";
  confidence: number;
  source: string;
};

export type KnowledgeTopic = {
  id: string;
  name: string;
  linkedLectures: string[];
  validatedClaims: number;
};

export type AnalyticsSummary = {
  totalLectures: number;
  queueCount: number;
  failedJobs: number;
  averageAccuracy: number;
};
