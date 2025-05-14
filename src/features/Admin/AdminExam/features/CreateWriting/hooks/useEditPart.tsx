import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editWriting } from "@/api/AdminAPI/exam";
export const useEditPart = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => editWriting(data, id),
    onSuccess() {
      toast.success("Edit Part Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
