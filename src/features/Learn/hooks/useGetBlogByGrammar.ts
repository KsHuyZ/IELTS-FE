import { getBlogGrammar } from "@/api/learn";
import { IBlog, IRequestBlogGrammar } from "@/types/LearnType/blog";
import { useQuery } from "@tanstack/react-query";

export const useGetBlogByGrammar = ({
  page = 1,
  limit = 5,
  grammarPointId,
}: IRequestBlogGrammar) => {
  const { data, error, isLoading, refetch } = useQuery<IBlog, Error>({
    queryKey: ["getBlogGrammar", page, grammarPointId],
    queryFn: () => getBlogGrammar({ page, limit, grammarPointId }),
  });
  return { data, error, isLoading, refetch };
};
