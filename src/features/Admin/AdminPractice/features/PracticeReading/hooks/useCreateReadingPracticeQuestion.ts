import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { createReadingPracticeQuestion } from "@/api/AdminAPI/practice";
import { ICreateReadingPracticeQuestion } from "@/types/AdminType/practice";
export const useCreateReadingPracticeQuestion = () => {
  return useMutation({
    mutationFn: (data: ICreateReadingPracticeQuestion) =>
      createReadingPracticeQuestion(data),
    onSuccess() {
      toast.success("Create Question Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
