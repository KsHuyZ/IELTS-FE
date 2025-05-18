import { api } from "@/lib/api";
import { PracticeListening } from "@/types/PracticeType/listeningPractice";

export const getListeningPracticeById = (id: string): Promise<PracticeListening> =>
  api.get(`/practices/${id}`)
