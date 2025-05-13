import { api } from "@/lib/api";
import {
  IPracticeDetail,
} from "@/types/AdminType/exam";
import { ICreatePracticeListeningQuestion, ICreatePracticeListeningType, ICreateReadingPracticeQuestion } from "@/types/AdminType/practice";
import { IExcerciseDetail } from "@/types/excercise";

export const createPractice = (practice: FormData): Promise<IExcerciseDetail> =>
  api.post("/practices", practice, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deletePractice = (id: string): Promise<string> =>
  api.delete(`/practices/${id}`);

export const createPracticePassage = (data: FormData): Promise<string> =>
  api.post(`/practice-readings/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const getFullPracticeDetail = (
  id: string
): Promise<IPracticeDetail | IPracticeDetail[]> =>
  api.get(`/practices/detail/${id}`);

export const createPracticeType = (data: FormData): Promise<string> =>
  api.post(`/practice-reading-types`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const createReadingPracticeQuestion = (
  data: ICreateReadingPracticeQuestion
): Promise<string> => api.post(`/practice-reading-questions`, data);

export const createPracticeListen = (practice: FormData): Promise<string> =>
  api.post("/practice-listens", practice, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const createPracticeWriting = (practice: FormData): Promise<string> =>
  api.post("/practice-writings", practice, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const createPracticeSpeaking = (practice: FormData): Promise<string> =>
  api.post("/practice-speaking-questions", practice, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const createPracticeListeningType = (
  data: ICreatePracticeListeningType
): Promise<string> => api.post(`/practice-listen-types`, data);

export const createListeningPracticeQuestion = (
  data: ICreatePracticeListeningQuestion
): Promise<string> => api.post(`/practice-listen-questions`, data);

export const getTotalPractices = (): Promise<number> =>
  api.get(`/practices/total-practice`);

export const editPractice = (
  practice: FormData,
  id: string
): Promise<IExcerciseDetail> =>
  api.patch(`/practices/${id}`, practice, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });