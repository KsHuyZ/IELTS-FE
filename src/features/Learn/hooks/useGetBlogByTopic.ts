import { getBlogTopic } from "@/api/learn";
import { IBlog, IRequestBlog } from "@/types/LearnType/blog";
import { useQuery } from "@tanstack/react-query";

export const useGetBlogByTopic = ({
  page = 1,
  limit = 5,
  topicId,
}: IRequestBlog) => {
  const { data, error, isLoading, refetch } = useQuery<IBlog, Error>({
    queryKey: ["getBlogByTopic", topicId, page],
    queryFn: () => getBlogTopic({ page, limit, topicId }),
  });
  return { data, error, isLoading, refetch };
};
