import { api } from "@/lib/api";
import { IPracticeWriting } from "@/types/PracticeType/writingPractice";

export const getWritingPracticeById = (id: string): Promise<IPracticeWriting> =>
  api.get(`/practices/${id}`);
export const practiceExitWriting = (
  data: {answer: string},
  id: string
): Promise<string> => api.post(`/practices/exit/${id}`, data);
export const practiceWritingSubmit = (
  data: {answer: string},
  id: string
): Promise<string> => api.post(`/practices/submit/${id}`, data);