import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editLearnBlog } from "@/api/AdminAPI/learn";
export const useEditBlog = (id: string) => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => editLearnBlog(data, id),
    onSuccess() {
      toast.success("Edit Blog Success");
      query.invalidateQueries({ queryKey: ["getBlogByTopic"] });
      query.invalidateQueries({ queryKey: ["getBlogGrammar"] });
      query.invalidateQueries({ queryKey: ["getBlogDetail"] });
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
