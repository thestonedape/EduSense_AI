import { api, hasApiBaseUrl } from "./client";
import { createServices } from "./service-factory";
export const { getCourses, getStudentDashboard, getCourse, getLecture, postChat, getPracticeQuestions, getDashboard, uploadLecture, getAcademicCatalog, getProcessing, getLectureDetail, updateTranscriptSegment, rebuildLectureStructure, resumeLectureProcessing, updateLectureTopic, updateTopicApproval, getFactCheck, updateFactCheck, getKnowledge, getAnalytics } = createServices(api, hasApiBaseUrl);
