import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editPracticeListen } from "@/api/AdminAPI/practice";
export const useEditPracticeListening = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => editPracticeListen(data, id),
    onSuccess() {
      toast.success("Edit Audio Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
