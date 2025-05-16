import { getFullPracticeDetail, getFullPracticeDetailAdmin } from "@/api/AdminAPI/practice";
import { useQuery } from "@tanstack/react-query";

export const useGetPracticeDetail = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["getFullPracticeDetail", id],
    queryFn: () => getFullPracticeDetail(id),
    enabled: !!id,
  });
  return { data, error, isLoading, refetch };
};
export const useGetFullPracticeDetailAdmin = (id: string) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["getFullPracticeDetailAdmin", id],
    queryFn: () => getFullPracticeDetailAdmin(id),
    enabled: !!id,
  });
  return { data, error, isLoading, refetch };
};
