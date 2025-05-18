import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editListeningPracticeQuestion } from "@/api/AdminAPI/practice";
import { ICreatePracticeListeningQuestion, IEditPracticeListeningQuestion } from "@/types/AdminType/practice";
export const useEditListeningPracticeQuestion = (id: string) => {
  return useMutation({
    mutationFn: (data: IEditPracticeListeningQuestion) =>
      editListeningPracticeQuestion(data, id),
    onSuccess() {
      toast.success("Edit Question Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
