import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { ICreateListeningQuestion } from "@/types/AdminType/exam";
import { createListeningQuestion } from "@/api/AdminAPI/exam";
export const useCreateListeningQuestion = () => {
  return useMutation({
    mutationFn: (data: ICreateListeningQuestion) =>
      createListeningQuestion(data),
    onSuccess() {
      toast.success("Create Question Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
