import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import { editPracticePassage } from "@/api/AdminAPI/practice";
import { IEditReadingPassage } from "@/types/AdminType/practice";
export const useEditReadingPassage = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => editPracticePassage(data, id),
    onSuccess() {
      toast.success("Edit Passage Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
