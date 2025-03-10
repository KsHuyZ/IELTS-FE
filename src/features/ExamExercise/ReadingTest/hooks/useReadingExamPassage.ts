import { getReadingExamById } from "@/api/readingExam";
import { IExam } from "@/types/exam";
import { ExamPassage } from "@/types/readingExam";
import { useQuery } from "@tanstack/react-query";

export const useReadingExamPassage = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery<IExam<ExamPassage>, Error>({
    queryKey: ["exampassage"],
    queryFn: () => getReadingExamById(id),
    enabled: !!id,
  });
  return { data, error, isLoading, refetch };
};
