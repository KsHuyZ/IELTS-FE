import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editPracticeWriting } from "@/api/AdminAPI/practice";
export const useEditPracticeWriting = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => editPracticeWriting(data, id),
    onSuccess() {
      toast.success("Edit Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
