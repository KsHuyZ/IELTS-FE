import { getFullPracticeDetail } from "@/api/AdminAPI/practice";
import { useQuery } from "@tanstack/react-query";

export const useGetPracticeDetail = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["getFullPracticeDetail", id],
    queryFn: () => getFullPracticeDetail(id),
    enabled: !!id,
  });
  return { data, error, isLoading, refetch };
};
