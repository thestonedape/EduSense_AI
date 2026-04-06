import { cache } from "react";
import type { AxiosError } from "axios";

import { api, hasApiBaseUrl } from "@/lib/api/client";
import {
  AnalyticsData,
  ClaimRecord,
  ClaimReviewAction,
  ClaimVerdict,
  DashboardData,
  FactCheckResponse,
  KnowledgeTopic,
  LectureDetail,
  LectureTopic,
  PracticeQuestion,
  ProcessingJob,
  ProcessingJobRun,
  ProcessingStatus,
  StudentChatResponse,
  StudentDashboardData,
  StudentLectureDetail,
  StudentLectureSummary,
  StudentSubject,
  StudentSubjectDetail,
  TranscriptSentence,
} from "@/types";

const API_PREFIX = "/api/v1";

function pickString(value: Record<string, unknown>, keys: string[], fallback = "") {
  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate;
    }
  }
  return fallback;
}

function pickNumber(value: Record<string, unknown>, keys: string[], fallback = 0) {
  for (const key of keys) {
    const candidate = value[key];
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
    if (typeof candidate === "string") {
      const parsed = Number(candidate);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return fallback;
}

function toProcessingStatus(value: unknown): ProcessingStatus {
  if (value === "pending" || value === "processing" || value === "completed" || value === "failed") {
    return value;
  }
  return "pending";
}

function toProcessingJobRunStatus(value: unknown): ProcessingJobRun["status"] {
  if (value === "queued" || value === "running" || value === "completed" || value === "failed") {
    return value;
  }
  return "queued";
}

function toClaimVerdict(value: unknown): ClaimVerdict {
  if (value === "true" || value === "false" || value === "uncertain") {
    return value;
  }
  return "uncertain";
}

async function withApiFallback<T>(request: () => Promise<T>, fallback: () => T | Promise<T>) {
  if (!hasApiBaseUrl) {
    return fallback();
  }

  try {
    return await request();
  } catch {
    return fallback();
  }
}

async function withRequiredApi<T>(request: () => Promise<T>) {
  if (!hasApiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return request();
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shufflePracticeOptions(questionId: string, options: string[], answer: number) {
  const pairs = options.map((option, index) => ({ option, index }));
  let seed = Array.from(questionId).reduce((total, char) => total + char.charCodeAt(0), 0) || 7;
  const shuffled = [...pairs];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const swapIndex = seed % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return {
    options: shuffled.map((item) => item.option),
    answer: shuffled.findIndex((item) => item.index === answer),
  };
}

function isTransientApiError(error: unknown) {
  const value = error as AxiosError | undefined;
  const code = value?.code;
  const status = value?.response?.status;
  return code === "ECONNRESET" || code === "ECONNABORTED" || status === 502 || status === 503 || status === 504;
}

async function withApiRetry<T>(request: () => Promise<T>, attempts = 3) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await request();
    } catch (error) {
      lastError = error;
      if (!isTransientApiError(error) || attempt === attempts) {
        throw error;
      }
      await sleep(350 * attempt);
    }
  }
  throw lastError;
}

function normalizeProcessingJob(item: Record<string, unknown>): ProcessingJob {
  const createdAt = pickString(item, ["created_at", "updated_at", "createdAt", "updatedAt"], "-");
  const updatedAt = pickString(item, ["updated_at", "created_at", "updatedAt", "createdAt"], createdAt);
  const accuracyScore = pickNumber(item, ["accuracy_score", "accuracyScore"], Number.NaN);
  const lectureNumber = pickNumber(item, ["lecture_number", "lectureNumber"], Number.NaN);

  return {
    id: pickString(item, ["id", "lecture_id"], "unknown"),
    lectureName: pickString(item, ["lecture_name", "lectureName", "name"], "Untitled lecture"),
    departmentName: pickString(item, ["department_name", "departmentName"], "") || null,
    programName: pickString(item, ["program_name", "programName"], "") || null,
    subjectName: pickString(item, ["subject_name", "subjectName"], "") || null,
    subjectCode: pickString(item, ["subject_code", "subjectCode"], "") || null,
    lectureNumber: Number.isFinite(lectureNumber) ? lectureNumber : null,
    lectureDate: pickString(item, ["lecture_date", "lectureDate"], "") || null,
    facultyName: pickString(item, ["faculty_name", "facultyName"], "") || null,
    course: pickString(item, ["course"], ""),
    module: pickString(item, ["module"], ""),
    status: toProcessingStatus(item.status),
    progress: pickNumber(item, ["progress"], 0),
    accuracyScore: Number.isFinite(accuracyScore) ? accuracyScore : null,
    createdAt,
    updatedAt,
    errorMessage: pickString(item, ["error_message", "errorMessage"], "") || null,
    metrics: typeof item.metrics === "object" && item.metrics !== null ? (item.metrics as Record<string, string | number>) : {},
    latestJob:
      typeof item.latest_job === "object" && item.latest_job !== null
        ? normalizeProcessingJobRun(item.latest_job as Record<string, unknown>)
        : null,
  };
}

function normalizeProcessingJobRun(item: Record<string, unknown>): ProcessingJobRun {
  return {
    id: pickString(item, ["id"], "job"),
    jobType: pickString(item, ["job_type", "jobType"], "job"),
    status: toProcessingJobRunStatus(item.status),
    stage: pickString(item, ["stage"], "queued"),
    retryCount: pickNumber(item, ["retry_count", "retryCount"], 0),
    errorMessage: pickString(item, ["error_message", "errorMessage"], "") || null,
    startedAt: pickString(item, ["started_at", "startedAt"], "") || null,
    finishedAt: pickString(item, ["finished_at", "finishedAt"], "") || null,
    lastHeartbeatAt: pickString(item, ["last_heartbeat_at", "lastHeartbeatAt"], "") || null,
    createdAt: pickString(item, ["created_at", "createdAt"], "-"),
    updatedAt: pickString(item, ["updated_at", "updatedAt"], "-"),
  };
}

function normalizeTopic(item: Record<string, unknown>): LectureTopic {
  const transcriptItems = Array.isArray(item.transcript_segments) ? item.transcript_segments : [];
  return {
    id: pickString(item, ["id", "topic_id"], crypto.randomUUID()),
    title: pickString(item, ["title", "name"], "Untitled topic"),
    summary: pickString(item, ["summary", "description"], ""),
    validationState: pickString(item, ["validation_state", "validationState"], "") || undefined,
    approvedForKb: Boolean(item.approved_for_kb ?? item.approvedForKb),
    validationReason: pickString(item, ["validation_reason", "validationReason"], "") || null,
    claimCount: pickNumber(item, ["claim_count", "claimCount"], 0),
    falseClaimCount: pickNumber(item, ["false_claim_count", "falseClaimCount"], 0),
    transcript: transcriptItems.map((segment, index) => {
      const value = segment as Record<string, unknown>;
      const startTime = pickNumber(value, ["start_time", "startTime"], Number.NaN);
      return {
        id: pickString(value, ["id", "segment_id", "segmentId"], `topic-segment-${index + 1}`),
        timestamp: Number.isFinite(startTime) ? `${startTime.toFixed(1)}s` : pickString(value, ["timestamp", "time"], "-"),
        text: pickString(value, ["edited_text", "editedText", "text", "content"], ""),
        topic: pickString(item, ["title", "name"], "Topic"),
        topicId: pickString(item, ["id", "topic_id"], ""),
        topicSummary: pickString(item, ["summary", "description"], ""),
      } satisfies TranscriptSentence;
    }),
  };
}

function normalizeLectureDetail(lectureId: string, payload: Record<string, unknown>): LectureDetail {
  const topicItems = Array.isArray(payload.topics) ? payload.topics : [];
  const topics = topicItems.map((topic) => normalizeTopic(topic as Record<string, unknown>));
  const transcriptItems = Array.isArray(payload.transcript) ? payload.transcript : [];
  const lectureNumber = pickNumber(payload, ["lecture_number", "lectureNumber"], Number.NaN);

  const transcript = transcriptItems.map((segment, index) => {
    const value = segment as Record<string, unknown>;
    const startTime = pickNumber(value, ["start_time", "startTime"], Number.NaN);
    const sequence = pickNumber(value, ["sequence"], index + 1);
    const relatedTopic =
      topicItems
        .map((topic) => topic as Record<string, unknown>)
        .find((topic) => {
          const topicStart = pickNumber(topic, ["start_time", "startTime"], Number.NaN);
          const topicEnd = pickNumber(topic, ["end_time", "endTime"], Number.NaN);
          const topicSequence = pickNumber(topic, ["sequence"], Number.NaN);

          if (Number.isFinite(startTime) && Number.isFinite(topicStart) && Number.isFinite(topicEnd)) {
            return startTime >= topicStart && startTime <= topicEnd;
          }

          return Number.isFinite(topicSequence) && topicSequence === sequence;
        }) ?? null;
    const relatedTopicId = relatedTopic ? pickString(relatedTopic, ["id", "topic_id"], "") : "";
    const topicTitle = pickString(value, ["topic", "topic_title", "topicTitle"], relatedTopic ? pickString(relatedTopic, ["title", "name"], "General") : "General");
    const text = pickString(value, ["edited_text", "editedText", "text", "content"], "");
    const timestamp = Number.isFinite(startTime) ? `${startTime.toFixed(1)}s` : pickString(value, ["timestamp", "time"], "-");

    return {
      id: pickString(value, ["id", "segment_id", "segmentId"], `${lectureId}-segment-${index + 1}`),
      timestamp,
      text,
      topic: topicTitle,
      topicId: relatedTopicId || undefined,
      topicSummary: relatedTopic ? pickString(relatedTopic, ["summary", "description"], "") : undefined,
    } satisfies TranscriptSentence;
  });

  const metrics = typeof payload.metrics === "object" && payload.metrics !== null ? (payload.metrics as Record<string, string | number>) : {};
  const referenceItems = Array.isArray(payload.reference_files) ? payload.reference_files : [];
  const contentItems = Array.isArray(payload.content_items) ? payload.content_items : [];

  return {
    id: pickString(payload, ["lecture_id", "id"], lectureId),
    lectureName: pickString(payload, ["lecture_name", "title", "name"], "Lecture"),
    departmentName: pickString(payload, ["department_name", "departmentName"], "") || null,
    programName: pickString(payload, ["program_name", "programName"], "") || null,
    subjectName: pickString(payload, ["subject_name", "subjectName"], "") || null,
    subjectCode: pickString(payload, ["subject_code", "subjectCode"], "") || null,
    lectureNumber: Number.isFinite(lectureNumber) ? lectureNumber : null,
    lectureDate: pickString(payload, ["lecture_date", "lectureDate"], "") || null,
    facultyName: pickString(payload, ["faculty_name", "facultyName"], "") || null,
    originalFilename: pickString(payload, ["original_filename", "originalFilename"], ""),
    course: pickString(payload, ["course"], ""),
    module: pickString(payload, ["module"], ""),
    status: toProcessingStatus(payload.status),
    progress: pickNumber(payload, ["progress"], 0),
    summary: pickString(payload, ["summary"], ""),
    metrics,
    createdAt: pickString(payload, ["created_at", "createdAt"], "-"),
    updatedAt: pickString(payload, ["updated_at", "updatedAt"], "-"),
    latestJob:
      typeof payload.latest_job === "object" && payload.latest_job !== null
        ? normalizeProcessingJobRun(payload.latest_job as Record<string, unknown>)
        : null,
    referenceFiles: referenceItems.map((item, index) => {
      const value = item as Record<string, unknown>;
      return {
        id: pickString(value, ["id"], `reference-${index + 1}`),
        originalFilename: pickString(value, ["original_filename", "originalFilename"], "Reference file"),
        fileType: pickString(value, ["file_type", "fileType"], "reference"),
        contentType: pickString(value, ["content_type", "contentType"], "") || null,
        createdAt: pickString(value, ["created_at", "createdAt"], "-"),
      };
    }),
    contentItems: contentItems.map((item, index) => {
      const value = item as Record<string, unknown>;
      return {
        id: pickString(value, ["id"], `content-${index + 1}`),
        role: pickString(value, ["role"], "content"),
        originalFilename: pickString(value, ["original_filename", "originalFilename"], "Lecture content"),
        fileType: pickString(value, ["file_type", "fileType"], "content"),
        contentType: pickString(value, ["content_type", "contentType"], "") || null,
        createdAt: pickString(value, ["created_at", "createdAt"], "-"),
      };
    }),
    transcript,
    topics,
  };
}

function normalizeClaim(item: Record<string, unknown>, index: number): ClaimRecord {
  const evidenceItems = Array.isArray(item.evidence_items)
    ? item.evidence_items.map((evidence) => {
        if (typeof evidence === "string") {
          return evidence;
        }

        if (typeof evidence === "object" && evidence !== null) {
          const value = evidence as Record<string, unknown>;
          const excerpt = pickString(value, ["excerpt"], "");
          const reference = pickString(value, ["source_reference", "sourceReference"], "");
          const sourceType = pickString(value, ["source_type", "sourceType"], "");
          return [sourceType, reference, excerpt].filter(Boolean).join(" • ");
        }

        return String(evidence);
      })
    : pickString(item, ["source_excerpt", "source"], "")
        .split("\n")
        .map((entry) => entry.trim())
        .filter(Boolean);

  const detailsValue = item.details;
  const details =
    typeof detailsValue === "string"
      ? detailsValue
      : typeof detailsValue === "object" && detailsValue !== null
        ? Object.entries(detailsValue as Record<string, unknown>)
            .map(([key, value]) => `${key}: ${String(value)}`)
            .join(" | ")
        : "";

  return {
    id: pickString(item, ["id", "claim_id"], `claim-${index + 1}`),
    sequence: pickNumber(item, ["sequence"], index + 1),
    claim: pickString(item, ["text", "claim"], ""),
    verdict: toClaimVerdict(item.verdict),
    confidence: pickNumber(item, ["confidence"], 0),
    status: pickString(item, ["status"], "pending"),
    sourceExcerpt: pickString(item, ["source_excerpt", "source"], "No source excerpt provided."),
    rationale: pickString(item, ["rationale"], ""),
    details,
    evidenceItems,
  };
}

function normalizeKnowledgeTopic(item: Record<string, unknown>): KnowledgeTopic {
  const details = typeof item.details === "object" && item.details !== null ? (item.details as Record<string, unknown>) : {};
  const linkedLectures = Array.isArray(item.linked_lectures)
    ? item.linked_lectures.map((lecture) => String(lecture))
    : Array.isArray(item.linkedLectures)
      ? item.linkedLectures.map((lecture) => String(lecture))
      : item.lecture_id
        ? [String(item.lecture_id)]
      : [];

  return {
    id: pickString(item, ["id", "topic_id"], crypto.randomUUID()),
    name: pickString(item, ["name", "topic", "title"], "Untitled topic"),
    summary: pickString(item, ["summary", "description", "content"], ""),
    linkedLectures,
    validatedClaims: pickNumber(item, ["validated_claims", "validatedClaims", "claim_count"], Number(details.claim_count ?? 0)),
  };
}

function normalizeStudentSubject(item: Record<string, unknown>): StudentSubject {
  return {
    id: pickString(item, ["id"], "subject"),
    name: pickString(item, ["name"], "Subject"),
    code: pickString(item, ["code"], "SUBJECT"),
    lectureCount: pickNumber(item, ["lecture_count", "lectureCount"], 0),
    referenceCount: pickNumber(item, ["reference_count", "referenceCount"], 0),
    description: pickString(item, ["description"], "Validated subject content is available."),
    departmentName: pickString(item, ["department_name", "departmentName"], "") || null,
    programName: pickString(item, ["program_name", "programName"], "") || null,
    latestLectureDate: pickString(item, ["latest_lecture_date", "latestLectureDate"], "") || null,
  };
}

function normalizeStudentLectureSummary(item: Record<string, unknown>): StudentLectureSummary {
  const lectureNumber = pickNumber(item, ["lecture_number", "lectureNumber"], Number.NaN);
  return {
    id: pickString(item, ["id"], "lecture"),
    subjectId: pickString(item, ["subject_id", "subjectId"], "subject"),
    lectureName: pickString(item, ["lecture_name", "lectureName"], "Lecture"),
    lectureNumber: Number.isFinite(lectureNumber) ? lectureNumber : null,
    lectureDate: pickString(item, ["lecture_date", "lectureDate"], "") || null,
    facultyName: pickString(item, ["faculty_name", "facultyName"], "") || null,
    summary: pickString(item, ["summary"], "Validated lecture content is available."),
    topicCount: pickNumber(item, ["topic_count", "topicCount"], 0),
    referenceCount: pickNumber(item, ["reference_count", "referenceCount"], 0),
    validationSource: pickString(item, ["validation_source", "validationSource"], "validated"),
  };
}

function normalizeStudentLectureDetail(item: Record<string, unknown>): StudentLectureDetail {
  const lectureNumber = pickNumber(item, ["lecture_number", "lectureNumber"], Number.NaN);
  const topicItems = Array.isArray(item.topics) ? item.topics : [];
  const recommendedQuestions = Array.isArray(item.recommended_questions)
    ? item.recommended_questions.map((value) => String(value))
    : [];
  const referenceFiles = Array.isArray(item.reference_files) ? item.reference_files.map((value) => String(value)) : [];

  return {
    id: pickString(item, ["id"], "lecture"),
    subjectId: pickString(item, ["subject_id", "subjectId"], "subject"),
    lectureName: pickString(item, ["lecture_name", "lectureName"], "Lecture"),
    subjectName: pickString(item, ["subject_name", "subjectName"], "") || null,
    subjectCode: pickString(item, ["subject_code", "subjectCode"], "") || null,
    departmentName: pickString(item, ["department_name", "departmentName"], "") || null,
    programName: pickString(item, ["program_name", "programName"], "") || null,
    lectureNumber: Number.isFinite(lectureNumber) ? lectureNumber : null,
    lectureDate: pickString(item, ["lecture_date", "lectureDate"], "") || null,
    facultyName: pickString(item, ["faculty_name", "facultyName"], "") || null,
    summary: pickString(item, ["summary"], "Validated lecture content is available."),
    referenceFiles,
    topics: topicItems.map((topic, index) => {
      const value = topic as Record<string, unknown>;
      return {
        id: pickString(value, ["id"], `topic-${index + 1}`),
        title: pickString(value, ["title"], "Topic"),
        summary: pickString(value, ["summary"], ""),
        source: pickString(value, ["source"], "Lecture"),
      };
    }),
    recommendedQuestions,
    validationSource: pickString(item, ["validation_source", "validationSource"], "validated"),
  };
}

export const getCourses = cache(async function getCourses(): Promise<StudentSubject[]> {
  return withRequiredApi(async () => {
    const response = await api.get(`${API_PREFIX}/student/subjects`);
    const payload = Array.isArray(response.data) ? response.data : [];
    return payload.map((item) => normalizeStudentSubject(item as Record<string, unknown>));
  });
});

export const getStudentDashboard = cache(async function getStudentDashboard(
  studentEmail: string,
): Promise<StudentDashboardData> {
  return withRequiredApi(async () => {
    const internalApiKey = process.env.INTERNAL_API_KEY;
    if (!internalApiKey) {
      throw new Error("Internal API key is not configured.");
    }
    const response = await api.get(`${API_PREFIX}/student/dashboard`, {
      headers: {
        "x-edusense-internal-key": internalApiKey,
        "x-edusense-student-email": studentEmail,
      },
    });
    const payload = response.data as Record<string, unknown>;
    const statsValue = typeof payload.stats === "object" && payload.stats !== null ? (payload.stats as Record<string, unknown>) : {};
    const lectureItems = Array.isArray(payload.recent_lectures) ? payload.recent_lectures : [];

    return {
      stats: {
        trackedLectures: pickNumber(statsValue, ["tracked_lectures", "trackedLectures"], 0),
        completedLectures: pickNumber(statsValue, ["completed_lectures", "completedLectures"], 0),
        quizAttempts: pickNumber(statsValue, ["quiz_attempts", "quizAttempts"], 0),
        savedChats: pickNumber(statsValue, ["saved_chats", "savedChats"], 0),
      },
      recentLectures: lectureItems.map((item) => normalizeStudentLectureSummary(item as Record<string, unknown>)),
    };
  });
});

export const getCourse = cache(async function getCourse(id: string): Promise<StudentSubjectDetail | null> {
  return withRequiredApi(async () => {
    try {
      const response = await api.get(`${API_PREFIX}/student/subjects/${id}`);
      const payload = response.data as Record<string, unknown>;
      const subjectValue = typeof payload.subject === "object" && payload.subject !== null ? (payload.subject as Record<string, unknown>) : null;
      const lecturesValue = Array.isArray(payload.lectures) ? payload.lectures : [];

      if (!subjectValue) {
        return null;
      }

      return {
        subject: normalizeStudentSubject(subjectValue),
        lectures: lecturesValue.map((item) => normalizeStudentLectureSummary(item as Record<string, unknown>)),
      };
    } catch (error) {
      const value = error as AxiosError | undefined;
      if (value?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  });
});

export const getLecture = cache(async function getLecture(id: string): Promise<StudentLectureDetail | null> {
  return withRequiredApi(async () => {
    try {
      const response = await withApiRetry(() => api.get(`${API_PREFIX}/student/lectures/${id}`));
      return normalizeStudentLectureDetail(response.data as Record<string, unknown>);
    } catch (error) {
      const value = error as AxiosError | undefined;
      if (value?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  });
});

export async function postChat(message: string, lectureId: string): Promise<StudentChatResponse> {
  return withRequiredApi(async () => {
    const response = await api.post(`${API_PREFIX}/student/chat`, { message, lecture_id: lectureId });
    const payload = response.data as Record<string, unknown>;
    const citationItems = Array.isArray(payload.citations) ? payload.citations : [];
    return {
      response: pickString(payload, ["response"], ""),
      citations: citationItems.map((item) => {
        const value = item as Record<string, unknown>;
        return {
          topic: pickString(value, ["topic"], "Topic"),
          source: pickString(value, ["source"], "Lecture"),
          excerpt: pickString(value, ["excerpt"], ""),
        };
      }),
    };
  });
}

export async function getPracticeQuestions(limit = 6): Promise<PracticeQuestion[]> {
  return withRequiredApi(async () => {
    const response = await api.get(`${API_PREFIX}/student/practice`, { params: { limit } });
    const payload = response.data as Record<string, unknown>;
    const items = Array.isArray(payload.questions) ? payload.questions : [];
    return items.map((item, index) => {
      const value = item as Record<string, unknown>;
      const answer = pickNumber(value, ["answer"], 0);
      const id = pickString(value, ["id"], `practice-${index + 1}`);
      const options = Array.isArray(value.options) ? value.options.map((option) => String(option)) : [];
      const shuffled = shufflePracticeOptions(id, options, answer);
      return {
        id,
        question: pickString(value, ["question"], "Practice question"),
        lectureId: pickString(value, ["lecture_id", "lectureId"], ""),
        lectureName: pickString(value, ["lecture_name", "lectureName"], "Lecture"),
        subjectId: pickString(value, ["subject_id", "subjectId"], "") || null,
        subjectName: pickString(value, ["subject_name", "subjectName"], "") || null,
        subjectCode: pickString(value, ["subject_code", "subjectCode"], "") || null,
        options: shuffled.options,
        answer: shuffled.answer,
        explanation: pickString(value, ["explanation"], ""),
      };
    });
  });
}

export const getDashboard = cache(async function getDashboard(): Promise<DashboardData> {
  return withRequiredApi(async () => {
    const response = await api.get(`${API_PREFIX}/dashboard`);
    const payload = response.data as Record<string, unknown>;
    const statusBreakdownSource = payload.status_breakdown;
    const statusBreakdown = typeof statusBreakdownSource === "object" && statusBreakdownSource !== null
      ? Object.entries(statusBreakdownSource as Record<string, unknown>).map(([label, value]) => ({ label, value: Number(value) || 0 }))
      : [];
    const recentSource = Array.isArray(payload.recent_lectures) ? payload.recent_lectures : [];

    return {
      summary: {
        totalLectures: pickNumber(payload, ["total_lectures_processed", "totalLecturesProcessed", "total_lectures"], 0),
        queueCount: pickNumber(payload, ["lectures_in_queue", "queue_count", "queueCount"], 0),
        failedJobs: pickNumber(payload, ["failed_jobs", "failedJobs"], 0),
        averageAccuracy: pickNumber(payload, ["accuracy_overview", "average_accuracy", "averageAccuracy"], 0),
        approvedTopicsTotal: pickNumber(payload, ["approved_topics_total", "approvedTopicsTotal"], 0),
        flaggedTopicsTotal: pickNumber(payload, ["flagged_topics_total", "flaggedTopicsTotal"], 0),
        blockedLectures: pickNumber(payload, ["lectures_blocked_from_kb", "blockedLectures"], 0),
        referenceBackedLectures: pickNumber(payload, ["reference_backed_lectures", "referenceBackedLectures"], 0),
        modelReviewedLectures: pickNumber(payload, ["model_reviewed_lectures", "modelReviewedLectures"], 0),
        activeProcessingJobs: pickNumber(payload, ["active_processing_jobs", "activeProcessingJobs"], 0),
        averageJobDurationMinutes: pickNumber(payload, ["average_job_duration_minutes", "averageJobDurationMinutes"], 0),
        averageJobRetries: pickNumber(payload, ["average_job_retries", "averageJobRetries"], 0),
      },
      statusBreakdown,
      recentLectures: recentSource.map((item) => normalizeProcessingJob(item as Record<string, unknown>)),
    };
  });
});

export async function uploadLecture(payload: FormData) {
  return withRequiredApi(async () => {
    const response = await api.post(`${API_PREFIX}/upload`, payload, {
      // Uploads can take much longer than the default API timeout because the backend
      // persists files locally and may mirror them into Supabase storage before returning.
      timeout: 10 * 60 * 1000,
    });
    return response.data;
  });
}

export async function getAcademicCatalog() {
  return withRequiredApi(async () => {
    const response = await api.get(`${API_PREFIX}/catalog`);
    return response.data as Array<{
      department: string;
      programs: Array<{
        name: string;
        subjects: Array<{ code: string; name: string }>;
      }>;
    }>;
  });
}

export const getProcessing = cache(async function getProcessing(): Promise<ProcessingJob[]> {
  return withRequiredApi(async () => {
    const response = await api.get(`${API_PREFIX}/processing`);
    const payload = response.data;
    const items = Array.isArray(payload) ? payload : Array.isArray(payload?.items) ? payload.items : [];
    return items.map((item: Record<string, unknown>) => normalizeProcessingJob(item));
  });
});

export const getLectureDetail = cache(async function getLectureDetail(id: string): Promise<LectureDetail> {
  return withRequiredApi(async () => {
    const response = await withApiRetry(() => api.get(`${API_PREFIX}/lecture/${id}`));
    return normalizeLectureDetail(id, response.data as Record<string, unknown>);
  });
});

export async function updateTranscriptSegment(segmentId: string, text: string) {
  return withRequiredApi(async () => {
    const response = await api.put(`${API_PREFIX}/lecture/transcript/${segmentId}`, { text });
    return response.data;
  });
}

export async function rebuildLectureStructure(lectureId: string) {
  return withRequiredApi(async () => {
    const response = await api.post(`${API_PREFIX}/processing/${lectureId}/rebuild-structure`);
    return response.data;
  });
}

export async function resumeLectureProcessing(lectureId: string) {
  return withRequiredApi(async () => {
    const response = await api.post(`${API_PREFIX}/processing/${lectureId}/resume`);
    return response.data;
  });
}

export async function updateLectureTopic(topicId: string, payload: { title: string; summary: string }) {
  return withRequiredApi(async () => {
    const response = await api.put(`${API_PREFIX}/lecture/topic/${topicId}`, payload);
    return response.data;
  });
}

export async function updateTopicApproval(topicId: string, payload: { approved_for_kb: boolean; reviewed_by?: string }) {
  return withRequiredApi(async () => {
    const response = await api.post(`${API_PREFIX}/lecture/topic/${topicId}/approval`, payload);
    return response.data;
  });
}

export const getFactCheck = cache(async function getFactCheck(id: string): Promise<FactCheckResponse> {
  return withRequiredApi(async () => {
    const response = await api.get(`${API_PREFIX}/fact-check/${id}`);
    const payload = response.data as Record<string, unknown>;
    const claims = Array.isArray(payload.claims) ? payload.claims : [];

    return {
      lectureId: pickString(payload, ["lecture_id", "lectureId"], id),
      lectureName: pickString(payload, ["lecture_name", "lectureName"], "Lecture fact check"),
      claims: claims.map((claim, index) => normalizeClaim(claim as Record<string, unknown>, index)),
    };
  });
});

export async function updateFactCheck(payload: {
  claim_id: string;
  action: ClaimReviewAction;
  edited_claim?: string;
  override_verdict?: string;
  confidence?: number;
  rationale?: string;
}) {
  return withRequiredApi(async () => {
    const response = await api.post(`${API_PREFIX}/fact-check/update`, payload);
    return response.data;
  });
}

export const getKnowledge = cache(async function getKnowledge(params?: {
  query?: string;
  topic?: string;
  limit?: number;
}): Promise<KnowledgeTopic[]> {
  const query = params?.query?.trim() ?? "";

  if (!query) {
    return [];
  }

  return withRequiredApi(async () => {
    const response = await api.get(`${API_PREFIX}/knowledge`, {
      params: {
        query,
        topic: params?.topic,
        limit: params?.limit,
      },
    });
    const payload = response.data;
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.results)
        ? payload.results
        : Array.isArray(payload?.topics)
          ? payload.topics
          : [];
    return items.map((item: Record<string, unknown>) => normalizeKnowledgeTopic(item));
  });
});

export const getAnalytics = cache(async function getAnalytics(): Promise<AnalyticsData> {
  return withRequiredApi(async () => {
    const response = await api.get(`${API_PREFIX}/analytics`);
    const payload = response.data as Record<string, unknown>;

    return {
      validationOverview: Array.isArray(payload.validation_overview)
        ? payload.validation_overview.map((item, index) => {
            const value = item as Record<string, unknown>;
            return {
              label: pickString(value, ["label"], `Validation ${index + 1}`),
              value: pickNumber(value, ["value"], 0),
            };
          })
        : [],
      pipelineHealth: Array.isArray(payload.pipeline_health)
        ? payload.pipeline_health.map((item, index) => {
            const value = item as Record<string, unknown>;
            return {
              label: pickString(value, ["label"], `Pipeline ${index + 1}`),
              value: pickNumber(value, ["value"], 0),
            };
          })
        : [],
      processingLatency: Array.isArray(payload.processing_latency)
        ? payload.processing_latency.map((item, index) => {
            const value = item as Record<string, unknown>;
            return {
              label: pickString(value, ["label"], `Latency ${index + 1}`),
              value: pickNumber(value, ["value"], 0),
            };
          })
        : [],
      stageFailureBreakdown: Array.isArray(payload.stage_failure_breakdown)
        ? payload.stage_failure_breakdown.map((item, index) => {
            const value = item as Record<string, unknown>;
            return {
              label: pickString(value, ["label"], `Stage ${index + 1}`),
              value: pickNumber(value, ["value"], 0),
            };
          })
        : [],
      retryHotspots: Array.isArray(payload.retry_hotspots)
        ? payload.retry_hotspots.map((item) => {
            const value = item as Record<string, unknown>;
            return {
              lecture: pickString(value, ["lecture_name", "lecture"], "Lecture"),
              jobType: pickString(value, ["job_type", "jobType"], "job"),
              stage: pickString(value, ["stage"], "unknown"),
              retryCount: pickNumber(value, ["retry_count", "retryCount"], 0),
            };
          })
        : [],
      lowestAccuracyLectures: Array.isArray(payload.lowest_accuracy_lectures)
        ? payload.lowest_accuracy_lectures.map((item) => {
            const value = item as Record<string, unknown>;
            return {
              lecture: pickString(value, ["lecture", "lecture_name"], "Lecture"),
              accuracy: `${pickNumber(value, ["accuracy", "accuracy_score"], 0)}%`,
              issue:
                pickString(value, ["issue", "reason"], "") ||
                [pickString(value, ["subject_code"], ""), pickString(value, ["subject_name"], "")]
                  .filter(Boolean)
                  .join(" / ") ||
                "Accuracy issue detected",
            };
          })
        : [],
      mostIncorrectTopics: Array.isArray(payload.most_incorrect_topics)
        ? payload.most_incorrect_topics.map((item) => {
            const value = item as Record<string, unknown>;
            return {
              topic: pickString(value, ["topic", "name"], "Topic"),
              incidents: pickNumber(value, ["incidents", "count"], 0),
            };
          })
        : [],
      lecturesBlockedFromKb: Array.isArray(payload.lectures_blocked_from_kb)
        ? payload.lectures_blocked_from_kb.map((item) => {
            const value = item as Record<string, unknown>;
            return {
              lecture: pickString(value, ["lecture", "lecture_name"], "Lecture"),
              blockedTopics: pickNumber(value, ["blocked_topics", "blockedTopics"], 0),
              flaggedTopics: pickNumber(value, ["flagged_topics", "flaggedTopics"], 0),
              approvedTopics: pickNumber(value, ["approved_topics", "approvedTopics"], 0),
            };
          })
        : [],
      validationSourceSplit: Array.isArray(payload.validation_source_split)
        ? payload.validation_source_split.map((item, index) => {
            const value = item as Record<string, unknown>;
            return {
              label: pickString(value, ["label"], `Source ${index + 1}`),
              value: pickNumber(value, ["value"], 0),
            };
          })
        : [],
      coverageGaps: Array.isArray(payload.coverage_gaps)
        ? payload.coverage_gaps.map((item) => {
            const value = item as Record<string, unknown>;
            return {
              area: pickString(value, ["area", "topic"], "Area"),
              gap: pickString(value, ["gap", "description"], "Gap detected"),
            };
          })
        : [],
      trends: Array.isArray(payload.trends)
        ? payload.trends.map((item, index) => {
            const value = item as Record<string, unknown>;
            return {
              label: pickString(value, ["label", "period", "date"], `Trend ${index + 1}`),
              value: pickNumber(value, ["value", "accuracy", "score", "completed"], 0),
            };
          })
        : [],
    };
  });
});
