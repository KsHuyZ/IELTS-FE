import { getYear } from "@/api/ExamAPI/exam";
import { useQuery } from "@tanstack/react-query";

export const useGetYear = () => {
  const { data, error, isLoading, refetch } = useQuery<number[], Error>({
    queryKey: ["getYear"],
    queryFn: () => getYear(),
  });
  return { data, error, isLoading, refetch };
};
