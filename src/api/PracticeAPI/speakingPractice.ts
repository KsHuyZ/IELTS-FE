import { api } from "@/lib/api";
import { PracticeSpeaking } from "@/types/PracticeType/speakingPractice";
export const getSpeakingPracticeById = (
  id: string
): Promise<PracticeSpeaking[]> => api.get(`/practices/${id}`)