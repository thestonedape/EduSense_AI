import {
  AnalyticsSummary,
  ClaimRecord,
  Course,
  Lecture,
  ProcessingJob,
  QuizQuestion,
  TranscriptSentence,
  KnowledgeTopic,
} from "@/types";

export const courses: Course[] = [
  {
    id: "ml-foundations",
    name: "Machine Learning Foundations",
    code: "ML 201",
    progress: 64,
    totalLectures: 12,
    description: "Build intuition for models, optimization, and evaluation.",
  },
  {
    id: "nlp-systems",
    name: "Applied NLP Systems",
    code: "AI 312",
    progress: 38,
    totalLectures: 9,
    description: "Design practical language pipelines and retrieval workflows.",
  },
  {
    id: "cloud-data",
    name: "Cloud Data Pipelines",
    code: "CS 418",
    progress: 81,
    totalLectures: 10,
    description: "Understand ETL design, orchestration, and reliability patterns.",
  },
];

export const lectures: Lecture[] = [
  {
    id: "gd-intro",
    courseId: "ml-foundations",
    title: "Gradient Descent Fundamentals",
    duration: "28 min",
    status: "in_progress",
    summary: "Understand loss surfaces, gradients, and step-wise optimization.",
    videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
    recommended: true,
  },
  {
    id: "learning-rate",
    courseId: "ml-foundations",
    title: "Choosing the Right Learning Rate",
    duration: "21 min",
    status: "not_started",
    summary: "Learn how stability and convergence change with step size.",
    videoUrl: "https://www.youtube.com/embed/IHZwWFHWa-w",
    recommended: true,
  },
  {
    id: "model-eval",
    courseId: "ml-foundations",
    title: "Model Evaluation Metrics",
    duration: "24 min",
    status: "completed",
    summary: "Precision, recall, F1 score, and practical tradeoffs.",
    videoUrl: "https://www.youtube.com/embed/85dtiMz9tSo",
  },
  {
    id: "rag-intro",
    courseId: "nlp-systems",
    title: "Intro to Retrieval-Augmented Generation",
    duration: "32 min",
    status: "not_started",
    summary: "Blend retrieval and generation for grounded answers.",
    videoUrl: "https://www.youtube.com/embed/T-D1OfcDW1M",
  },
];

export const lectureHelp: Record<string, string[]> = {
  "gd-intro": [
    "Gradient descent minimizes a loss function by moving parameters in the opposite direction of the gradient.",
    "A simple way to picture it is taking careful downhill steps on a landscape until you reach a lower region.",
    "At 12:01, the lecture explains why the gradient gives the direction of steepest increase, so we step the other way.",
  ],
  "learning-rate": [
    "The learning rate controls how big each optimization step is.",
    "If it is too large, the model can overshoot the minimum. If it is too small, training becomes very slow.",
    "The lecture references this tradeoff around 08:14 with a visual on stable versus unstable updates.",
  ],
  "model-eval": [
    "Evaluation metrics tell you how well a model performs for the goal you care about.",
    "For classification, precision helps when false positives are expensive, while recall helps when missing a positive is costly.",
  ],
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    lectureId: "gd-intro",
    question: "What is the primary goal of gradient descent?",
    options: [
      "Increase model complexity",
      "Minimize the loss function",
      "Randomize weights for better exploration",
      "Maximize prediction variance",
    ],
    answer: 1,
    explanation: "Gradient descent updates model parameters to reduce loss over time. Review Gradient Descent Fundamentals at 12:01.",
  },
  {
    id: "q2",
    lectureId: "learning-rate",
    question: "What can happen when the learning rate is too high?",
    options: [
      "The model trains more accurately by default",
      "The model converges faster with no downside",
      "The optimization may overshoot the minimum",
      "The data becomes linearly separable",
    ],
    answer: 2,
    explanation: "Large learning rates can cause unstable jumps that miss the minimum entirely. See Choosing the Right Learning Rate at 08:14.",
  },
];

export const processingJobs: ProcessingJob[] = [
  { id: "p1", lectureName: "Gradient Descent Fundamentals", status: "processing", progress: 72, updatedAt: "10 min ago" },
  { id: "p2", lectureName: "Choosing the Right Learning Rate", status: "pending", progress: 12, updatedAt: "25 min ago" },
  { id: "p3", lectureName: "Model Evaluation Metrics", status: "completed", progress: 100, updatedAt: "1 hour ago" },
  { id: "p4", lectureName: "Activation Functions Deep Dive", status: "failed", progress: 64, updatedAt: "2 hours ago" },
];

export const transcripts: Record<string, TranscriptSentence[]> = {
  p1: [
    { id: "t1", timestamp: "12:01", text: "Gradient descent minimizes loss by moving in the negative gradient direction.", topic: "Optimization" },
    { id: "t2", timestamp: "12:05", text: "It always finds the global minimum in every landscape.", topic: "Claims" },
    { id: "t3", timestamp: "12:18", text: "Learning rate influences convergence speed and stability.", topic: "Hyperparameters" },
  ],
};

export const factChecks: Record<string, ClaimRecord[]> = {
  p1: [
    {
      id: "c1",
      claim: "Gradient descent always finds the global minimum.",
      verdict: "false",
      confidence: 0.82,
      source: "Optimization lecture note set, section 2.4",
    },
    {
      id: "c2",
      claim: "Learning rate controls update step size.",
      verdict: "true",
      confidence: 0.97,
      source: "Course textbook chapter 6",
    },
  ],
};

export const knowledgeTopics: KnowledgeTopic[] = [
  { id: "k1", name: "Gradient Descent", linkedLectures: ["Gradient Descent Fundamentals", "Choosing the Right Learning Rate"], validatedClaims: 14 },
  { id: "k2", name: "Evaluation Metrics", linkedLectures: ["Model Evaluation Metrics"], validatedClaims: 9 },
  { id: "k3", name: "Retrieval Pipelines", linkedLectures: ["Intro to Retrieval-Augmented Generation"], validatedClaims: 6 },
];

export const analyticsSummary: AnalyticsSummary = {
  totalLectures: 142,
  queueCount: 9,
  failedJobs: 4,
  averageAccuracy: 91,
};

export const analyticsTables = {
  lowAccuracyLectures: [
    { lecture: "Activation Functions Deep Dive", accuracy: "72%", issue: "Incorrect mathematical claim density" },
    { lecture: "Neural Network Regularization", accuracy: "76%", issue: "Weak source alignment" },
    { lecture: "Bayesian Inference Basics", accuracy: "79%", issue: "Low evidence coverage" },
  ],
  incorrectTopics: [
    { topic: "Optimization guarantees", incidents: 18 },
    { topic: "Generalization theory", incidents: 12 },
    { topic: "Transformer attention math", incidents: 9 },
  ],
  coverageGaps: [
    { area: "Learning rate scheduling", gap: "No validated lecture in current term" },
    { area: "Vector databases", gap: "Only one processed source" },
    { area: "MLOps monitoring", gap: "Aging content, last review 75 days ago" },
  ],
};
