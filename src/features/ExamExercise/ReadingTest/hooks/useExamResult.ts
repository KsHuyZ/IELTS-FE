import { getExamReadingResult } from "@/api/ExamAPI/readingExam";
import { IExamResult } from "@/types/ExamType/exam";
import { useQuery } from "@tanstack/react-query";

export const useExamResult = (idResult: string) => {
  const { data, error, isLoading, refetch } = useQuery<IExamResult, Error>({
    queryKey: ["examResult"],
    queryFn: () => getExamReadingResult(idResult),
    enabled: !!idResult,
  });
  return { data, error, isLoading, refetch };
};
