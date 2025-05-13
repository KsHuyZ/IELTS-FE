import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { IEditQuestion } from "@/types/AdminType/exam";
import { editListenQuestion } from "@/api/AdminAPI/exam";
export const useEditListenQuestion = (id: string) => {
  return useMutation({
    mutationFn: (data: IEditQuestion) => editListenQuestion(data, id),
    onSuccess() {
      toast.success("Edit Question Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
