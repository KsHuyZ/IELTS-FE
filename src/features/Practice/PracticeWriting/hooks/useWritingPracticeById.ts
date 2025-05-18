import { getWritingPracticeById } from "@/api/PracticeAPI/writingPractice";
import { IPracticeWriting } from "@/types/PracticeType/writingPractice";
import { useQuery } from "@tanstack/react-query";

export const useWritingPracticeById = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery<IPracticeWriting, Error>(
    {
      queryKey: ["writingPractice"],
      queryFn: () => getWritingPracticeById(id),
      enabled: !!id,
    }
  );
  return { data, error, isLoading, refetch };
};
