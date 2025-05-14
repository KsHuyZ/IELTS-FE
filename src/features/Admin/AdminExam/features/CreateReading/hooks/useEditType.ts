import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editType } from "@/api/AdminAPI/exam";
export const useEditType = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => editType(data, id),
    onSuccess() {
      toast.success("Edit Type Passage Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
