import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { validateError } from "@/utils/validate";
import {
  editPracticeSpeaking,
} from "@/api/AdminAPI/practice";
export const useEditPracticeSpeaking = (id: string) => {
  return useMutation({
    mutationFn: (data: FormData) => editPracticeSpeaking(data, id),
    onSuccess() {
      toast.success("Edit Practice Success");
    },
    onError(error) {
      toast.error(validateError(error));
    },
  });
};
