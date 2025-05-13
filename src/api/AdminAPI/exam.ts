import { api } from "@/lib/api";
import {
  ICreateListeningQuestion,
  ICreateListeningType,
  ICreatePassage,
  ICreateQuestion,
  IEditPassage,
  IEditQuestion,
  IExamDetail,
} from "@/types/AdminType/exam";
import { IExcerciseDetail } from "@/types/excercise";

export const createExam = (exam: FormData): Promise<IExcerciseDetail> =>
  api.post("/exams", exam, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const editExam = (
  exam: FormData,
  id: string
): Promise<IExcerciseDetail> =>
  api.patch(`/exams/${id}`, exam, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteExam = (id: string): Promise<string> =>
  api.delete(`/exams/${id}`);

export const deletePassage = (id: string): Promise<string> =>
  api.delete(`/exam-passages/${id}`);

export const deleteSection = (id: string): Promise<string> =>
  api.delete(`/exam-listen-sections/${id}`);

export const deleteQuestion = (id: string): Promise<string> =>
  api.delete(`/exam-passage-questions/${id}`);

export const deleteListenQuestion = (id: string): Promise<string> =>
  api.delete(`/exam-listen-questions/${id}`);

export const deleteSpeakingPart = (id: string): Promise<string> =>
  api.delete(`/exam-speak-parts/${id}`);

export const getFullExamDetail = (id: string): Promise<IExamDetail> =>
  api.get(`/exams/exam-detail/${id}`);

export const createPassage = (data: ICreatePassage): Promise<string> =>
  api.post(`/exam-passages/`, data);

export const createPart = (data: FormData): Promise<string> =>
  api.post(`/exam-writings/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const createSpeakingPart = (data: { examId: string }): Promise<string> =>
  api.post(`/exam-speak-parts/`, data);

export const createSpeakingQuestion = (data: FormData): Promise<string> =>
  api.post(`/exam-speak-questions/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editSpeakingQuestion = (
  id: string,
  data: FormData
): Promise<string> =>
  api.patch(`/exam-speak-questions/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const createSection = (data: { examId: string }): Promise<string> =>
  api.post(`/exam-listen-sections/`, data);

export const createType = (data: FormData): Promise<string> =>
  api.post(`/exam-reading-types`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const createListeningType = (
  data: ICreateListeningType
): Promise<string> => api.post(`/exam-listen-types`, data);

export const createQuestion = (data: ICreateQuestion): Promise<string> =>
  api.post(`/exam-passage-questions`, data);

export const createListeningQuestion = (
  data: ICreateListeningQuestion
): Promise<string> => api.post(`/exam-listen-questions`, data);

export const getTotalExam = (): Promise<number> => api.get(`/exams/total-exam`);

export const editPassage = (id: string, data: IEditPassage): Promise<string> =>
  api.patch(`/exam-passages/${id}`, data);

export const editType = (data: FormData, id: string): Promise<string> =>
  api.patch(`/exam-reading-types/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const editListeningType = (
  data: { content: string },
  id: string
): Promise<string> => api.patch(`/exam-listen-types/${id}`, data);

export const editQuestion = (
  data: IEditQuestion,
  id: string
): Promise<string> => api.patch(`/exam-passage-questions/${id}`, data);

export const editListenQuestion = (
  data: IEditQuestion,
  id: string
): Promise<string> => api.patch(`/exam-listen-questions/${id}`, data);

export const editWriting = (data: FormData, id: string): Promise<string> =>
  api.put(`/exam-writings/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
