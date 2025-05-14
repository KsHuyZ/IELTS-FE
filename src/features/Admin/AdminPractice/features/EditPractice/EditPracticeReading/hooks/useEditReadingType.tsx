import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editPracticeReadingType } from "@/api/AdminAPI/practice";
export const useEditReadingType = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => editPracticeReadingType(data, id),
    onSuccess() {
      toast.success("Edit Type Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
