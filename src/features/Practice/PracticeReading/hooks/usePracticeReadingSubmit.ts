import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { IExamAnswerSubmit } from "@/types/ExamType/exam";
import { practiceSubmit } from "@/api/PracticeAPI/practice";
export const usePracticeSubmit = (id: string) => {
  return useMutation({
    mutationFn: (values: IExamAnswerSubmit[]) =>
      practiceSubmit(values, id),
    onSuccess() {
      toast.success("Submit success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
