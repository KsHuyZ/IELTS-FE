import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editSpeakingQuestion } from "@/api/AdminAPI/exam";
export const useEditSpeakingQuestion = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => editSpeakingQuestion(id, data),
    onSuccess() {
      toast.success("Edit Question Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
