import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createPracticeWriting } from "@/api/AdminAPI/practice";
export const useCreatePracticeWriting = () => {
  return useMutation({
    mutationFn: (data: FormData) => createPracticeWriting(data),
    onSuccess() {
      toast.success("Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
