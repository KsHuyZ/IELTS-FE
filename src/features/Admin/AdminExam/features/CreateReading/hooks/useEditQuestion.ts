import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { IEditQuestion } from "@/types/AdminType/exam";
import { editQuestion } from "@/api/AdminAPI/exam";
export const useEditQuestion = (id: string) => {
  return useMutation({
    mutationFn: (data: IEditQuestion) => editQuestion(data, id),
    onSuccess() {
      toast.success("Edit Question Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
