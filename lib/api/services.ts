import { api } from "@/lib/api/client";
import {
  analyticsSummary,
  analyticsTables,
  courses,
  factChecks,
  knowledgeTopics,
  lectureHelp,
  lectures,
  processingJobs,
  quizQuestions,
  transcripts,
} from "@/lib/data/mock-data";

export async function getCourses() {
  try {
    const response = await api.get("/courses");
    return response.data;
  } catch {
    return courses;
  }
}

export async function getCourse(id: string) {
  try {
    const response = await api.get(`/course/${id}`);
    return response.data;
  } catch {
    return {
      course: courses.find((course) => course.id === id) ?? courses[0],
      lectures: lectures.filter((lecture) => lecture.courseId === id),
    };
  }
}

export async function getLecture(id: string) {
  try {
    const response = await api.get(`/lecture/${id}`);
    return response.data;
  } catch {
    return lectures.find((lecture) => lecture.id === id) ?? lectures[0];
  }
}

export async function postChat(message: string, lectureId: string) {
  try {
    const response = await api.post("/chat", { message, lectureId });
    return response.data;
  } catch {
    const script = lectureHelp[lectureId] ?? lectureHelp["gd-intro"];
    return {
      response: [script[0], script[1], message.length > 35 ? script[2] : "This lecture also uses simple examples to reinforce the concept."].join(" "),
    };
  }
}

export async function getPracticeQuestions() {
  return quizQuestions;
}

export async function uploadLecture(payload: FormData) {
  try {
    const response = await api.post("/upload", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch {
    return { success: true, message: "Upload queued successfully." };
  }
}

export async function getProcessing() {
  try {
    const response = await api.get("/processing");
    return response.data;
  } catch {
    return processingJobs;
  }
}

export async function getTranscript(id: string) {
  try {
    const response = await api.get(`/lecture/${id}`);
    return response.data;
  } catch {
    return transcripts[id] ?? [];
  }
}

export async function getFactCheck(id: string) {
  try {
    const response = await api.get(`/fact-check/${id}`);
    return response.data;
  } catch {
    return factChecks[id] ?? [];
  }
}

export async function updateFactCheck(payload: unknown) {
  try {
    const response = await api.post("/fact-check/update", payload);
    return response.data;
  } catch {
    return { success: true };
  }
}

export async function getKnowledge() {
  return knowledgeTopics;
}

export async function getAnalytics() {
  try {
    const response = await api.get("/analytics");
    return response.data;
  } catch {
    return {
      summary: analyticsSummary,
      tables: analyticsTables,
    };
  }
}
