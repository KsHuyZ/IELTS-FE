import { getSpeakingPracticeById } from "@/api/PracticeAPI/speakingPractice";
import { PracticeSpeaking } from "@/types/PracticeType/speakingPractice";
import { useQuery } from "@tanstack/react-query";

export const useGetPracticeSpeaking = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery<
    PracticeSpeaking[],
    Error
  >({
    queryKey: ["PracticeSection"],
    queryFn: () => getSpeakingPracticeById(id),
    enabled: !!id,
  });
  return { data, error, isLoading, refetch };
};
