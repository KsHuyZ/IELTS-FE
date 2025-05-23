import { api } from "@/lib/api";
import { IEditQuestion, IPracticeDetail } from "@/types/AdminType/exam";
import {
  ICreatePracticeListeningQuestion,
  ICreatePracticeListeningType,
  ICreateReadingPracticeQuestion,
  IEditPracticeListeningQuestion,
  IEditPracticeListeningType,
  IFullPractice,
} from "@/types/AdminType/practice";
import { IExcerciseDetail } from "@/types/excercise";

export const createPractice = (practice: FormData): Promise<IExcerciseDetail> =>
  api.post("/practices", practice, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deletePractice = (id: string): Promise<string> =>
  api.delete(`/practices/${id}`);
export const deletePracticeQuestion = (id: string): Promise<string> =>
  api.delete(`/practice-reading-questions/${id}`);
export const deleteListeningPracticeQuestion = (id: string): Promise<string> =>
  api.delete(`/practice-listen-questions/${id}`);

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
export const getFullPracticeDetailAdmin = (
  id: string
): Promise<IFullPractice> => api.get(`/practices/detail-practice-type/${id}`);

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
export const editPracticePassage = (
  data: FormData,
  id: string
): Promise<IExcerciseDetail> =>
  api.patch(`/practice-readings/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editPracticeReadingType = (
  data: FormData,
  id: string
): Promise<IExcerciseDetail> =>
  api.patch(`/practice-reading-types/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editReadingQuestion = (
  data: IEditQuestion,
  id: string
): Promise<string> => api.patch(`/practice-reading-questions/${id}`, data);
export const editPracticeListen = (
  practice: FormData,
  id: string
): Promise<string> =>
  api.patch(`/practice-listens/${id}`, practice, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editPracticeListeningType = (
  data: IEditPracticeListeningType,
  id: string
): Promise<string> => api.patch(`/practice-listen-types/${id}`, data);
export const editListeningPracticeQuestion = (
  data: IEditPracticeListeningQuestion,
  id: string
): Promise<string> => api.patch(`/practice-listen-questions/${id}`, data);
export const editPracticeWriting = (practice: FormData, id: string): Promise<string> =>
  api.patch(`/practice-writings/${id}`, practice, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const editPracticeSpeaking = (practice: FormData, id: string): Promise<string> =>
  api.patch(`/practice-speaking-questions/${id}`, practice, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });