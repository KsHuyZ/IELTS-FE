import { getListeningPracticeById } from "@/api/PracticeAPI/listeningPractice";
import { PracticeListening } from "@/types/PracticeType/listeningPractice";
import { useQuery } from "@tanstack/react-query";

export const useListeningPracticeSection = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery<
    PracticeListening,
    Error
  >({
    queryKey: ["practiceSection"],
    queryFn: () => getListeningPracticeById(id),
    enabled: !!id,
  });
  return { data, error, isLoading, refetch };
};
