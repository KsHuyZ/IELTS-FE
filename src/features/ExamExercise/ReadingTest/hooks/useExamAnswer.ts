import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { IUserAnswer } from "@/types/ExamType/exam";
import { userExamAnswers } from "@/api/ExamAPI/readingExam";
export const useExamAnswers = () => {
  return useMutation({
    mutationFn: (values: IUserAnswer[]) => userExamAnswers(values),
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
