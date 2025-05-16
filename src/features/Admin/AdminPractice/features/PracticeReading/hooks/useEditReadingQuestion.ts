import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { IEditQuestion } from "@/types/AdminType/exam";
import { editReadingQuestion } from "@/api/AdminAPI/practice";
export const useEditReadingQuestion = (id: string) => {
  return useMutation({
    mutationFn: (data: IEditQuestion) => editReadingQuestion(data, id),
    onSuccess() {
      toast.success("Edit Question Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
